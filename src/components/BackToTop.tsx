import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToTarget } from '../hooks/useSmoothScroll';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }

      setIsVisible(currentScroll > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => scrollToTarget(0)}
          title="Retour en haut de page"
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-2xl bg-[#120C08]/95 text-white border border-[#C5A059]/40 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2 group cursor-pointer hover:border-[#E0C07A] transition-colors"
        >
          {/* Circular SVG Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 -rotate-90">
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="stroke-[#2C1B12] stroke-[2.5]"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                className="stroke-[#E0C07A] stroke-[2.5] transition-all duration-150"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-4 h-4 text-[#E0C07A] absolute group-hover:-translate-y-0.5 transition-transform" />
          </div>

          <span className="hidden sm:inline text-[11px] font-semibold uppercase tracking-wider text-[#D4C3B7] group-hover:text-white transition-colors pr-2">
            Haut
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
