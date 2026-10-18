import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem, MenuCategory } from '../types';
import { SafeImage } from './SafeImage';

interface MenuSectionProps {
  categories: MenuCategory[];
  items: MenuItem[];
  whatsappNumber?: string;
  onOpenAdminToEdit?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories,
  items,
  whatsappNumber = '+212 750-385157',
  onOpenAdminToEdit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeCategories = useMemo(() => {
    return categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
  }, [categories]);

  // Exclude any accidental old items if present in local state
  const cleanItems = useMemo(() => {
    return items.filter(
      (item) =>
        !item.name.toLowerCase().includes('brownie') &&
        !item.name.toLowerCase().includes('terrasse')
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    return cleanItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nameAr && item.nameAr.includes(searchQuery)) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [cleanItems, selectedCategory, searchQuery]);

  const cleanPhone = (whatsappNumber || '+212 750-385157').replace(/\D/g, '');

  const getWhatsAppOrderUrl = (item: MenuItem) => {
    const priceText = item.price !== null ? `${item.price} Dh` : 'Tarif sur place';
    const message = `Bonjour the coffee house دار القهوة, je souhaite commander :\n\n• Formule : ${item.name} (${priceText})\n• Composition : ${item.description}\n\nMerci de me confirmer la préparation !`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section id="menu" className="py-24 bg-[#06120C] border-t border-[#153826]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4 mb-14"
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
              <span>Formules & Carte Officielle</span>
              <span aria-hidden="true" className="text-[#34D399]">·</span>
              <span>Commandes WhatsApp</span>
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
            Nos Formules Petit-Déjeuner
          </h2>
          <p className="text-sm sm:text-base text-[#A8C2B5] font-light leading-relaxed">
            Compositions fraîches et généreuses servies sur place et en terrasse. Commandez en direct via WhatsApp pour une préparation immédiate.
          </p>
        </motion.div>

        {/* Filter Controls: Category Buttons + Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#163827]"
        >
          {/* Segmented Category Buttons - Primary Cafe Dark Green */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-[#174831] via-[#1E5C3F] to-[#143D2B] text-white border-2 border-[#2E8B62] font-bold shadow-[0_0_20px_rgba(46,139,98,0.35)]'
                  : 'bg-[#091710] text-[#A6BFB2] hover:text-white hover:bg-[#0E241A] border border-[#163827]'
              }`}
            >
              Toutes les Formules ({cleanItems.length})
            </button>
            {activeCategories.map((category) => {
              const count = cleanItems.filter((i) => i.categoryId === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-[#174831] via-[#1E5C3F] to-[#143D2B] text-white border-2 border-[#2E8B62] font-bold shadow-[0_0_20px_rgba(46,139,98,0.35)]'
                      : 'bg-[#091710] text-[#A6BFB2] hover:text-white hover:bg-[#0E241A] border border-[#163827]'
                  }`}
                >
                  <span>{category.name}</span>
                  {category.nameAr && (
                    <span className="ml-1 opacity-75 font-arabic text-[11px]">({category.nameAr})</span>
                  )}
                  <span className="ml-1.5 opacity-60 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#789689]" />
            <input
              type="text"
              placeholder="Rechercher une formule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#091710] border border-[#183E2C] rounded-xl text-white placeholder-[#789689] focus:outline-none focus:border-[#2E8B62]"
            />
          </div>
        </motion.div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#091710] rounded-3xl border border-[#163827] p-8 max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-[#E0C07A] mx-auto mb-3" />
            <h3 className="text-lg font-serif font-bold text-white mb-1">
              Aucun résultat
            </h3>
            <p className="text-xs text-[#9BB3A7] mb-4">
              Aucune formule ne correspond à votre recherche.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#143D2B] hover:bg-[#1E5C3F] border border-[#2E8B62] rounded-xl cursor-pointer"
            >
              Réinitialiser
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 45, rotateX: 6 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  delay: index * 0.09,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8, scale: 1.018 }}
                className="group bg-[#081710] rounded-3xl overflow-hidden border border-[#173D2A] hover:border-[#2E8B62] shadow-xl hover:shadow-[0_16px_40px_rgba(4,16,10,0.85)] transition-all duration-300 flex flex-col justify-between relative will-change-transform card-sheen"
              >
                <div>
                  {/* Image Presentation */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#050D08]">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.name}
                      transformOptions={{ width: 600, height: 400, crop: 'fill', quality: 'auto' }}
                      fallbackCategory="breakfast"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      containerClassName="w-full h-full"
                    />

                    {/* Price Badge in Image Corner - Cafe Dark Green Frame */}
                    <div className="absolute top-3 right-3 bg-[#05130C]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#2E8B62] shadow-lg">
                      <span className="font-serif text-lg font-bold text-white tabular-nums">
                        {item.price}
                      </span>
                      <span className="text-xs font-bold text-[#34D399] ml-1">
                        Dh
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Item Title & Arabic Title */}
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-serif text-2xl font-bold text-white tracking-tight group-hover:text-[#34D399] transition-colors">
                        {item.name}
                      </h3>
                      {item.nameAr && (
                        <span className="font-arabic text-lg text-[#E0C07A] font-medium">
                          {item.nameAr}
                        </span>
                      )}
                    </div>

                    {/* Exact Description */}
                    <p className="text-xs sm:text-[13px] text-[#C4D9CD] font-normal leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {item.descriptionAr && (
                      <p className="text-xs text-[#E0C07A]/90 font-arabic leading-relaxed mb-3 text-right">
                        {item.descriptionAr}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom WhatsApp Order Button */}
                <div className="p-6 pt-3 border-t border-[#132F21] bg-[#06140D]/90 space-y-2">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={getWhatsAppOrderUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                    <span>Commander via WhatsApp ({item.price} Dh)</span>
                  </motion.a>
                  <div className="text-center">
                    <span className="text-[10px] text-[#7A998B]">
                      Destination : <strong className="text-white">+212 750-385157</strong>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Customer Care Note (Commercial, friendly, no admin text) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mt-14 p-6 rounded-3xl bg-[#081710] border border-[#163827] text-center max-w-2xl mx-auto shadow-sm"
        >
          <p className="text-xs text-[#A8C2B5] leading-relaxed">
            Toutes nos formules sont servies fraîches sur place et en terrasse à Sala Al Jadida. Boissons chaudes supplémentaires, jus pressés d'orange ou de carotte disponibles à la demande.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
