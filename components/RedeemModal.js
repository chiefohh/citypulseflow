'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Check } from 'lucide-react';

const COLORS = ['#7C3AED', '#06B6D4', '#ffffff', '#F59E0B', '#C4B5FD'];
const SHAPES = ['square', 'circle'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function CSSConfetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.round(randomBetween(8, 16)),
      left: Math.round(randomBetween(5, 95)),
      duration: randomBetween(1.8, 3.2),
      delay: randomBetween(0, 0.8),
      rotation: Math.round(randomBetween(0, 360)),
      rotationEnd: Math.round(randomBetween(360, 1080)),
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));
  }, []);

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(var(--rot-start)); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(520px) rotate(var(--rot-end)); opacity: 0; }
        }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            '--rot-start': `${p.rotation}deg`,
            '--rot-end': `${p.rotationEnd}deg`,
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s both`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      ))}
    </>
  );
}

export default function RedeemModal({ offer, onClose }) {
  const [stage, setStage] = useState('claim');

  useEffect(() => {
    setStage('claim');
  }, [offer]);

  useEffect(() => {
    if (stage !== 'processing') return;
    const id = setTimeout(() => setStage('success'), 2500);
    return () => clearTimeout(id);
  }, [stage]);

  if (!offer) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: 'rgba(13,13,26,0.95)',
          border: '1px solid rgba(139,92,246,0.35)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          padding: '40px 32px 36px',
          overflow: 'hidden',
        }}
      >
        {/* CSS confetti — only rendered during success stage */}
        {stage === 'success' && <CSSConfetti />}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(139,92,246,0.25)',
            background: 'rgba(13,13,26,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            zIndex: 20,
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* ── CLAIM ── */}
        {stage === 'claim' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ fontSize: 56, lineHeight: 1 }}>{offer.emoji}</div>

            <div style={{ textAlign: 'center' }}>
              <p style={labelStyle}>Merchant</p>
              <p style={headingStyle}>{offer.merchant}</p>
            </div>

            <div style={qrWrapStyle}>
              <QRCodeCanvas value={offer.token} size={180} bgColor="#0D0D1A" fgColor="#F1F5F9" level="M" />
            </div>

            <div style={tokenBoxStyle}>{offer.token}</div>

            <button
              onClick={() => setStage('processing')}
              style={primaryBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.75)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = primaryBtnStyle.boxShadow;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Confirm at Register
            </button>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {stage === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            <p style={labelStyle}>Hold up to scanner</p>

            <div style={{
              ...qrWrapStyle,
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(34,197,94,0.35)',
              boxShadow: '0 0 24px rgba(34,197,94,0.15)',
            }}>
              <QRCodeCanvas value={offer.token} size={180} bgColor="#0D0D1A" fgColor="#F1F5F9" level="M" />
              <motion.div
                animate={{ y: [0, 172, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  left: 16, right: 16, top: 16,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
                  boxShadow: '0 0 10px rgba(34,197,94,0.9)',
                }}
              />
            </div>

            <motion.p
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, fontWeight: 500, color: '#94A3B8', margin: 0, textAlign: 'center' }}
            >
              Verifying with merchant terminal…
            </motion.p>

            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {stage === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative', zIndex: 5 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                border: '2px solid rgba(34,197,94,0.5)',
                boxShadow: '0 0 32px rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={40} color="#22C55E" strokeWidth={2.5} />
            </motion.div>

            <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28, color: '#F1F5F9', margin: 0, textAlign: 'center', letterSpacing: '-0.02em' }}>
              Redeemed Successfully
            </h2>

            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, color: '#64748B', margin: 0, textAlign: 'center' }}>
              {offer.merchant} · {offer.product}
            </p>

            <div style={{
              padding: '14px 32px', borderRadius: 999,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 32,
              color: '#22C55E', letterSpacing: '-0.02em',
            }}>
              {offer.discount} saved!
            </div>

            <button
              onClick={onClose}
              style={primaryBtnStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.75)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = primaryBtnStyle.boxShadow;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = {
  fontFamily: '"Inter", sans-serif',
  fontWeight: 500,
  fontSize: 12,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 4px',
};

const headingStyle = {
  fontFamily: '"Syne", sans-serif',
  fontWeight: 700,
  fontSize: 20,
  color: '#F1F5F9',
  margin: 0,
};

const qrWrapStyle = {
  padding: 16,
  background: '#0D0D1A',
  borderRadius: 16,
  border: '1px solid rgba(139,92,246,0.2)',
};

const tokenBoxStyle = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: 12,
  background: 'rgba(13,13,26,0.8)',
  border: '1px solid rgba(139,92,246,0.25)',
  backdropFilter: 'blur(8px)',
  textAlign: 'center',
  fontFamily: '"Courier New", Courier, monospace',
  fontWeight: 700,
  fontSize: 22,
  letterSpacing: '0.25em',
  color: '#C4B5FD',
  boxSizing: 'border-box',
};

const primaryBtnStyle = {
  width: '100%',
  padding: '15px 24px',
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
};
