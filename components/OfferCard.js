'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Store } from 'lucide-react';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CountdownTimer({ expiryMinutes }) {
  const totalSeconds = expiryMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);

  useEffect(() => {
    setTimeLeft(expiryMinutes * 60);
  }, [expiryMinutes]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const isUrgent = timeLeft <= 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={128} height={128} viewBox="0 0 128 128">
        {/* Track ring */}
        <circle
          cx={64}
          cy={64}
          r={RADIUS}
          fill="none"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth={6}
        />
        {/* Progress ring */}
        <circle
          cx={64}
          cy={64}
          r={RADIUS}
          fill="none"
          stroke={isUrgent ? '#F59E0B' : '#7C3AED'}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 64 64)"
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${isUrgent ? 'rgba(245,158,11,0.6)' : 'rgba(124,58,237,0.6)'})`,
          }}
        />
        {/* Time label */}
        <text
          x="64"
          y="60"
          textAnchor="middle"
          fill="#F1F5F9"
          fontSize="22"
          fontWeight="700"
          fontFamily="Raleway, sans-serif"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </text>
        <text
          x="64"
          y="80"
          textAnchor="middle"
          fill="#64748B"
          fontSize="10"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.08em"
        >
          REMAINING
        </text>
      </svg>
    </div>
  );
}

function WordRevealHeadline({ headline }) {
  const words = headline ? headline.split(' ') : [];
  const [revealedCount, setRevealedCount] = useState(0);
  const prevHeadline = useRef(null);

  useEffect(() => {
    if (prevHeadline.current !== headline) {
      setRevealedCount(0);
      prevHeadline.current = headline;
    }
  }, [headline]);

  useEffect(() => {
    if (revealedCount >= words.length) return;
    const id = setInterval(() => setRevealedCount((c) => c + 1), 80);
    return () => clearInterval(id);
  }, [revealedCount, words.length]);

  return (
    <h2
      style={{
        fontFamily: '"Raleway", sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(22px, 4vw, 28px)',
        lineHeight: '1.4',
        color: '#F1F5F9',
        margin: 0,
        textAlign: 'center',
        letterSpacing: '-0.02em',
        minHeight: 'calc(2.5em + 8px)',
        paddingBottom: '8px',
        overflow: 'visible',
      }}
    >
      {words.map((word, i) => (
        <span
          key={`${headline}-${i}`}
          style={{
            display: 'inline-block',
            marginRight: '0.28em',
            opacity: i < revealedCount ? 1 : 0,
            transform: i < revealedCount ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {word}
        </span>
      ))}
    </h2>
  );
}

export default function OfferCard({ offer, onClaim }) {
  if (!offer) return null;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      key={offer.token}
      style={{
        background: 'rgba(13,13,26,0.9)',
        border: '1px solid rgba(139,92,246,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 24,
        maxWidth: 480,
        margin: '0 auto',
        padding: '40px 36px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}
    >
      {/* Emoji */}
      <div style={{ fontSize: 64, lineHeight: 1, userSelect: 'none' }}>
        {offer.emoji}
      </div>

      {/* Merchant + Distance badges */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px 8px',
            borderRadius: 999,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: 13,
            lineHeight: '1.4',
            color: '#C4B5FD',
            overflow: 'visible',
          }}
        >
          <Store size={13} strokeWidth={2} />
          {offer.merchant}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px 8px',
            borderRadius: 999,
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.25)',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: 13,
            color: '#67E8F9',
          }}
        >
          <MapPin size={13} strokeWidth={2} />
          {offer.distance}
        </div>
      </div>

      {/* Word-by-word headline */}
      <WordRevealHeadline headline={offer.headline} />

      {/* Discount */}
      <div
        style={{
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(56px, 12vw, 80px)',
          lineHeight: '1.4',
          paddingBottom: '8px',
          overflow: 'visible',
          background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.03em',
        }}
      >
        {offer.discount}
      </div>

      {/* Product */}
      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          fontSize: 15,
          color: '#64748B',
          margin: 0,
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {offer.product}
      </p>

      {/* Countdown timer */}
      <CountdownTimer expiryMinutes={offer.expiry} />

      {/* Token */}
      <div
        style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: 13,
          color: '#475569',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        Code: {offer.token}
      </div>

      {/* Claim button */}
      <button
        onClick={onClaim}
        style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 14,
          border: 'none',
          background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
          boxShadow: '0 0 32px rgba(124,58,237,0.5)',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: 16,
          color: '#F1F5F9',
          cursor: 'pointer',
          transition: 'box-shadow 0.25s ease, transform 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.75)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 32px rgba(124,58,237,0.5)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
        }}
      >
        Claim This Offer
      </button>
    </motion.div>
  );
}
