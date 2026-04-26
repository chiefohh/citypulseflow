'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
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
          <Building2 size={24} color="#7C3AED" strokeWidth={1.75} />
          <span
            style={{
              fontFamily: '"Syne", sans-serif',
              fontWeight: 700,
              fontSize: 20,
              color: '#F1F5F9',
              letterSpacing: '-0.01em',
              transition: 'text-shadow 0.3s ease',
              cursor: 'default',
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

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a
            href="#demo"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              fontSize: 14,
              color: '#94A3B8',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
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
      </div>
    </motion.nav>
  );
}
