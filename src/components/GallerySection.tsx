import React, { useState } from 'react';
import { Maximize2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GalleryItem } from '../types';
import { SafeImage } from './SafeImage';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'Toutes les photos' },
    { id: 'ambiance', label: 'Façade Lumineuse & Terrasse' },
    { id: 'breakfast', label: 'Formules Petit-Déjeuner' },
    { id: 'coffee', label: 'Café & Boissons' },
  ];

  const filteredItems = items.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <section id="gallery" className="py-24 bg-[#06120C] border-t border-[#153826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-12"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="origin-right h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#2E8B62]"
            />
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#E0C07A] uppercase">
              <span>Galerie Visuelle</span>
              <span aria-hidden="true" className="text-[#34D399]">·</span>
              <span>Moments & Cadre</span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="origin-left h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#2E8B62]"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            L'Univers de the coffee house
          </h2>
          <p className="text-sm sm:text-base text-[#A8C2B5] font-light leading-relaxed">
            Découvrez la façade lumineuse de nuit, nos formules matinales et la terrasse calme de دار القهوة à Sala Al Jadida.
          </p>
        </motion.div>

        {/* Filter Tabs - Cafe Dark Green Primary */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 pb-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-gradient-to-r from-[#174831] via-[#1E5C3F] to-[#143D2B] text-white border-2 border-[#2E8B62] font-bold shadow-[0_0_18px_rgba(46,139,98,0.35)]'
                  : 'bg-[#091710] text-[#A6BFB2] hover:text-white hover:bg-[#0E241A] border border-[#163827]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-3xl overflow-hidden border border-[#173D2A] hover:border-[#2E8B62] bg-[#081710] shadow-lg hover:shadow-[0_16px_40px_rgba(4,16,10,0.85)] transition-all duration-300 cursor-pointer aspect-square will-change-transform"
            >
              <SafeImage
                src={item.imageUrl}
                alt={item.title}
                transformOptions={{ width: 800, height: 800, crop: 'fill', quality: 'auto' }}
                fallbackCategory={item.category}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                containerClassName="w-full h-full"
              />

              {/* Hover Dark Scrim & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06120C]/95 via-[#06140D]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold tracking-tight text-white">
                      {item.title}
                    </h3>
                    {item.titleAr && (
                      <span className="font-arabic text-xs text-[#E0C07A] block">
                        {item.titleAr}
                      </span>
                    )}
                    {item.caption && (
                      <p className="text-xs text-[#A8C2B5] line-clamp-1 mt-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#143D2B]/80 backdrop-blur-sm flex items-center justify-center shrink-0 border border-[#2E8B62] text-[#34D399]">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-[#040A07]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-[#081710] rounded-3xl overflow-hidden border border-[#183E2C] shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main Lightbox Content */}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-3/5 bg-black flex items-center justify-center min-h-[350px]">
                <SafeImage
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  transformOptions={{ width: 1200, height: 900, crop: 'fit', quality: 'auto' }}
                  fallbackCategory={activeItem.category}
                  className="w-full h-full max-h-[70vh] object-contain"
                  containerClassName="w-full h-full"
                />
              </div>

              <div className="md:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-[#F4EFEB]">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-[#E0C07A] font-semibold">
                    {activeItem.category}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                    {activeItem.title}
                  </h3>
                  {activeItem.titleAr && (
                    <div className="font-arabic text-xl text-[#E0C07A]">
                      {activeItem.titleAr}
                    </div>
                  )}
                  {activeItem.caption && (
                    <p className="text-xs text-[#B8A79B] leading-relaxed pt-2">
                      {activeItem.caption}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#E0C07A] tracking-wider uppercase font-medium">
                    the coffee house · دار القهوة
                  </span>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="text-xs text-white/80 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Fermer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
