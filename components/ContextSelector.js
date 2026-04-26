'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const groups = [
  {
    key: 'weather',
    label: 'Weather',
    options: [
      { value: 'rainy', label: 'Rainy', emoji: '🌧' },
      { value: 'cold', label: 'Cold', emoji: '❄️' },
      { value: 'sunny', label: 'Sunny', emoji: '☀️' },
    ],
  },
  {
    key: 'time',
    label: 'Time of Day',
    options: [
      { value: 'morning', label: 'Morning', emoji: '🌅' },
      { value: 'lunch', label: 'Lunch', emoji: '🌞' },
      { value: 'evening', label: 'Evening', emoji: '🌆' },
    ],
  },
  {
    key: 'demand',
    label: 'Merchant Demand',
    options: [
      { value: 'low', label: 'Quiet', emoji: '🤫' },
      { value: 'high', label: 'Busy', emoji: '🔥' },
    ],
  },
];

function detectTime() {
  const h = new Date().getHours();
  if (h >= 0 && h <= 11) return 'morning';
  if (h >= 12 && h <= 16) return 'lunch';
  return 'evening';
}

function Pill({ option, isActive, onClick, groupKey }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '10px 20px',
        borderRadius: 999,
        border: isActive
          ? '1px solid rgba(124,58,237,0.6)'
          : '1px solid rgba(139,92,246,0.2)',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: '"Inter", sans-serif',
        fontWeight: 500,
        color: isActive ? '#F1F5F9' : '#64748B',
        transition: 'color 0.2s ease, border-color 0.2s ease',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
    >
      {/* Animated active background */}
      {isActive && (
        <motion.span
          layoutId={`pill-bg-${groupKey}`}
          initial={false}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
            zIndex: 0,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1, fontSize: 15 }}>
        {option.emoji}
      </span>
      <span style={{ position: 'relative', zIndex: 1 }}>{option.label}</span>
    </button>
  );
}

export default function ContextSelector({ value, onChange }) {
  const handleAutoDetect = useCallback(() => {
    onChange('time', detectTime());
  }, [onChange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {groups.map((group) => (
        <div key={group.key}>
          {/* Group label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                fontSize: 12,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {group.label}
            </span>

            {/* Auto-detect button — only on the Time group */}
            {group.key === 'time' && (
              <button
                onClick={handleAutoDetect}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 12px',
                  borderRadius: 999,
                  border: '1px solid rgba(6,182,212,0.3)',
                  background: 'rgba(6,182,212,0.08)',
                  color: '#06B6D4',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, border-color 0.2s ease',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(6,182,212,0.16)';
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                }}
              >
                <Clock size={11} strokeWidth={2} />
                Auto-detect
              </button>
            )}
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {group.options.map((option) => (
              <Pill
                key={option.value}
                option={option}
                groupKey={group.key}
                isActive={value[group.key] === option.value}
                onClick={() => onChange(group.key, option.value)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
