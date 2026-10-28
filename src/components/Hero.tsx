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

      <div className="relative z-20 text-center px-10 py-6">
        {/* Soft white glow so the gold names stand out over the butterflies */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.2 }}
          className="absolute -inset-x-8 -inset-y-4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.7)_45%,rgba(255,255,255,0)_72%)] pointer-events-none"
        />
        <h1 className="relative font-display text-7xl sm:text-8xl lg:text-9xl leading-[1.15] [filter:drop-shadow(0_1px_0_rgba(120,80,10,0.9))_drop-shadow(0_3px_6px_rgba(74,58,85,0.45))]">
          {[
            { word: 'Subash', start: 0.5 },
            { word: '&', start: 1.4 },
            { word: 'Shehani', start: 1.8 },
          ].map(({ word, start }) => (
            <span key={word} className={`block ${word === '&' ? 'text-5xl sm:text-6xl my-1' : ''}`}>
              {word.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block px-[0.2em] -mx-[0.2em] py-[0.35em] -my-[0.35em] bg-[linear-gradient(180deg,#f6e27a_0%,#d4af37_40%,#a67c1a_70%,#e8c860_100%)] bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: start + i * 0.09, duration: 0.7, ease: 'easeOut' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>
      </div>



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
