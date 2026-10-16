import React, { useRef } from 'react';
import { Compass, BookOpen, Star, MapPin, Clock, Coffee, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WebsiteSettings, BusinessInfo } from '../types';
import { SafeImage } from './SafeImage';

interface HeroProps {
  settings: WebsiteSettings;
  business: BusinessInfo;
  onExploreMenu: () => void;
  onFindUs: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  business,
  onExploreMenu,
  onFindUs,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative overflow-hidden bg-[#090604] text-[#F4EFEB]"
    >
      {/* Background Image with Parallax and Deep Dark Overlay Scrim */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 will-change-transform">
        <SafeImage
          src={settings.heroImageUrl}
          alt="the coffee house دار القهوة Sala Al Jadida"
          transformOptions={{ width: 1920, height: 1080, crop: 'fill', quality: 'auto' }}
          className="w-full h-full object-cover object-center opacity-35 scale-110"
          fallbackCategory="coffee"
          containerClassName="w-full h-full"
        />
        {/* Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090604]/90 via-[#090604]/80 to-[#090604]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090604] via-[#090604]/70 to-[#090604]" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:pt-28 lg:pb-28"
      >
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Main Headline & Illuminated Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-7"
          >
            {/* Real Storefront Illuminated Header Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#120C08] border border-[#2C1B12] shadow-sm text-xs font-semibold uppercase tracking-widest text-[#E0C07A]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E0C07A]" />
              <span>Café & Petit-Déjeuner · Sala Al Jadida</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span className="text-emerald-400">Ouvert · Ferme à 00:00</span>
            </motion.div>

            {/* Glowing Brand Signboard (Replicating user's photo 2) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-6 sm:p-8 rounded-3xl bg-[#0F0A07]/90 border border-white/10 shadow-2xl backdrop-blur-md storefront-slats relative overflow-hidden transition-shadow hover:shadow-[0_0_35px_rgba(224,192,122,0.15)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                {(settings.logoUrl || business.logoUrl) && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#140E0A] border-2 border-[#C5A059]/50 shadow-xl overflow-hidden p-2 flex items-center justify-center shrink-0 neon-cup-glow">
                    <img
                      src={settings.logoUrl || business.logoUrl}
                      alt="Logo the coffee house دار القهوة"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-[#C5A059] block mb-1">
                    Enseigne Lumineuse Officielle
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-[0.14em] text-white uppercase leading-none neon-sign-text">
                    THE COFFEE HOUSE
                  </h1>
                  <div className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-wide mt-2 neon-arabic-glow">
                    دار القهوة
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg text-[#D4C3B7] max-w-2xl font-light leading-relaxed"
            >
              {settings.heroSubtext ||
                'Découvrez nos formules petit-déjeuner complètes (L’express, Frenchy, Beldi), nos cafés d’exception et notre terrasse extérieure à Sala Al Jadida. Ouvert tous les jours jusqu’à minuit.'}
            </motion.p>

            {/* Two Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onExploreMenu}
                className="px-7 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#2A180F] to-[#160D08] hover:from-[#3B2216] hover:to-[#22140D] rounded-xl transition-all shadow-lg border border-white/30 flex items-center gap-2.5 whitespace-nowrap cursor-pointer hover:border-white/60"
              >
                <BookOpen className="w-4 h-4 text-[#E0C07A]" />
                <span>Consulter la Carte (Formules)</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onFindUs}
                className="px-7 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#140E0A] hover:bg-[#20150F] border border-[#2C1B12] hover:border-white/20 rounded-xl transition-all flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#E0C07A]" />
                <span>Nous Trouver (Google Maps)</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Highlight Card: Verified Info from Google Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#120C08]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#2C1B12] shadow-2xl space-y-6"
            >
              <div className="border-b border-[#2C1B12] pb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E0C07A] font-semibold">
                    Google Maps Vérifié
                  </span>
                  <div className="flex items-center gap-1 text-[#E0C07A]">
                    <Star className="w-4 h-4 fill-[#E0C07A]" />
                    <span className="font-bold text-base tabular-nums text-white">
                      {business.googleRating}
                    </span>
                    <span className="text-xs text-[#8E796D]">/ 5</span>
                  </div>
                </div>
                <p className="text-xs text-[#B8A79B]">
                  Basé sur <strong>{business.reviewCount} avis Google vérifiés</strong> saluant le calme, l'accueil et nos petits-déjeuners.
                </p>
              </div>

              <div className="space-y-4 text-xs text-[#D4C3B7]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1C130D] border border-[#2C1B12] flex items-center justify-center shrink-0 text-[#E0C07A]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-medium text-sm">
                      Horaires d'Ouverture
                    </strong>
                    <span className="text-emerald-400 font-medium">
                      {business.openingHours || 'Ouvert · Ferme à 00:00 (Closes 12 AM)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1C130D] border border-[#2C1B12] flex items-center justify-center shrink-0 text-[#E0C07A]">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-medium text-sm">
                      Formules Complètes
                    </strong>
                    <span className="text-[#A38F82]">
                      L’express (28 Dh), Frenchy (28 Dh), Beldi (42 Dh)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1C130D] border border-[#2C1B12] flex items-center justify-center shrink-0 text-[#E0C07A]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white font-medium text-sm">
                      {business.address}
                    </strong>
                    <span className="text-[#A38F82]">
                      {business.city} {business.postalCode} ({business.priceRange})
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="pt-10 sm:pt-14 flex flex-col items-center justify-center"
        >
          <button
            onClick={onExploreMenu}
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-[#B8A79B] hover:text-[#E0C07A] transition-colors cursor-pointer group select-none"
          >
            <span className="text-[10px] font-semibold tracking-[0.25em]">Découvrir Nos Formules</span>
            <div className="w-5 h-9 rounded-full border border-[#C5A059]/40 flex items-start justify-center p-1.5 group-hover:border-[#E0C07A] transition-colors">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 h-1.5 rounded-full bg-[#E0C07A]"
              />
            </div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
