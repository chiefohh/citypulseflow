'use client';

import { motion } from 'framer-motion';

const blobs = [
  {
    size: 700,
    color: '#7C3AED',
    opacity: 0.09,
    initial: { x: '-10%', y: '-15%' },
    animate: {
      x: ['-10%', '5%', '-5%', '-10%'],
      y: ['-15%', '5%', '-8%', '-15%'],
      scale: [1, 1.15, 0.95, 1],
    },
    duration: 22,
  },
  {
    size: 600,
    color: '#06B6D4',
    opacity: 0.07,
    initial: { x: '60%', y: '-20%' },
    animate: {
      x: ['60%', '50%', '65%', '60%'],
      y: ['-20%', '0%', '-10%', '-20%'],
      scale: [1, 0.9, 1.1, 1],
    },
    duration: 19,
  },
  {
    size: 800,
    color: '#4338CA',
    opacity: 0.06,
    initial: { x: '30%', y: '40%' },
    animate: {
      x: ['30%', '20%', '38%', '30%'],
      y: ['40%', '30%', '50%', '40%'],
      scale: [1, 1.2, 0.92, 1],
    },
    duration: 25,
  },
  {
    size: 500,
    color: '#7C3AED',
    opacity: 0.1,
    initial: { x: '-5%', y: '55%' },
    animate: {
      x: ['-5%', '8%', '-2%', '-5%'],
      y: ['55%', '45%', '60%', '55%'],
      scale: [1, 1.1, 0.95, 1],
    },
    duration: 18,
  },
  {
    size: 550,
    color: '#06B6D4',
    opacity: 0.08,
    initial: { x: '70%', y: '60%' },
    animate: {
      x: ['70%', '60%', '75%', '70%'],
      y: ['60%', '70%', '55%', '60%'],
      scale: [1, 0.88, 1.08, 1],
    },
    duration: 21,
  },
  {
    size: 450,
    color: '#4338CA',
    opacity: 0.12,
    initial: { x: '40%', y: '10%' },
    animate: {
      x: ['40%', '48%', '35%', '40%'],
      y: ['10%', '20%', '5%', '10%'],
      scale: [1, 1.18, 0.9, 1],
    },
    duration: 15,
  },
];

export default function AuroraBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          initial={blob.initial}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 70%)`,
            opacity: blob.opacity,
            filter: 'blur(40px)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}
