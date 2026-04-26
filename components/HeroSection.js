'use client';

import { motion } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const stats = [
  { icon: '📍', label: '80m away' },
  { icon: '⚡', label: 'Real-time Claude AI' },
  { icon: '⏱', label: '12 min offers' },
];

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 120,
        paddingBottom: 80,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Badge */}
      <motion.div {...fadeUp(0)}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.3)',
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#7C3AED',
              boxShadow: '0 0 8px rgba(124,58,237,0.9)',
              display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: 13,
              color: '#C4B5FD',
              letterSpacing: '0.02em',
            }}
          >
            Powered by Claude AI
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h1 {...fadeUp(0.15)}
        style={{
          fontFamily: '"Syne", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(48px, 8vw, 96px)',
          lineHeight: 1.05,
          color: '#F1F5F9',
          margin: '0 0 24px',
          maxWidth: 900,
          letterSpacing: '-0.03em',
        }}
      >
        The offer that finds{' '}
        <span
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          YOU.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p {...fadeUp(0.30)}
        style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          fontSize: 'clamp(16px, 2.2vw, 20px)',
          lineHeight: 1.7,
          color: '#64748B',
          maxWidth: 600,
          margin: '0 0 48px',
        }}
      >
        CityPulseFlow detects your exact context and generates a
        hyper-personalized local offer before you even knew you needed it.
      </motion.p>

      {/* CTA Button */}
      <motion.div {...fadeUp(0.45)}>
        <a
          href="#demo"
          className="shimmer-btn"
          style={{
            display: 'inline-block',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            fontSize: 16,
            color: '#F1F5F9',
            textDecoration: 'none',
            padding: '16px 40px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
            boxShadow: '0 0 32px rgba(124,58,237,0.5)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.75)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 32px rgba(124,58,237,0.5)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Experience the Demo
        </a>
      </motion.div>

      {/* Stat pills */}
      <motion.div
        {...fadeUp(0.60)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          marginTop: 48,
        }}
      >
        {stats.map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 999,
              background: 'rgba(13,13,26,0.8)',
              border: '1px solid rgba(139,92,246,0.2)',
              backdropFilter: 'blur(8px)',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: '#94A3B8',
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </div>
        ))}
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .shimmer-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.18) 50%,
            transparent 100%
          );
          transition: left 0s;
        }

        .shimmer-btn:hover::before {
          left: 160%;
          transition: left 0.55s ease;
        }
      `}</style>
    </section>
  );
}
