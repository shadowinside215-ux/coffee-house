import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scrollToTarget } from '../hooks/useSmoothScroll';

interface NavSection {
  id: string;
  label: string;
  labelAr: string;
}

const SECTIONS: NavSection[] = [
  { id: 'home', label: 'Accueil', labelAr: 'الرئيسية' },
  { id: 'menu', label: 'Formules Menu', labelAr: 'قائمة الفطور' },
  { id: 'about', label: 'Notre Espace', labelAr: 'مساحتنا' },
  { id: 'reviews', label: 'Avis Vérifiés', labelAr: 'آراء الزبائن' },
  { id: 'gallery', label: 'Galerie Photos', labelAr: 'معرض الصور' },
  { id: 'contact', label: 'Accès & Contact', labelAr: 'الموقع والتواصل' },
];

export const ScrollNavigator: React.FC = () => {
  const [activeId, setActiveId] = useState('home');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      setIsVisible(window.scrollY > 200);

      for (const section of [...SECTIONS].reverse()) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4 }}
          aria-label="Navigation rapide"
          className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-2 sm:gap-3.5 select-none p-1 sm:p-0 rounded-full bg-[#081710]/80 sm:bg-transparent border border-[#183E2C]/60 sm:border-transparent backdrop-blur-sm sm:backdrop-blur-none"
        >
          {SECTIONS.map((section) => {
            const isActive = activeId === section.id;
            const isHovered = hoveredId === section.id;

            return (
              <div
                key={section.id}
                className="relative flex items-center group cursor-pointer p-1"
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => scrollToTarget(`#${section.id}`)}
              >
                {/* Tooltip on hover (desktop only) */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.92 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 8, scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className="hidden sm:block absolute right-7 px-3 py-1.5 rounded-xl bg-[#081710]/95 backdrop-blur-md border border-[#23694A]/70 shadow-xl text-right whitespace-nowrap pointer-events-none"
                    >
                      <span className="block text-[11px] font-semibold text-white tracking-wide">
                        {section.label}
                      </span>
                      <span className="block font-arabic text-[10px] text-[#34D399] font-bold">
                        {section.labelAr}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Micro indicator pill / dot - Cafe Dark Green to Emerald Glow */}
                <div
                  className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'w-3 h-8 bg-gradient-to-b from-[#1E5C3F] via-[#2E8B62] to-[#34D399] shadow-[0_0_12px_rgba(46,139,98,0.85)]'
                      : 'w-2 h-2 bg-[#133827] group-hover:bg-[#2E8B62] group-hover:h-4 group-hover:w-2'
                  }`}
                />
              </div>
            );
          })}
        </motion.nav>
      )}
    </AnimatePresence>
  );
};
