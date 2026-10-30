import React from 'react';
import { motion } from 'motion/react';

const WORDS = [
  { word: 'Subash', start: 0.5 },
  { word: '&', start: 1.4 },
  { word: 'Shehani', start: 1.8 },
];

// Time from mount until the last letter has finished animating (with delay 0)
export const NAMES_ANIMATION_MS = (1.8 + 6 * 0.09 + 0.7) * 1000;

interface CoupleNamesProps {
  animate?: boolean;
  delay?: number;
}

export const CoupleNames: React.FC<CoupleNamesProps> = ({ animate = true, delay = 0 }) => {
  return (
    <div className="relative z-20 text-center px-10 py-6">
      {/* Soft white glow so the gold names stand out over the butterflies */}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: Math.max(0, 0.2 + delay), duration: 1.2 }}
        className="absolute -inset-x-8 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.7)_45%,rgba(255,255,255,0)_72%)] pointer-events-none"
      />
      <h1 className="relative font-display text-7xl sm:text-8xl lg:text-9xl leading-[1.15] [filter:drop-shadow(0_1px_0_rgba(120,80,10,0.9))_drop-shadow(0_3px_6px_rgba(74,58,85,0.45))]">
        {WORDS.map(({ word, start }) => (
          <span key={word} className={`block ${word === '&' ? 'text-5xl sm:text-6xl my-1' : ''}`}>
            {word.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block px-[0.2em] -mx-[0.2em] py-[0.35em] -my-[0.35em] bg-[linear-gradient(180deg,#f6e27a_0%,#d4af37_40%,#a67c1a_70%,#e8c860_100%)] bg-clip-text text-transparent"
                initial={animate ? { opacity: 0, y: 20, filter: 'blur(8px)' } : false}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: Math.max(0, start + delay + i * 0.09), duration: 0.7, ease: 'easeOut' }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>
    </div>
  );
};
