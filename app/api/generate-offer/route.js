import { NextResponse } from 'next/server';

const VALID_WEATHER = new Set(['cold', 'rainy', 'sunny']);
const VALID_TIME = new Set(['morning', 'lunch', 'evening']);
const VALID_DEMAND = new Set(['low', 'high']);
const ALLOWED_KEYS = new Set(['weather', 'time', 'demand']);

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 1000;
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const extraKeys = Object.keys(body).filter((k) => !ALLOWED_KEYS.has(k));
  if (extraKeys.length > 0) {
    return NextResponse.json(
      { error: `Unknown fields: ${extraKeys.join(', ')}.` },
      { status: 400 }
    );
  }

  const { weather, time, demand } = body;

  if (!weather || !time || !demand) {
    return NextResponse.json(
      { error: 'Missing required fields: weather, time, demand.' },
      { status: 400 }
    );
  }

  if (!VALID_WEATHER.has(weather)) {
    return NextResponse.json(
      { error: `Invalid weather. Must be one of: ${[...VALID_WEATHER].join(', ')}.` },
      { status: 400 }
    );
  }

  if (!VALID_TIME.has(time)) {
    return NextResponse.json(
      { error: `Invalid time. Must be one of: ${[...VALID_TIME].join(', ')}.` },
      { status: 400 }
    );
  }

  if (!VALID_DEMAND.has(demand)) {
    return NextResponse.json(
      { error: `Invalid demand. Must be one of: ${[...VALID_DEMAND].join(', ')}.` },
      { status: 400 }
    );
  }

  const systemPrompt = `You are a hyper-local offer engine for Stuttgart, Germany. Given contextual signals, you generate a single compelling, time-sensitive local offer.

IMPORTANT: Generate the offer in English only. All text including merchant name, headline, and product description must be in English. The merchant should sound like a real local Stuttgart business but written in English (e.g. "Castle Garden Café", "The West Quarter Bistro", "South Side Pizza").

Respond with ONLY valid JSON — no markdown, no explanation, no code fences. The JSON object must contain exactly these fields:
- merchant: string (a plausible Stuttgart business name in English, referencing neighborhoods like City Center, Castle Garden, West Quarter, South Side, or North End)
- distance: string (walking distance, e.g. "80m away" or "3 min walk")
- headline: string (emotional, urgency-driven, exactly 8–10 words, in English)
- discount: string (e.g. "15%", "20%", "2-for-1", "free upgrade")
- product: string (specific item or service being offered, in English)
- expiry: number (minutes until the offer expires, e.g. 25)
- emoji: string (single emoji that best represents the offer)
- token: string (exactly 8 uppercase alphanumeric characters, e.g. "A3BF92XK")`;

  const userPrompt = `Generate a hyper-personalized local offer for someone currently in Stuttgart, Germany.

Context signals:
- Weather: ${weather}
- Time of day: ${time}
- Current demand level: ${demand}

The offer must feel urgently relevant to the weather and time. Low demand means the business is quiet and willing to offer deeper discounts. High demand means exclusivity and scarcity. Make the merchant feel like an authentic Stuttgart local business. All output must be in English.`;

  const requestBody = {
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  };

  console.log('[generate-offer] Sending request to Anthropic:', {
    model: requestBody.model,
    max_tokens: requestBody.max_tokens,
    context: { weather, time, demand },
    apiKeyPresent: !!process.env.ANTHROPIC_API_KEY,
    apiKeyPrefix: process.env.ANTHROPIC_API_KEY?.slice(0, 16),
  });

  let apiResponse;
  try {
    apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });
  } catch (err) {
    console.error('[generate-offer] Network error reaching Anthropic:', err);
    return NextResponse.json(
      { error: 'Failed to reach AI service.' },
      { status: 502 }
    );
  }

  console.log('[generate-offer] Anthropic response status:', apiResponse.status);

  if (!apiResponse.ok) {
    const errText = await apiResponse.text();
    console.error('[generate-offer] Anthropic error body:', errText);
    let errDetail = 'AI service returned an error.';
    try {
      const errJson = JSON.parse(errText);
      errDetail = errJson?.error?.message || errDetail;
    } catch {}
    return NextResponse.json({ error: errDetail }, { status: 502 });
  }

  const data = await apiResponse.json();
  console.log('[generate-offer] Anthropic response shape:', {
    id: data.id,
    model: data.model,
    stop_reason: data.stop_reason,
    contentBlocks: data.content?.length,
    firstBlockType: data.content?.[0]?.type,
  });

  const rawText = data.content?.[0]?.text?.trim();

  if (!rawText) {
    console.error('[generate-offer] No text in response content:', JSON.stringify(data.content));
    return NextResponse.json(
      { error: 'Empty response from AI service.' },
      { status: 502 }
    );
  }

  console.log('[generate-offer] Raw Claude text:', rawText.slice(0, 200));

  // Strip markdown code fences if Claude wrapped the JSON despite instructions
  let jsonStr = rawText;
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
    console.log('[generate-offer] Stripped code fence, extracted JSON');
  }

  // Fallback: extract first {...} block
  if (!jsonStr.startsWith('{')) {
    const objMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objMatch) {
      jsonStr = objMatch[0];
      console.log('[generate-offer] Extracted JSON object via regex fallback');
    }
  }

  let offer;
  try {
    offer = JSON.parse(jsonStr);
    console.log('[generate-offer] Successfully parsed offer:', offer);
  } catch (parseErr) {
    console.error('[generate-offer] JSON parse failed. Raw text was:', rawText);
    console.error('[generate-offer] Parse error:', parseErr.message);
    return NextResponse.json(
      { error: 'AI service returned malformed JSON.' },
      { status: 502 }
    );
  }

  return NextResponse.json(offer);
}
