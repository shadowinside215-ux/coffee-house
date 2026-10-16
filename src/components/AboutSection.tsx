import React from 'react';
import { Coffee, Sun, Heart, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { SafeImage } from './SafeImage';
import { DEFAULT_CAFE_IMAGES } from '../services/cloudinary';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#090604] border-t border-[#1C120C] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase with Motion Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-[#261810] shadow-2xl aspect-[4/3] bg-[#140E0A] group">
              <SafeImage
                src={DEFAULT_CAFE_IMAGES.cafeInterior}
                alt="Intérieur et ambiance the coffee house دار القهوة"
                transformOptions={{ width: 800, height: 600, crop: 'fill', quality: 'auto' }}
                fallbackCategory="ambiance"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                containerClassName="w-full h-full"
              />
            </div>
            {/* Overlapping secondary photo with floating animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="hidden sm:block absolute -bottom-8 -right-6 w-3/5 rounded-2xl overflow-hidden border-4 border-[#090604] shadow-2xl aspect-[4/3] bg-[#140E0A]"
            >
              <SafeImage
                src={DEFAULT_CAFE_IMAGES.moroccanBreakfast}
                alt="Formules petit-déjeuner the coffee house"
                transformOptions={{ width: 600, height: 450, crop: 'fill', quality: 'auto' }}
                fallbackCategory="breakfast"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </motion.div>
          </motion.div>

          {/* Right Column: Narrative Copy with Motion Reveal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="origin-left h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C5A059]"
              />
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#E0C07A] uppercase">
                <span>Notre Histoire & Philosophie</span>
                <span aria-hidden="true">·</span>
                <span>Sala Al Jadida</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Une invitation à ralentir et savourer l'instant
              </h2>
              <p className="font-arabic text-xl sm:text-2xl text-[#E0C07A] font-medium leading-relaxed">
                مساحتكم الهادئة في سلا الجديدة لكل لحظات الراحة
              </p>
            </div>

            <p className="text-base text-[#D4C3B7] font-light leading-relaxed">
              Plus qu’un simple arrêt café, <strong className="font-semibold text-white">the coffee house دار القهوة</strong> est un lieu pour prendre le temps, partager une délicieuse formule petit-déjeuner et se détendre dans un cadre chaleureux et reposant.
            </p>

            <p className="text-sm sm:text-base text-[#A38F82] font-light leading-relaxed">
              Que ce soit pour bien commencer votre matinée avec nos formules complètes — L’express, Frenchy ou notre généreux Beldi — ou pour une pause en fin de journée sur notre agréable terrasse à Sala Al Jadida, nous vous accueillons tous les jours avec le sourire.
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#22160F]">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="space-y-1.5 p-3 rounded-2xl hover:bg-[#140E0A] transition-colors border border-transparent hover:border-[#261810]"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Sun className="w-4 h-4 text-[#E0C07A]" />
                  <span>Ambiance Calme & Reposante</span>
                </div>
                <p className="text-xs text-[#8E796D] leading-relaxed">
                  Un cadre apaisant idéal pour travailler, se détendre ou passer un moment agréable le week-end.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-1.5 p-3 rounded-2xl hover:bg-[#140E0A] transition-colors border border-transparent hover:border-[#261810]"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Heart className="w-4 h-4 text-[#E0C07A]" />
                  <span>Formules Complètes & Fraîches</span>
                </div>
                <p className="text-xs text-[#8E796D] leading-relaxed">
                  Pain frais, msemen, harcha, omelette, amlou, jus d’orange pressé et boissons chaudes préparées à la minute.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-1.5 p-3 rounded-2xl hover:bg-[#140E0A] transition-colors border border-transparent hover:border-[#261810]"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Coffee className="w-4 h-4 text-[#E0C07A]" />
                  <span>Café Sélectionné</span>
                </div>
                <p className="text-xs text-[#8E796D] leading-relaxed">
                  Des arômes équilibrés et une extraction soignée pour les amateurs de bon café.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-1.5 p-3 rounded-2xl hover:bg-[#140E0A] transition-colors border border-transparent hover:border-[#261810]"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Clock className="w-4 h-4 text-[#E0C07A]" />
                  <span>Ouvert Jusqu’à Minuit</span>
                </div>
                <p className="text-xs text-[#8E796D] leading-relaxed">
                  Service continu sur place et en terrasse tous les jours jusqu’à 00:00.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
