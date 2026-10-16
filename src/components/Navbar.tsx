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
          ? 'bg-[#090604]/98 backdrop-blur-xl border-b border-[#2A180F] shadow-[0_8px_30px_rgba(0,0,0,0.8)]'
          : 'bg-[#090604]/90 backdrop-blur-md border-b border-[#22160F]'
      }`}
    >
      {/* Sleek Golden Scroll Progress Bar with Glowing Head */}
      <div className="relative">
        <motion.div
          style={{ scaleX }}
          className="origin-left h-[2.5px] bg-gradient-to-r from-[#C5A059] via-[#E0C07A] to-[#FFDF9E] shadow-[0_0_12px_rgba(224,192,122,0.8)]"
        />
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Zone 1: Glowing Neon Brand Wordmark (matching real illuminated storefront sign) */}
        <a
          href="#home"
          onClick={handleLogoClick}
          title="the coffee house دار القهوة"
          className="flex items-center gap-3.5 whitespace-nowrap shrink-0 group py-1 select-none"
        >
          {logoUrl ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#140D09] border border-[#C5A059]/40 shadow-md shrink-0 flex items-center justify-center p-1 group-hover:border-[#E0C07A] transition-all relative">
              <img
                src={logoUrl}
                alt="Logo دار القهوة the coffee house"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  const fallback = img.parentElement?.querySelector('.logo-fallback') as HTMLElement | null;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="logo-fallback hidden w-full h-full items-center justify-center text-[#E0C07A]">
                <Coffee className="w-6 h-6 text-[#E0C07A]" />
              </div>
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#140E0A] flex items-center justify-center text-white border border-[#3D2619] shadow-inner transition-transform group-hover:scale-105 shrink-0 neon-cup-glow">
              <Coffee className="w-5 h-5 text-white" />
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-extrabold uppercase tracking-[0.14em] text-white leading-tight neon-sign-text">
              THE COFFEE HOUSE
            </span>
            <span className="font-arabic text-sm text-[#E0C07A] font-bold leading-none mt-0.5 tracking-wider neon-arabic-glow">
              دار القهوة
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links with Active Spy Highlighter */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-[#B8A79B]">
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
                    : 'text-[#A38F82] hover:text-[#F4EFEB]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C5A059] to-[#E0C07A] shadow-[0_0_8px_rgba(224,192,122,0.8)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Social & Action Controls (Admin button hidden as requested) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Instagram Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Suivez-nous sur Instagram"
            className="p-2 rounded-xl bg-[#140E0A] hover:bg-[#22160F] text-[#E0C07A] hover:text-white border border-[#2C1B12] transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Primary View Menu CTA */}
          <button
            onClick={() => handleScroll('#menu')}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#2C1910] to-[#180E09] hover:from-[#3D2317] hover:to-[#22140D] rounded-xl transition-all whitespace-nowrap shrink-0 border border-white/20 shadow-md cursor-pointer hover:border-white/40"
          >
            Voir la Carte
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white bg-[#140E0A] hover:bg-[#22160F] rounded-xl border border-[#2C1B12] cursor-pointer"
            aria-label="Menu Mobile"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#2C1B12] bg-[#0E0906] px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(link.href);
                }}
                className="text-sm font-medium uppercase tracking-wider text-[#D4C3B7] hover:text-white py-2 border-b border-[#1E130D]"
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
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-[#E0C07A] bg-[#160F0A] border border-[#2C1B12] rounded-xl flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              <span>Suivre @thecoffeehouse.slj</span>
            </a>

            <button
              onClick={() => handleScroll('#menu')}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#2C1910] border border-white/20 rounded-xl text-center shadow cursor-pointer"
            >
              Découvrir les Formules (L’express, Frenchy, Beldi)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
