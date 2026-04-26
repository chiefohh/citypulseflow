'use client';

import { motion } from 'framer-motion';
import { CloudRain, Brain, QrCode } from 'lucide-react';

const cards = [
  {
    icon: CloudRain,
    title: 'Context Sensing',
    accent: '#06B6D4',
    glowColor: 'rgba(6,182,212,0.35)',
    borderGlow: 'rgba(6,182,212,0.5)',
    description:
      'Weather, time, location and merchant demand read in real time.',
  },
  {
    icon: Brain,
    title: 'Claude AI Engine',
    accent: '#7C3AED',
    glowColor: 'rgba(124,58,237,0.35)',
    borderGlow: 'rgba(124,58,237,0.5)',
    description:
      'Claude generates a unique emotional offer every single time — no templates.',
  },
  {
    icon: QrCode,
    title: 'Live Redemption',
    accent: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.35)',
    borderGlow: 'rgba(245,158,11,0.5)',
    description:
      'One tap to claim, one scan to redeem, cashback in your wallet.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

function FeatureCard({ icon: Icon, title, accent, glowColor, borderGlow, description }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.03,
        boxShadow: `0 0 40px ${glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
        borderColor: borderGlow,
        transition: { duration: 0.25 },
      }}
      style={{
        flex: '1 1 0',
        minWidth: 260,
        position: 'relative',
        background: 'rgba(13,13,26,0.8)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: 20,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '36px 32px 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        cursor: 'default',
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: `rgba(${hexToRgb(accent)}, 0.12)`,
          border: `1px solid rgba(${hexToRgb(accent)}, 0.3)`,
          boxShadow: `0 0 20px rgba(${hexToRgb(accent)}, 0.25)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={accent} strokeWidth={1.75} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 700,
          fontSize: 20,
          lineHeight: '1.4',
          color: '#F1F5F9',
          margin: '0 0 12px',
          letterSpacing: '-0.01em',
          paddingBottom: '4px',
          overflow: 'visible',
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          fontSize: 15,
          lineHeight: 1.65,
          color: '#64748B',
          margin: '0 0 36px',
          paddingBottom: '4px',
          flexGrow: 1,
        }}
      >
        {description}
      </p>

      {/* Bottom gradient line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          borderRadius: '0 0 20px 20px',
          background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
    </motion.div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

export default function FeatureCards() {
  return (
    <section
      style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '100px 24px',
      }}
    >
      {/* Section heading */}
      <motion.h2
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          fontFamily: '"Raleway", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 52px)',
          lineHeight: '1.4',
          color: '#F1F5F9',
          textAlign: 'center',
          margin: '0 0 64px',
          letterSpacing: '-0.02em',
          paddingBottom: '4px',
          overflow: 'visible',
        }}
      >
        How CityPulseFlow Works
      </motion.h2>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        {cards.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </motion.div>
    </section>
  );
}
