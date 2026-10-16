export interface BusinessInfo {
  arabicName: string;
  englishName: string;
  category: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  plusCode: string;
  priceRange: string;
  googleRating: number;
  reviewCount: number;
  services: string[];
  googleMapsUrl: string;
  glovoUrl: string;
  taplinkUrl: string;
  instagramUrl?: string;
  openingHours?: string;
  description: string;
  descriptionAr: string;
  logoUrl?: string;
  whatsappNumber?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  nameAr: string;
  order: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number | null; // Price in MAD
  categoryId: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleAr?: string;
  category: 'coffee' | 'breakfast' | 'desserts' | 'ambiance';
  imageUrl: string;
  caption?: string;
  order: number;
}

export interface WebsiteSettings {
  heroHeadline: string;
  heroHeadlineAr: string;
  heroSubtext: string;
  heroSubtextAr: string;
  heroImageUrl: string;
  logoUrl?: string;
}
