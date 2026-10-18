import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { Coffee, Star, Sparkles } from 'lucide-react';

interface ScrollMarqueeProps {
  className?: string;
}

export const ScrollMarquee: React.FC<ScrollMarqueeProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });

  // Skew and translation velocity effect
  const skewX = useTransform(smoothVelocity, [-1500, 1500], [-6, 6]);
  const velocityOffset = useTransform(smoothVelocity, [-1500, 1500], [-80, 80]);

  const marqueeItems = [
    { text: 'THE COFFEE HOUSE', icon: Coffee },
    { text: 'دار القهوة', isArabic: true },
    { text: 'SALA AL JADIDA', icon: Sparkles },
    { text: "FORMULE L'EXPRESS (28 DH)", icon: Coffee },
    { text: 'FORMULE FRENCHY (28 DH)', icon: Coffee },
    { text: 'FORMULE BELDI (42 DH)', icon: Sparkles },
    { text: 'NOTE 4.3★ SUR GOOGLE MAPS', icon: Star },
    { text: 'TERRASSE & DÉTENTE JUSQU’À MINUIT', icon: Sparkles },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative py-6 bg-[#0B0705] border-y border-[#20140C] overflow-hidden select-none ${className}`}
    >
      {/* Subtle side fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#090604] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#090604] to-transparent z-10 pointer-events-none" />

      <motion.div
        style={{ skewX, x: velocityOffset }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {/* Double sequence for seamless infinite wrap */}
        {[...Array(2)].map((_, seqIndex) => (
          <div
            key={seqIndex}
            className="flex items-center gap-8 shrink-0 animate-marquee"
            style={{
              animation: 'marquee 32s linear infinite',
            }}
          >
            {marqueeItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${seqIndex}-${idx}`}
                  className="flex items-center gap-4 text-xs font-semibold tracking-[0.22em] uppercase text-[#B8A79B] hover:text-white transition-colors"
                >
                  <span
                    className={
                      item.isArabic
                        ? 'font-arabic text-base text-[#34D399] font-bold tracking-normal'
                        : 'font-serif text-white tracking-widest'
                    }
                  >
                    {item.text}
                  </span>
                  {Icon && <Icon className="w-3.5 h-3.5 text-[#10B981] shrink-0" />}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]/70 shadow-[0_0_4px_#10B981]" />
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
