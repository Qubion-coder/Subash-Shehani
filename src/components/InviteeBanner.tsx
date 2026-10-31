import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface InviteeBannerProps {
  inviteeName: string;
  eventLabel: string;
}

export const InviteeBanner: React.FC<InviteeBannerProps> = ({ inviteeName, eventLabel }) => {
  return (
    <div
      className="py-20 sm:py-24 bg-brand-blush bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/bg/lilac-leaves-bg.jpeg')" }}
    >
      <div className="absolute inset-0 bg-white/60 pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_30px_60px_rgba(138,106,156,0.15)] px-6 py-12 sm:px-14 sm:py-14 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-rose via-brand-plum/80 to-brand-rose" />

          <span className="text-brand-plum uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[11px] sm:text-xs font-bold drop-shadow-sm">
            Specially Invited Guest
          </span>

          <div className="w-12 h-[1px] bg-brand-lavender/60 mx-auto my-6" />

          <h2 className="font-display text-[2.6rem] sm:text-6xl text-stone-800 drop-shadow-sm leading-[1.3] py-1 break-words">
            {inviteeName}
          </h2>

          <p className="mt-5 text-stone-700 font-serif text-lg sm:text-xl leading-relaxed">
            We cordially invite <span className="italic text-brand-plum">{inviteeName}</span> to celebrate our special day with us.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="hidden sm:block h-[1px] w-10 bg-gradient-to-r from-transparent to-brand-plum/40" />
            <span className="px-5 py-2 rounded-full border border-brand-lavender/50 bg-brand-blush/80 text-brand-plum uppercase whitespace-nowrap tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-[11px] font-bold">
              {eventLabel}
            </span>
            <div className="hidden sm:block h-[1px] w-10 bg-gradient-to-l from-transparent to-brand-plum/40" />
          </div>

          <Heart className="w-5 h-5 mx-auto mt-8 text-brand-plum fill-brand-lavender/30" />
        </motion.div>
      </div>
    </div>
  );
};
