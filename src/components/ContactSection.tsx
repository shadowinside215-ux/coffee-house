import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  ShoppingBag,
  Clock,
  Compass,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BusinessInfo } from '../types';

interface ContactSectionProps {
  business: BusinessInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ business }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    const fullAddress = `${business.address}, ${business.postalCode} ${business.city}, ${business.country}`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const instagramLink =
    business.instagramUrl || 'https://www.instagram.com/thecoffeehouse.slj/';

  return (
    <section id="contact" className="py-24 bg-[#090604] border-t border-[#1C120C] overflow-hidden">
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
              <span>Accès & Coordonnées</span>
              <span aria-hidden="true">·</span>
              <span>Sala Al Jadida</span>
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
            Venez Nous Rendre Visite
          </h2>
          <p className="text-sm sm:text-base text-[#B8A79B] font-light leading-relaxed">
            Profitez de notre terrasse extérieure et de notre salon convivial à Sala Al Jadida. Ouvert tous les jours jusqu’à minuit.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Contact Cards & Ordering Links */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5 flex flex-col justify-between"
          >
            {/* Address Card */}
            <div className="bg-[#120C08] rounded-3xl p-6 sm:p-7 border border-[#22160F] shadow-lg space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#1C130D] text-white border border-[#2C1B12] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#E0C07A]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Adresse de l'Établissement
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D4C3B7] leading-relaxed mt-1 font-medium">
                      {business.address}
                    </p>
                    <p className="text-xs text-[#8E796D]">
                      {business.city} {business.postalCode}, {business.country}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCopyAddress}
                  title="Copier l'adresse"
                  className="p-2 text-[#8E796D] hover:text-white bg-[#1C130D] hover:bg-[#281B13] rounded-xl border border-[#2C1B12] transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Hours & Plus Code */}
              <div className="pt-3 border-t border-[#1F130B] flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8E796D] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E0C07A]" />
                    <span>Horaires :</span>
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {business.openingHours || 'Ouvert · Ferme à 00:00 (Closes 12 AM)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E796D] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#E0C07A]" />
                    <span>Plus Code :</span>
                  </span>
                  <span className="font-mono text-white bg-[#1C130D] px-2 py-0.5 rounded border border-[#2C1B12]">
                    {business.plusCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Calling & WhatsApp */}
            <div className="bg-[#120C08] rounded-3xl p-6 sm:p-7 border border-[#22160F] shadow-lg space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#1C130D] text-white border border-[#2C1B12] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#E0C07A]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Commandes & Réservations
                  </h3>
                  <p className="text-xs text-[#8E796D] mt-0.5">
                    Appelez-nous directement ou écrivez-nous sur WhatsApp.
                  </p>
                  <a
                    href={`tel:${business.phone.replace(/\s+/g, '')}`}
                    className="inline-block mt-2 font-serif text-xl font-bold text-[#E0C07A] hover:text-white tracking-wide transition-colors"
                  >
                    {business.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons: Glovo, Google Maps, Instagram */}
            <div className="space-y-3 pt-1">
              {/* Glovo Button (Updated Official Link) */}
              <a
                href={business.glovoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-5 bg-[#FFC244] hover:bg-[#E5AE3D] text-[#1E130E] rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 text-[#1E130E]" />
                <span>Commander sur Glovo (Livraison)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Maps GPS Route */}
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#140E0A] hover:bg-[#20150F] text-white rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-[#2C1B12] shadow-sm hover:border-white/30"
                >
                  <Navigation className="w-4 h-4 text-[#E0C07A]" />
                  <span>Itinéraire Google Maps</span>
                </a>

                {/* Instagram Button */}
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-[#E1306C]/15 hover:bg-[#E1306C]/25 text-white border border-[#E1306C]/40 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Instagram className="w-4 h-4 text-[#E1306C]" />
                  <span>Instagram @thecoffeehouse</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Embedded Map with Pin */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#120C08] rounded-3xl border border-[#22160F] overflow-hidden shadow-2xl flex flex-col min-h-[460px]"
          >
            {/* Map Top Bar */}
            <div className="p-4 bg-[#0E0906] border-b border-[#22160F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">
                  the coffee house دار القهوة — Sala Al Jadida
                </span>
              </div>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-[#E0C07A] hover:text-white flex items-center gap-1"
              >
                <span>Ouvrir sur Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 w-full h-full min-h-[400px]">
              <iframe
                title="Google Maps the coffee house دار القهوة"
                src="https://maps.google.com/maps?q=33.9858,-6.7454&hl=fr&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Float Map Overlay Card matching user Google Maps screenshot */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-[#090604]/95 backdrop-blur-md p-4 rounded-2xl border border-[#2C1B12] shadow-2xl pointer-events-auto">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1C130D] text-white flex items-center justify-center shrink-0 border border-white/10">
                    <MapPin className="w-4 h-4 text-[#E0C07A]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">
                      the coffee house دار القهوة
                    </h4>
                    <p className="text-[11px] text-[#A38F82] mt-0.5">
                      4 RESIDENCE BELLE VUE 3 MAG 21, Sala Al Jadida
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="text-emerald-400 font-medium">Ouvert · Ferme à 00:00</span>
                      <span className="text-[#8E796D]">·</span>
                      <span className="text-[#E0C07A] font-semibold">4.3★ (41 avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
