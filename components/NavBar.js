'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  return (
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
      {/* Bar */}
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
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
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
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#F1F5F9',
            cursor: 'pointer',
            padding: 8,
          }}
        >
          {menuOpen
            ? <X size={24} strokeWidth={2} />
            : <Menu size={24} strokeWidth={2} />
          }
        </button>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 49,
              background: 'rgba(5,5,8,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(139,92,246,0.2)',
              padding: '12px 24px 20px',
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
                padding: '13px 16px',
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
                padding: '13px 16px',
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
  );
}
