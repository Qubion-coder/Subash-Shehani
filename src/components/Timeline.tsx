import React from 'react';
import { motion } from 'motion/react';

const events = [
  { time: '14:30', title: 'Church Mass', desc: "St. Anthony's Cathedral, Kandy" },
  { time: '17:00', title: 'Reception', desc: 'Royal Rest House, Peradeniya' },
];

export const Timeline = () => {
  return (
    <div className="bg-[#FDF9FB] pt-24 pb-48 sm:pt-32 sm:pb-64 relative overflow-hidden flex justify-center w-full">
      {/* Bottom left corner flower */}
      <img 
        src="/ChatGPT Image Sep 3, 2026, 03_34_18 AM - Copy.png" 
        alt="Floral Corner" 
        className="absolute bottom-0 left-0 w-64 sm:w-96 opacity-90 mix-blend-multiply pointer-events-none z-0" 
      />

      <div className="w-full max-w-2xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Top middle flower */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <img 
            src="/ChatGPT Image Sep 3, 2026, 03_34_18 AM.png" 
            alt="Floral Top" 
            className="w-20 sm:w-24 h-auto opacity-90 mix-blend-multiply"
          />
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h2 className="text-4xl sm:text-5xl font-names text-[#4A3A55] tracking-wide mb-2">The Day</h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative w-full max-w-md mx-auto">
          {events.map((event, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="relative flex items-start mb-12 last:mb-0 group"
            >
              {/* Time */}
              <div className="w-16 sm:w-20 flex-shrink-0 pt-1 text-right">
                <span className="font-['Cormorant_Garamond',_serif] text-sm sm:text-base text-[#8A6A9C] tracking-widest tabular-nums font-semibold">
                  {event.time}
                </span>
              </div>

              {/* Dot and Line Container */}
              <div className="flex flex-col items-center mx-4 sm:mx-6 relative">
                {/* Line to next item */}
                {idx !== events.length - 1 && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[1px] h-[calc(100%+3rem)] bg-[#C8A2C8]/40 group-hover:bg-[#C8A2C8]/80 transition-colors duration-500" />
                )}
                {/* Dot */}
                <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-[#C48B98] relative z-10 ring-[6px] ring-[#FDF9FB]" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <h3 className="font-['Cormorant_Garamond',_serif] text-xl sm:text-2xl text-[#4A3A55] mb-1 font-medium">{event.title}</h3>
                <p className="text-[11px] sm:text-xs text-[#8A6A9C]/70 font-sans tracking-wide">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
