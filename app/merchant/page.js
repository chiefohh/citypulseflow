'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import AuroraBackground from '@/components/AuroraBackground';
import NavBar from '@/components/NavBar';

/* ── Hourly chart data 08:00 – 20:00 ── */
const hourlyData = [
  { hour: '08:00', generated: 2,  redeemed: 1  },
  { hour: '09:00', generated: 4,  redeemed: 2  },
  { hour: '10:00', generated: 5,  redeemed: 3  },
  { hour: '11:00', generated: 7,  redeemed: 5  },
  { hour: '12:00', generated: 9,  redeemed: 7  },
  { hour: '13:00', generated: 8,  redeemed: 6  },
  { hour: '14:00', generated: 4,  redeemed: 3  },
  { hour: '15:00', generated: 3,  redeemed: 2  },
  { hour: '16:00', generated: 4,  redeemed: 3  },
  { hour: '17:00', generated: 5,  redeemed: 4  },
  { hour: '18:00', generated: 6,  redeemed: 5  },
  { hour: '19:00', generated: 7,  redeemed: 6  },
  { hour: '20:00', generated: 3,  redeemed: 2  },
];

/* ── Recent offers table data ── */
const recentOffers = [
  { time: '20:14', offer: 'Rainy evening hot chocolate', merchant: 'Café Schlossgarten', discount: '20%',  status: 'redeemed' },
  { time: '19:58', offer: 'After-work Maultaschen deal',  merchant: 'Gasthaus Bohnenviertel', discount: '15%', status: 'claimed'  },
  { time: '19:41', offer: 'Cold night warm ramen',        merchant: 'Noodle Bar Mitte',     discount: '25%', status: 'redeemed' },
  { time: '19:30', offer: 'Evening cocktail 2-for-1',     merchant: 'Bar Nord 21',          discount: '2-for-1', status: 'expired'  },
  { time: '19:12', offer: 'Quiet hour pizza slice',       merchant: 'Pizzeria Süd',         discount: '30%', status: 'redeemed' },
  { time: '18:55', offer: 'Pre-dinner aperitivo',         merchant: 'Enoteca West',         discount: '18%', status: 'claimed'  },
  { time: '18:33', offer: 'Gym protein shake deal',       merchant: 'FitStop Stuttgart',    discount: '10%', status: 'generated'},
  { time: '18:10', offer: 'Rush hour taxi voucher',       merchant: 'City Cabs GmbH',       discount: '5 EUR', status: 'redeemed'},
];

const statusConfig = {
  redeemed:  { label: 'Redeemed',  bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',  color: '#22C55E' },
  claimed:   { label: 'Claimed',   bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', color: '#F59E0B' },
  generated: { label: 'Generated', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.4)', color: '#60A5FA' },
  expired:   { label: 'Expired',   bg: 'rgba(100,116,139,0.12)',border: 'rgba(100,116,139,0.4)',color: '#64748B' },
};

/* ── Stat card with counting animation ── */
const statCards = [
  { label: 'Offers Generated', value: 47,  suffix: '',      accent: '#60A5FA', glow: 'rgba(96,165,250,0.3)'   },
  { label: 'Claimed',          value: 31,  suffix: '',      accent: '#7C3AED', glow: 'rgba(124,58,237,0.3)'   },
  { label: 'Redeemed',         value: 28,  suffix: '',      accent: '#22C55E', glow: 'rgba(34,197,94,0.3)'    },
  { label: 'Revenue Recovered',value: 340, suffix: ' EUR',  accent: '#F59E0B', glow: 'rgba(245,158,11,0.3)'   },
  { label: 'Traffic Lift',     value: 38,  suffix: '%',     accent: '#06B6D4', glow: 'rgba(6,182,212,0.3)',  prefix: '+' },
];

function StatCard({ label, value, suffix, prefix = '', accent, glow }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const steps = 60;
    const interval = 1500 / steps;
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      setCount(Math.round((value / steps) * current));
      if (current >= steps) {
        setCount(value);
        clearInterval(id);
      }
    }, interval);
    return () => clearInterval(id);
  }, [value]);

  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: 160,
        background: 'rgba(13,13,26,0.8)',
        border: `1px solid rgba(${hexToRgb(accent)},0.25)`,
        borderRadius: 16,
        padding: '24px 20px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 0 0 transparent`,
        transition: 'box-shadow 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 28px ${glow}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 0 transparent'; }}
    >
      <p style={{
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        fontSize: 11,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        margin: '0 0 12px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: '"Raleway", sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(24px, 3vw, 36px)',
        color: accent,
        margin: 0,
        letterSpacing: '-0.02em',
        lineHeight: '1.4',
        paddingBottom: '4px',
        overflow: 'visible',
      }}>
        {prefix}{count}{suffix}
      </p>
    </div>
  );
}

/* ── Custom tooltip for chart ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(13,13,26,0.95)',
      border: '1px solid rgba(139,92,246,0.3)',
      borderRadius: 10,
      padding: '10px 14px',
      fontFamily: '"Inter", sans-serif',
      fontSize: 13,
    }}>
      <p style={{ color: '#94A3B8', margin: '0 0 6px', fontWeight: 600 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: '2px 0', fontWeight: 500 }}>
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function MerchantPage() {
  return (
    <div style={{ background: '#050508', minHeight: '100vh' }}>
      <AuroraBackground />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <NavBar />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px 80px' }}>

          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: '#475569',
              textDecoration: 'none',
              marginBottom: 32,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Back to demo
          </Link>

          {/* Heading */}
          <h1 style={{
            fontFamily: '"Raleway", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: '1.4',
            paddingBottom: '4px',
            overflow: 'visible',
            color: '#F1F5F9',
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
          }}>
            Merchant Intelligence Dashboard
          </h1>
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 15,
            color: '#475569',
            margin: '0 0 48px',
          }}>
            Today's real-time performance · Stuttgart region · Updated live
          </p>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Chart */}
          <div style={{
            background: 'rgba(13,13,26,0.8)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20,
            padding: '28px 24px 16px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            marginBottom: 48,
          }}>
            <h2 style={{
              fontFamily: '"Raleway", sans-serif',
              fontWeight: 700,
              fontSize: 18,
              lineHeight: '1.4',
              paddingBottom: '4px',
              overflow: 'visible',
              color: '#F1F5F9',
              margin: '0 0 24px',
              letterSpacing: '-0.01em',
            }}>
              Hourly Offer Activity
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hourlyData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                  axisLine={{ stroke: 'rgba(139,92,246,0.15)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.06)' }} />
                <Legend
                  wrapperStyle={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#64748B', paddingTop: 16 }}
                />
                <Bar dataKey="generated" name="Generated" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="redeemed"  name="Redeemed"  fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent offers table */}
          <div style={{
            background: 'rgba(13,13,26,0.8)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 20,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '24px 28px 20px' }}>
              <h2 style={{
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 700,
                fontSize: 18,
                lineHeight: '1.4',
                paddingBottom: '4px',
                overflow: 'visible',
                color: '#F1F5F9',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                Recent Offers
              </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                    {['Time', 'Offer', 'Merchant', 'Discount', 'Status'].map((col) => (
                      <th key={col} style={{
                        padding: '10px 28px',
                        textAlign: 'left',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 600,
                        fontSize: 11,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        whiteSpace: 'nowrap',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOffers.map((row, i) => {
                    const s = statusConfig[row.status];
                    return (
                      <tr
                        key={i}
                        style={{
                          borderBottom: i < recentOffers.length - 1
                            ? '1px solid rgba(139,92,246,0.08)'
                            : 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={tdStyle}>
                          <span style={{ fontFamily: '"Courier New", monospace', fontSize: 13, color: '#475569' }}>
                            {row.time}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#CBD5E1', maxWidth: 240 }}>
                          {row.offer}
                        </td>
                        <td style={{ ...tdStyle, color: '#64748B', whiteSpace: 'nowrap' }}>
                          {row.merchant}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            fontFamily: '"Raleway", sans-serif',
                            fontWeight: 700,
                            fontSize: 14,
                            lineHeight: '1.4',
                            paddingBottom: '2px',
                            overflow: 'visible',
                            color: '#F1F5F9',
                          }}>
                            {row.discount}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 999,
                            background: s.bg,
                            border: `1px solid ${s.border}`,
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 600,
                            fontSize: 12,
                            color: s.color,
                            whiteSpace: 'nowrap',
                          }}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Rule Configuration */}
          <div style={{ marginTop: 48 }}>
            <h2 style={{
              fontFamily: '"Raleway", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(20px, 3vw, 28px)',
              lineHeight: '1.4',
              paddingBottom: '4px',
              overflow: 'visible',
              color: '#F1F5F9',
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}>
              AI Rule Configuration
            </h2>
            <p style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: 14,
              color: '#475569',
              margin: '0 0 28px',
            }}>
              Define the boundaries. Claude AI generates the offers autonomously within them.
            </p>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <RuleCard
                title="Quiet Hours Promotion"
                description="Automatically trigger discount offers during predictably slow afternoon hours to recover foot traffic."
                params={[
                  { label: 'Time Window',    value: '14:00 – 16:00', source: 'merchant', accent: '#06B6D4' },
                  { label: 'Days',           value: 'Weekdays only', source: 'merchant', accent: '#06B6D4' },
                  { label: 'Max Discount',   value: '20%',           source: 'merchant', accent: '#F59E0B' },
                  { label: 'Target Segment', value: 'Warm drink customers', source: 'merchant', accent: '#7C3AED' },
                  { label: 'Headline',       value: 'AI generated',  source: 'ai',       accent: '#22C55E' },
                  { label: 'Offer Copy',     value: 'AI generated',  source: 'ai',       accent: '#22C55E' },
                ]}
              />
              <RuleCard
                title="Low Traffic Alert"
                description="Detect when hourly transactions drop below threshold and fire hyper-local offers to nearby potential customers."
                params={[
                  { label: 'Trigger Threshold', value: '< 5 txn / hour', source: 'merchant', accent: '#06B6D4' },
                  { label: 'Max Discount',      value: '15%',            source: 'merchant', accent: '#F59E0B' },
                  { label: 'Offer Type',        value: 'AI selected',    source: 'ai',       accent: '#22C55E' },
                  { label: 'Target Radius',     value: 'AI optimised',   source: 'ai',       accent: '#22C55E' },
                  { label: 'Expiry Window',     value: 'AI generated',   source: 'ai',       accent: '#22C55E' },
                ]}
              />
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: 28,
              padding: '16px 22px',
              borderRadius: 12,
              background: 'rgba(124,58,237,0.06)',
              border: '1px solid rgba(124,58,237,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
              <p style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: 13,
                color: '#64748B',
                margin: 0,
                lineHeight: 1.6,
              }}>
                <strong style={{ color: '#94A3B8', fontWeight: 600 }}>Rules are set by merchants.</strong>
                {' '}Offers are generated autonomously by Claude AI — every headline, product choice,
                and emotional hook is unique, created in real time based on live context signals.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* ── Toggle switch ── */
function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: on ? 'linear-gradient(135deg, #7C3AED, #4338CA)' : 'rgba(71,85,105,0.4)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.25s ease',
        flexShrink: 0,
        boxShadow: on ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
      }}
      aria-label="Toggle rule"
    >
      <span style={{
        position: 'absolute',
        top: 3,
        left: on ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#F1F5F9',
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  );
}

/* ── Rule card ── */
function RuleCard({ title, description, params }) {
  const [active, setActive] = useState(true);

  return (
    <div style={{
      flex: '1 1 420px',
      background: 'rgba(13,13,26,0.8)',
      border: `1px solid ${active ? 'rgba(139,92,246,0.3)' : 'rgba(71,85,105,0.2)'}`,
      borderRadius: 20,
      padding: '28px 28px 24px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      transition: 'border-color 0.3s ease, opacity 0.3s ease',
      opacity: active ? 1 : 0.55,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
        <div>
          <h3 style={{
            fontFamily: '"Raleway", sans-serif',
            fontWeight: 700,
            fontSize: 17,
            lineHeight: '1.4',
            paddingBottom: '4px',
            overflow: 'visible',
            color: '#F1F5F9',
            margin: '0 0 6px',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: 13,
            color: '#475569',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {description}
          </p>
        </div>
        <Toggle on={active} onToggle={() => setActive((v) => !v)} />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, margin: '16px 0 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#06B6D4', display: 'inline-block' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#475569', letterSpacing: '0.05em' }}>Set by Merchant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: '#22C55E', display: 'inline-block' }} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 11, color: '#475569', letterSpacing: '0.05em' }}>Generated by AI</span>
        </div>
      </div>

      {/* Parameter pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {params.map((p) => (
          <div key={p.label} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: '8px 14px',
            borderRadius: 10,
            background: `rgba(${hexToRgb(p.accent)}, 0.08)`,
            border: `1px solid rgba(${hexToRgb(p.accent)}, 0.25)`,
          }}>
            <span style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: 10,
              color: p.source === 'ai' ? '#22C55E' : '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}>
              {p.label}
            </span>
            <span style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: 13,
              color: p.accent,
            }}>
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

const tdStyle = {
  padding: '14px 28px',
  fontFamily: '"Inter", sans-serif',
  fontSize: 14,
  color: '#94A3B8',
  verticalAlign: 'middle',
};
