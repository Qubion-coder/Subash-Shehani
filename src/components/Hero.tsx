import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  event?: string | null;
  inviteeName?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}

function useIsTouchDevice() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  return touch;
}

export const Hero: React.FC<HeroProps> = ({ event = 'both', inviteeName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const useParallax = !reducedMotion && !isTouch;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.1]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [videoEnded, setVideoEnded] = useState(false);

  return (
    <div ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-blush/30">
      <motion.div
        className="absolute inset-0 z-0 origin-center"
        style={useParallax ? { y: y1, scale } : undefined}
      >
        <video
          src="/hero-butterflies.mp4"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 20%' }}
          autoPlay
          muted
          playsInline
          onEnded={(e) => {
             // Show the frame and scroll hint, then keep the butterflies flying
             setVideoEnded(true);
             e.currentTarget.currentTime = 0;
             e.currentTarget.play().catch(() => {});
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1.4, ease: 'easeOut' }}
        className="relative z-20 w-56 sm:w-72 aspect-[3/4] overflow-hidden border-[6px] border-white shadow-[0_25px_60px_rgba(138,106,156,0.35)]"
      >
        <img src="/bg/rings.jpeg" alt="Subash & Shehani" className="absolute inset-0 w-full h-full object-cover" />
      </motion.div>



      <AnimatePresence>
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <div className="absolute inset-5 sm:inset-8 border border-brand-plum/30 rounded-3xl shadow-[inset_0_0_30px_rgba(200,162,200,0.1)]" />
            <div className="absolute inset-6 sm:inset-9 border border-brand-plum/15 rounded-[1.3rem]" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="flex flex-col items-center gap-2 bg-black/20 hover:bg-black/40 transition-colors backdrop-blur-md px-6 py-4 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-white font-medium pl-1">
                Scroll Down
              </span>
              <motion.div 
                animate={{ y: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
