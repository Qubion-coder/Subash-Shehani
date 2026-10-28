import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export const GratitudeNote: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_30px_60px_rgba(138,106,156,0.15)] px-8 py-14 sm:px-14 sm:py-16 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-rose via-brand-plum/80 to-brand-rose" />

        <Heart className="w-6 h-6 mx-auto mb-6 text-brand-plum fill-brand-lavender/30" />

        <span className="text-brand-plum uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[11px] sm:text-xs font-bold drop-shadow-sm">
          With Love &amp; Gratitude
        </span>

        <div className="w-12 h-[1px] bg-brand-lavender/60 mx-auto my-8" />

        <div className="space-y-6 text-stone-700 font-serif text-lg sm:text-xl leading-relaxed">
          <p>
            Our hearts are filled with so much love and gratitude as we prepare to begin our forever together.
          </p>
          <p>
            Every person who has been part of our journey holds a special place in our hearts. Having you share in the joy of our wedding would make this milestone even more meaningful.
          </p>
          <p>
            We look forward to sharing this precious day with you.
          </p>
        </div>

        <div className="w-12 h-[1px] bg-brand-lavender/60 mx-auto my-8" />

        <span className="text-brand-plum uppercase tracking-[0.4em] text-[10px] sm:text-[11px] font-bold block mb-3">
          With Love
        </span>
        <p className="font-display text-5xl sm:text-6xl text-stone-800 drop-shadow-sm">
          Subash <span className="text-brand-plum">&amp;</span> Shehani
        </p>
      </motion.div>
    </div>
  );
};
