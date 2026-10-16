import { BusinessInfo, MenuCategory, MenuItem, GalleryItem, WebsiteSettings } from '../types';
import { DEFAULT_CAFE_IMAGES } from '../services/cloudinary';

export const INITIAL_BUSINESS_INFO: BusinessInfo = {
  arabicName: 'دار القهوة',
  englishName: 'the coffee house',
  category: 'Café / Coffee House',
  address: '4 RESIDENCE BELLE VUE 3 MAG 21',
  city: 'Sala Al Jadida',
  postalCode: '11100',
  country: 'Morocco',
  phone: '+212 750-385157',
  whatsappNumber: '+212 750-385157',
  plusCode: 'X7W6+GJ, Sala Al Jadida',
  priceRange: 'MAD 1–50',
  googleRating: 4.3,
  reviewCount: 41,
  openingHours: 'Ouvert · Ferme à 00:00 (Closes 12 AM)',
  services: ['Dine-in (Sur place)', 'Terrace Seating (Terrasse extérieure)'],
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=the+coffee+house+%D8%AF%D8%A7%D8%B1+%D8%A7%D9%84%D9%82%D9%87%D9%88%D8%A9+4+RESIDENCE+BELLE+VUE+3+MAG+21+Sala+Al+Jadida+11100',
  glovoUrl:
    'https://glovoapp.com/fr/ma/technopolis/stores/the-coffee-house-tec?utm_medium=organic&utm_campaign=google_reserve_place_order_action&utm_source=google',
  instagramUrl: 'https://www.instagram.com/thecoffeehouse.slj/',
  taplinkUrl: 'https://taplink.cc',
  logoUrl: '', // Uploadable via Admin
  description:
    'More than a coffee stop, the coffee house دار القهوة is a place to slow down, enjoy exceptional coffee, share delicious Moroccan breakfast formulas (L’express, Frenchy, Beldi), and spend time in a comfortable atmosphere with outdoor terrace seating in Sala Al Jadida.',
  descriptionAr:
    'أكثر من مجرد مقهى، دار القهوة هي وجهتكم اليومية للراحة والاستمتاع بأجود أنواع القهوة، ووجبات الفطور المتكاملة في أجواء مريحة وهادئة مع تراس خارجي بسلا الجديدة.',
};

export const INITIAL_CATEGORIES: MenuCategory[] = [
  {
    id: 'formules-petit-dejeuner',
    name: 'Formules Petit-Déjeuner',
    nameAr: 'وجبات الفطور المتكاملة',
    order: 1,
    isActive: true,
  },
];

/**
 * Menu items directly from the verified café menu:
 * - L'express (28 Dh)
 * - Frenchy (28 Dh)
 * - Beldi (42 Dh)
 */
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'lexpress',
    name: "L’express",
    nameAr: 'فطور إكسبريس',
    description: "Panier de pain ,huile d'olive ,beurre ,miel confiture, jus d’orange / jus de carotte boisson chaude, eau minérale",
    descriptionAr: 'سلة خبز، زيت زيتون، زبدة، عسل، مربى، عصير برتقال أو جزر، مشروب ساخن، ماء معدني.',
    price: 28,
    categoryId: 'formules-petit-dejeuner',
    imageUrl: DEFAULT_CAFE_IMAGES.moroccanBreakfast,
    isAvailable: true,
    isFeatured: true,
    order: 1,
  },
  {
    id: 'frenchy',
    name: 'Frenchy',
    nameAr: 'فطور فرينشي',
    description: "1 grande viennoiserie, jus d’orange / jus de carotte ,boisson chaude , eau minérale",
    descriptionAr: 'قطعة فيينوازري كبيرة (كرواسون طازج)، عصير برتقال أو جزر، مشروب ساخن، ماء معدني.',
    price: 28,
    categoryId: 'formules-petit-dejeuner',
    imageUrl: DEFAULT_CAFE_IMAGES.harchaMsemen,
    isAvailable: true,
    isFeatured: true,
    order: 2,
  },
  {
    id: 'beldi',
    name: 'Beldi',
    nameAr: 'فطور بلدي مغربي',
    description: "Msemen , harcha , omelette (jben, beurre, miel, amlou), jus d’orange / jus de carotte boisson chaude , eau minérale (possibilité de remplacer l’omelette avec double portion de msemen harcha )",
    descriptionAr: 'مسمن، حرشة، أومليت (جبن، زبدة، عسل، أملو)، عصير برتقال أو جزر، مشروب ساخن، ماء معدني (إمكانية تعويض الأومليت بحصة مضاعفة من المسمن والحرشة).',
    price: 42,
    categoryId: 'formules-petit-dejeuner',
    imageUrl: DEFAULT_CAFE_IMAGES.moroccanBreakfast,
    isAvailable: true,
    isFeatured: true,
    order: 3,
  },
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Façade Lumineuse & Terrasse',
    titleAr: 'واجهة المقهى والتراس الخارجي',
    category: 'ambiance',
    imageUrl: DEFAULT_CAFE_IMAGES.cafeInterior,
    caption: 'La façade lumineuse de the coffee house دار القهوة à Sala Al Jadida.',
    order: 1,
  },
  {
    id: 'gal-2',
    title: 'Formule Beldi Traditionnelle',
    titleAr: 'وجبة فطور بلدي مغربي',
    category: 'breakfast',
    imageUrl: DEFAULT_CAFE_IMAGES.moroccanBreakfast,
    caption: 'Msemen, harcha, omelette, amlou, miel et jus d’orange frais.',
    order: 2,
  },
  {
    id: 'gal-3',
    title: 'Café & Boissons Chaudes',
    titleAr: 'قهوة مميزة ومشروبات ساخنة',
    category: 'coffee',
    imageUrl: DEFAULT_CAFE_IMAGES.espressoTerrace,
    caption: 'Une sélection de cafés de qualité servis avec soin.',
    order: 3,
  },
  {
    id: 'gal-4',
    title: 'Ambiance Calme en Soirée',
    titleAr: 'أجواء هادئة ومريحة',
    category: 'ambiance',
    imageUrl: DEFAULT_CAFE_IMAGES.cafeInterior,
    caption: 'Cadre chaleureux et reposant ouvert jusqu’à minuit.',
    order: 4,
  },
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  heroHeadline: 'the coffee house دار القهوة',
  heroHeadlineAr: 'دار القهوة — لحظتك اليومية من الراحة والهدوء',
  heroSubtext:
    'Découvrez nos formules petit-déjeuner complètes (L’express, Frenchy, Beldi), nos cafés d’exception et une ambiance chaleureuse avec terrasse à Sala Al Jadida. Ouvert tous les jours jusqu’à minuit.',
  heroSubtextAr:
    'اكتشفوا وجبات الفطور المتكاملة (إكسبريس، فرينشي، بلدي)، وأجود أنواع القهوة في أجواء هادئة مع جلسات مريحة وتراس خارجي بسلا الجديدة.',
  heroImageUrl: DEFAULT_CAFE_IMAGES.hero,
  logoUrl: '',
};
