import React from 'react';
import { Coffee, MapPin, Phone, ExternalLink, Instagram, ShoppingBag } from 'lucide-react';
import { BusinessInfo } from '../types';

interface FooterProps {
  business: BusinessInfo;
  onOpenAdmin: () => void;
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ business, onOpenAdmin, logoUrl }) => {
  const currentYear = new Date().getFullYear();
  const displayLogo = logoUrl || business.logoUrl || '/logo.svg';

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const instagramLink =
    business.instagramUrl || 'https://www.instagram.com/thecoffeehouse.slj/';

  return (
    <footer className="bg-[#060403] text-[#D4C3B7] border-t border-[#1C120C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-[#1C120C]">
          {/* Column 1: Brand & Glowing Neon Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#140E0A] overflow-hidden border border-[#C5A059]/40 shadow-sm shrink-0 flex items-center justify-center p-1">
                <img
                  src={displayLogo}
                  alt="Logo the coffee house دار القهوة"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith('/logo.svg')) {
                      img.src = '/logo.svg';
                    }
                  }}
                />
              </div>
              <div>
                <span className="font-serif text-lg font-extrabold tracking-[0.14em] text-white block leading-tight uppercase neon-sign-text">
                  THE COFFEE HOUSE
                </span>
                <span className="font-arabic text-sm text-[#E0C07A] font-bold block mt-0.5 neon-arabic-glow">
                  دار القهوة
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A38F82] leading-relaxed font-light">
              Votre escale de détente à Sala Al Jadida. Formules petit-déjeuner complètes (L’express, Frenchy, Beldi), cafés d'exception et terrasse ouverte jusqu’à minuit.
            </p>

            <div className="pt-1 flex items-center gap-3">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#140E0A] border border-[#261810] flex items-center justify-center text-[#E0C07A] hover:text-white hover:bg-[#22160F] transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <span className="text-xs text-[#8E796D]">@thecoffeehouse.slj</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A38F82]">
              <li>
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#home');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#menu');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Formules Petit-Déjeuner
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#about');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Notre Espace & Terrasse
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#gallery');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Galerie Photos
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#reviews');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Avis Vérifiés ({business.googleRating}★)
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScroll('#contact');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Accès & Coordonnées
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Coordonnées
            </h4>
            <div className="space-y-3 text-xs text-[#A38F82]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E0C07A] shrink-0 mt-0.5" />
                <span>
                  {business.address}, {business.city} {business.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E0C07A] shrink-0" />
                <a
                  href={`tel:${business.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {business.phone}
                </a>
              </div>
              <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                {business.openingHours || 'Ouvert · Ferme à 00:00 (Closes 12 AM)'}
              </div>
            </div>
          </div>

          {/* Column 4: Orders & Delivery */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Commandes & Livraison
            </h4>
            <p className="text-xs text-[#A38F82] leading-relaxed font-light">
              Commandez directement sur Glovo ou par WhatsApp pour une livraison rapide à domicile ou au bureau.
            </p>
            <div className="space-y-2 pt-1">
              <a
                href={business.glovoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#FFC244] hover:bg-[#E5AE3D] text-[#1E130E] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Commander sur Glovo</span>
              </a>

              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-[#140E0A] hover:bg-[#20150F] text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-[#2C1B12]"
              >
                <span>Google Maps (4.3★)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#E0C07A]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E796D]">
          <div>
            &copy; {currentYear} <strong className="font-medium text-white">the coffee house دار القهوة</strong>. Tous droits réservés.
          </div>
          <div className="flex items-center gap-4">
            <span>Café & Salon de Thé</span>
            <span aria-hidden="true">·</span>
            <span>Sala Al Jadida 11100, Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
