import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Coffee, Instagram } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  logoUrl?: string;
  instagramUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  logoUrl,
  instagramUrl = 'https://www.instagram.com/thecoffeehouse.slj/',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoClickCount, setLogoClickCount] = useState(0);

  // Smooth scroll progress bar physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const navLinks = [
    { label: 'Accueil', href: '#home', id: 'home' },
    { label: 'Formules Menu', href: '#menu', id: 'menu' },
    { label: 'Notre Espace', href: '#about', id: 'about' },
    { label: 'Galerie', href: '#gallery', id: 'gallery' },
    { label: 'Avis (4.3★)', href: '#reviews', id: 'reviews' },
    { label: 'Accès & Contact', href: '#contact', id: 'contact' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  // Detect which section is currently in view and scroll depth
  useEffect(() => {
    const handleScrollSpy = () => {
      setIsScrolled(window.scrollY > 30);
      const scrollPosition = window.scrollY + 200;
      for (const link of [...navLinks].reverse()) {
        const element = document.getElementById(link.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(link.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  // Discrete owner keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleScroll('#home');
    // Secret 3-tap on logo triggers admin for owner
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onOpenAdmin();
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 1500);
      return next;
    });
  };

  const handleScroll = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06140E]/98 backdrop-blur-xl border-b border-[#173D2C] shadow-[0_8px_30px_rgba(4,14,10,0.9)]'
          : 'bg-[#071710]/92 backdrop-blur-md border-b border-[#123123]'
      }`}
    >
      {/* Sleek Golden-Emerald Scroll Progress Bar with Glowing Head */}
      <div className="relative">
        <motion.div
          style={{ scaleX }}
          className="origin-left h-[2.5px] bg-gradient-to-r from-[#22704E] via-[#34D399] to-[#E0C07A] shadow-[0_0_12px_rgba(52,211,153,0.7)]"
        />
      </div>

      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 md:gap-6 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Zone 1: Glowing Neon Brand Wordmark (matching real illuminated storefront sign) */}
        <a
          href="#home"
          onClick={handleLogoClick}
          title="the coffee house دار القهوة"
          className="flex items-center gap-2 sm:gap-3.5 whitespace-nowrap min-w-0 group py-1 select-none"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#0A1811] border border-[#23694A]/70 shadow-md shrink-0 flex items-center justify-center p-1 group-hover:border-[#34D399] transition-all relative">
            <img
              src={logoUrl || '/logo.svg'}
              alt="Logo دار القهوة the coffee house"
              className="w-full h-full object-contain"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.src.endsWith('/logo.svg')) {
                  img.src = '/logo.svg';
                }
              }}
            />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-serif text-[13px] xs:text-sm sm:text-lg lg:text-xl font-extrabold uppercase tracking-[0.06em] sm:tracking-[0.14em] text-white leading-tight neon-sign-text truncate">
              THE COFFEE HOUSE
            </span>
            <span className="font-arabic text-[11px] sm:text-sm text-[#E0C07A] font-bold leading-none mt-0.5 tracking-wide neon-arabic-glow">
              دار القهوة
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links with Active Spy Highlighter */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#A5BFB3]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(link.href);
                }}
                className={`py-1 relative transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#9BB3A7] hover:text-[#F4EFEB]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#267751] via-[#34D399] to-[#E0C07A] shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Social & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
          {/* Instagram Button (visible on sm+) */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Suivez-nous sur Instagram"
            className="hidden sm:flex p-2 rounded-xl bg-[#091A12] hover:bg-[#123123] text-[#E0C07A] hover:text-[#34D399] border border-[#183D2C] hover:border-[#2E8B62] transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Primary View Menu CTA - ALWAYS visible on all screen sizes */}
          <button
            onClick={() => handleScroll('#menu')}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#143D2B] via-[#1E5C3F] to-[#123826] hover:from-[#194E37] hover:to-[#17462F] rounded-xl transition-all whitespace-nowrap shrink-0 border border-[#2E8B62]/80 shadow-[0_0_15px_rgba(30,92,63,0.35)] cursor-pointer hover:border-[#34D399] hover:shadow-[0_0_22px_rgba(46,139,98,0.5)] flex items-center gap-1 sm:gap-1.5"
          >
            <Coffee className="w-3.5 h-3.5 text-[#E0C07A] shrink-0" />
            <span className="hidden xs:inline">Voir la Carte</span>
            <span className="xs:hidden">Carte</span>
          </button>

          {/* 3-Dots Menu Toggle - ALWAYS visible on mobile & tablet (< lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white bg-[#091A12] hover:bg-[#123123] rounded-xl border border-[#1E4D36] shadow-sm shrink-0 flex items-center justify-center transition-all cursor-pointer hover:border-[#2E8B62]"
            aria-label="Menu navigation et 3 points"
            title="Menu et navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#E0C07A]" />
            ) : (
              <div className="flex items-center justify-center gap-1 w-5 h-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0C07A] shadow-[0_0_6px_#E0C07A]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shadow-[0_0_6px_#34D399]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E0C07A] shadow-[0_0_6px_#E0C07A]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#173D2C] bg-[#071710] px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(link.href);
                }}
                className="text-sm font-medium uppercase tracking-wider text-[#D1E2D9] hover:text-white py-2 border-b border-[#143124]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#E0C07A] bg-[#0A1D14] border border-[#1C4733] rounded-xl flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Suivre @thecoffeehouse.slj</span>
            </a>

            <button
              onClick={() => handleScroll('#menu')}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#143D2B] via-[#1E5C3F] to-[#123826] border border-[#2E8B62]/60 rounded-xl text-center shadow cursor-pointer"
            >
              Découvrir les Formules (L’express, Frenchy, Beldi)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
