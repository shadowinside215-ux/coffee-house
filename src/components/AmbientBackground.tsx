import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const AmbientBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Multiplane parallax shifts for ambient atmospheric layers
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  // Parallax floating coffee bean & ember particles
  const particle1Y = useTransform(scrollYProgress, [0, 1], [0, -420]);
  const particle2Y = useTransform(scrollYProgress, [0, 1], [0, -680]);
  const particle3Y = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const particle4Y = useTransform(scrollYProgress, [0, 1], [0, -550]);
  const particle5Y = useTransform(scrollYProgress, [0, 1], [0, -250]);

  // Rotational shifts on scroll
  const particleRotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const particleRotate2 = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const particleRotate3 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  // Pointer spotlight coordinates with luxury spring smoothing
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const springX = useSpring(mousePos.x, { stiffness: 45, damping: 22 });
  const springY = useSpring(mousePos.y, { stiffness: 45, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Dynamic Cursor Ambient Spotlight - Cafe Forest Green & Warm Amber */}
      <motion.div
        className="fixed w-[680px] h-[680px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl will-change-transform"
        style={{
          left: springX,
          top: springY,
          background:
            'radial-gradient(circle, rgba(38, 119, 81, 0.26) 0%, rgba(18, 56, 38, 0.16) 45%, transparent 70%)',
        }}
      />

      {/* Floating Ambient Orb 1 - Deep Cafe Forest Green (Top-Right / Mid) */}
      <motion.div
        style={{ y: orb1Y }}
        className="absolute top-1/4 -right-48 w-[720px] h-[720px] rounded-full blur-[140px] bg-gradient-to-br from-[#174831]/40 via-[#0E3322]/35 to-transparent will-change-transform opacity-80"
      />

      {/* Floating Ambient Orb 2 - Heritage Cafe British Green (Mid-Left) */}
      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-2/3 -left-48 w-[680px] h-[680px] rounded-full blur-[140px] bg-gradient-to-tr from-[#123826]/45 via-[#1E5C3F]/30 to-transparent will-change-transform opacity-85"
      />

      {/* Floating Ambient Orb 3 - Warm Gold Brass Shimmer (Bottom-Right) */}
      <motion.div
        style={{ y: orb3Y }}
        className="absolute bottom-10 right-1/4 w-[550px] h-[550px] rounded-full blur-[120px] bg-gradient-to-tl from-[#E0C07A]/12 via-[#267751]/20 to-transparent will-change-transform opacity-70"
      />

      {/* Floating Ambient Orb 4 - Botanical Emerald Glow (Center / Top-Left) */}
      <motion.div
        style={{ y: orb2Y }}
        className="absolute top-[35%] -left-32 w-[650px] h-[650px] rounded-full blur-[140px] bg-gradient-to-tr from-[#0F3323]/40 via-[#2E8B62]/20 to-transparent will-change-transform opacity-75"
      />

      {/* Parallax Floating Accent 1: Stylized Coffee Bean (Top Left) */}
      <motion.div
        style={{ y: particle1Y, rotate: particleRotate1 }}
        className="absolute top-[35%] left-[8%] w-6 h-9 opacity-25 will-change-transform"
      >
        <svg viewBox="0 0 24 36" fill="none" className="w-full h-full text-[#34D399]">
          <ellipse cx="12" cy="18" rx="10" ry="16" fill="currentColor" opacity="0.3" />
          <path
            d="M12 4C14 10 10 18 12 32"
            stroke="#050E09"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Parallax Floating Accent 2: Cafe Emerald Ring (Mid Right) */}
      <motion.div
        style={{ y: particle2Y, rotate: particleRotate2 }}
        className="absolute top-[60%] right-[10%] w-10 h-10 rounded-full border border-[#2E8B62]/40 shadow-[0_0_15px_rgba(46,139,98,0.3)] opacity-40 will-change-transform"
      />

      {/* Parallax Floating Accent 3: Stylized Coffee Bean (Lower Left) */}
      <motion.div
        style={{ y: particle3Y, rotate: particleRotate3 }}
        className="absolute top-[75%] left-[12%] w-5 h-8 opacity-25 will-change-transform"
      >
        <svg viewBox="0 0 24 36" fill="none" className="w-full h-full text-[#E0C07A]">
          <ellipse cx="12" cy="18" rx="10" ry="16" fill="currentColor" opacity="0.35" />
          <path
            d="M12 4C10 12 14 20 12 32"
            stroke="#050E09"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Parallax Floating Accent 4: Mint Dust Sparkle (Top Center-Right) */}
      <motion.div
        style={{ y: particle4Y }}
        className="absolute top-[20%] right-[22%] w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_12px_#34D399] opacity-50 will-change-transform"
      />

      {/* Parallax Floating Accent 5: Golden Dust Sparkle (Bottom Center-Left) */}
      <motion.div
        style={{ y: particle5Y }}
        className="absolute top-[85%] left-[28%] w-2.5 h-2.5 rounded-full bg-[#E0C07A] shadow-[0_0_14px_#E0C07A] opacity-40 will-change-transform"
      />

      {/* Subtle Texture Grid / Slats Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:28px_28px] opacity-40" />
    </div>
  );
};
