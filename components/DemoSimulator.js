'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextSelector from './ContextSelector';
import OfferCard from './OfferCard';
import RedeemModal from './RedeemModal';

const INITIAL_CONTEXT = { weather: 'cold', time: 'lunch', demand: 'low' };

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      style={{
        display: 'inline-block',
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.25)',
        borderTopColor: '#F1F5F9',
        flexShrink: 0,
      }}
    />
  );
}

export default function DemoSimulator() {
  const [context, setContext] = useState(INITIAL_CONTEXT);
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleContextChange(key, value) {
    setContext((prev) => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setOffer(null);

    try {
      const res = await fetch('/api/generate-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: context.weather,
          time: context.time,
          demand: context.demand,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setOffer(data);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="demo"
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '120px 24px',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Heading */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: '"Raleway", sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(30px, 5vw, 48px)',
            lineHeight: '1.4',
            color: '#F1F5F9',
            textAlign: 'center',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
            paddingBottom: '4px',
            overflow: 'visible',
          }}
        >
          Generate Your Perfect Offer
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          style={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 400,
            fontSize: 16,
            color: '#475569',
            textAlign: 'center',
            margin: '0 0 56px',
          }}
        >
          Set your context. PulseEngine does the rest.
        </motion.p>

        {/* Context selector panel */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          style={{
            background: 'rgba(13,13,26,0.8)',
            border: '1px solid rgba(139,92,246,0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 20,
            padding: '32px 28px',
            marginBottom: 28,
          }}
        >
          <ContextSelector value={context} onChange={handleContextChange} />
        </motion.div>

        {/* Generate button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px 24px',
              borderRadius: 14,
              border: 'none',
              background: loading
                ? 'linear-gradient(135deg, #4C1D95 0%, #312E81 100%)'
                : 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
              boxShadow: loading
                ? '0 0 16px rgba(124,58,237,0.25)'
                : '0 0 32px rgba(124,58,237,0.5)',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 600,
              fontSize: 17,
              color: loading ? 'rgba(241,245,249,0.6)' : '#F1F5F9',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
            onMouseEnter={(e) => {
              if (loading) return;
              e.currentTarget.style.boxShadow = '0 0 56px rgba(124,58,237,0.7)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = loading
                ? '0 0 16px rgba(124,58,237,0.25)'
                : '0 0 32px rgba(124,58,237,0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {loading && <Spinner />}
            {loading ? 'PulseEngine thinking…' : 'Generate My Offer'}
          </button>
        </motion.div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: 16,
                padding: '12px 18px',
                borderRadius: 10,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: 14,
                color: '#FCA5A5',
                textAlign: 'center',
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offer card */}
        <AnimatePresence>
          {offer && (
            <motion.div
              key={offer.token}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: 40 }}
            >
              <OfferCard
                offer={offer}
                onClaim={() => setShowModal(true)}
              />

              {/* Attribution line */}
              <p
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 400,
                  fontSize: 12,
                  color: '#334155',
                  textAlign: 'center',
                  marginTop: 20,
                  letterSpacing: '0.01em',
                }}
              >
                Offer generated uniquely by PulseEngine based on real-time context signals.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Redeem modal */}
      {showModal && offer && (
        <RedeemModal
          offer={offer}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
