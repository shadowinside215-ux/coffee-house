import React, { useState } from 'react';
import { Star, ExternalLink, ThumbsUp, Coffee, Sun, Smile } from 'lucide-react';
import { motion } from 'motion/react';
import { BusinessInfo } from '../types';

interface ReviewsSectionProps {
  business: BusinessInfo;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ business }) => {
  const [animatedRating, setAnimatedRating] = useState(0);
  const [animatedReviews, setAnimatedReviews] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleScoreboardEnter = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    let startTimestamp: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setAnimatedRating(Number((ease * business.googleRating).toFixed(1)));
      setAnimatedReviews(Math.floor(ease * business.reviewCount));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setAnimatedRating(business.googleRating);
        setAnimatedReviews(business.reviewCount);
      }
    };

    requestAnimationFrame(step);
  };

  return (
    <section id="reviews" className="py-24 bg-[#090604] border-t border-[#1C120C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-16"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="origin-right h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#C5A059]"
            />
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#E0C07A] uppercase">
              <span>Avis Clients & Réputation</span>
              <span aria-hidden="true">·</span>
              <span>Fiche Google Maps</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="origin-left h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#C5A059]"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            La Confiance de Nos Clients
          </h2>
          <p className="text-sm sm:text-base text-[#B8A79B] font-light leading-relaxed">
            Consultez les appréciations vérifiées de nos habitués sur Google Maps à propos de notre accueil, de notre café et de nos formules à Sala Al Jadida.
          </p>
        </motion.div>

        {/* Big Social Proof Scoreboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 25 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          onViewportEnter={handleScoreboardEnter}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#120C08] rounded-3xl p-8 sm:p-12 border border-[#22160F] shadow-2xl max-w-4xl mx-auto mb-16 hover:border-[#C5A059]/40 transition-colors"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-[#1C130D] flex flex-col items-center justify-center text-white shadow-inner border border-white/10">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  {(hasAnimated ? animatedRating : business.googleRating).toFixed(1)}
                </span>
                <div className="flex items-center gap-0.5 mt-1 text-[#E0C07A]">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.4, type: 'spring' }}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(business.googleRating)
                            ? 'fill-[#E0C07A] text-[#E0C07A]'
                            : 'fill-[#E0C07A]/30 text-[#E0C07A]/30'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Note Google Maps vérifiée
                </h3>
                <p className="text-xs sm:text-sm text-[#A38F82]">
                  Sur la base de <strong className="font-semibold text-white tabular-nums">{hasAnimated ? animatedReviews : business.reviewCount} avis authentiques</strong> de clients réels.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[#E0C07A] pt-1">
                  <span>Tranche tarifaire : {business.priceRange}</span>
                  <span aria-hidden="true">·</span>
                  <span>4 RESIDENCE BELLE VUE 3, Sala Al Jadida</span>
                </div>
              </div>
            </div>

            <a
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-[#2A180F] to-[#160D08] hover:from-[#3B2216] hover:to-[#22140D] rounded-xl transition-all shadow-md flex items-center gap-2 whitespace-nowrap shrink-0 border border-white/20 hover:border-white/40 cursor-pointer"
            >
              <span>Voir sur Google Maps</span>
              <ExternalLink className="w-4 h-4 text-[#E0C07A]" />
            </a>
          </div>
        </motion.div>

        {/* Customer Experience Themes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: Sun,
              title: 'Ambiance Calme & Reposante',
              desc: 'Les visiteurs apprécient tout particulièrement le cadre détendu et la tranquillité du lieu, parfait pour une pause après le travail ou les matins du week-end.',
              highlight: 'Ambiance calme saluée dans les avis',
            },
            {
              icon: Coffee,
              title: 'Formules Complètes & Fraîches',
              desc: 'Le rapport qualité-prix des formules petit-déjeuner marocain (L’express à 28 Dh, Frenchy à 28 Dh, Beldi à 42 Dh) est très recommandé.',
              highlight: 'Petit-déjeuner apprécié des habitués',
            },
            {
              icon: Smile,
              title: 'Accueil Convivial & Terrasse',
              desc: 'L’accueil courtois de l\'équipe et la terrasse extérieure ouverte jusqu’à minuit rendent chaque passage agréable.',
              highlight: 'Service attentionné',
            },
          ].map((theme, idx) => {
            const Icon = theme.icon;
            return (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-[#120C08] rounded-2xl p-6 sm:p-7 border border-[#22160F] hover:border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1C130D] border border-[#2B1B12] flex items-center justify-center text-[#E0C07A]">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  {theme.title}
                </h4>
                <p className="text-xs text-[#A38F82] leading-relaxed">
                  {theme.desc}
                </p>
                <div className="pt-2 text-[11px] text-[#E0C07A] font-medium flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{theme.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
