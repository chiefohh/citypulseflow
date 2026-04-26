'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <style>{`
        .nav-desktop-links { display: flex; }
        .nav-hamburger     { display: none; }

        @media (max-width: 767px) {
          .nav-desktop-links { display: none; }
          .nav-hamburger     { display: flex; }
        }
      `}</style>

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(5,5,8,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        {/* Main bar */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={22} color="#7C3AED" strokeWidth={1.75} />
            <span
              style={{
                fontFamily: '"Raleway", sans-serif',
                fontWeight: 700,
                fontSize: 20,
                lineHeight: '1.4',
                color: '#F1F5F9',
                letterSpacing: '-0.01em',
                transition: 'text-shadow 0.3s ease',
                cursor: 'default',
                paddingBottom: '2px',
                overflow: 'visible',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  '0 0 20px rgba(124,58,237,0.8), 0 0 40px rgba(124,58,237,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              CityPulseFlow
            </span>
          </div>

          {/* Desktop links */}
          <div
            className="nav-desktop-links"
            style={{ alignItems: 'center', gap: 32 }}
          >
            <a
              href="#demo"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: 14,
                color: '#94A3B8',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Consumer Demo
            </a>
            <Link
              href="/merchant"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                fontSize: 14,
                color: '#F1F5F9',
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                border: '1px solid rgba(124,58,237,0.5)',
                background: 'rgba(124,58,237,0.1)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.25)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
              }}
            >
              Merchant Dashboard
            </Link>
          </div>

          {/* Hamburger button */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 8,
              border: '1px solid rgba(139,92,246,0.25)',
              background: 'rgba(13,13,26,0.6)',
              color: '#94A3B8',
              cursor: 'pointer',
              transition: 'color 0.2s ease, border-color 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F1F5F9';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
            }}
          >
            {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                borderTop: '1px solid rgba(139,92,246,0.15)',
                background: 'rgba(5,5,8,0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '12px 24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <a
                href="#demo"
                onClick={close}
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: 15,
                  color: '#94A3B8',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: 10,
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                  e.currentTarget.style.color = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }}
              >
                Consumer Demo
              </a>
              <Link
                href="/merchant"
                onClick={close}
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: 15,
                  color: '#F1F5F9',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(124,58,237,0.35)',
                  background: 'rgba(124,58,237,0.08)',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)';
                }}
              >
                Merchant Dashboard
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
