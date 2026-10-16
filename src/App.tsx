import React, { useState, useEffect } from 'react';
import {
  BusinessInfo,
  MenuCategory,
  MenuItem,
  GalleryItem,
  WebsiteSettings,
} from './types';
import {
  getBusinessInfo,
  getMenuCategories,
  getMenuItems,
  getGalleryItems,
  getWebsiteSettings,
  subscribeToAuth,
  AdminUser,
} from './services/firebase';
import {
  INITIAL_BUSINESS_INFO,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_SETTINGS,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ReviewsSection } from './components/ReviewsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { BackToTop } from './components/BackToTop';
import { AmbientBackground } from './components/AmbientBackground';
import { ScrollNavigator } from './components/ScrollNavigator';
import { ScrollMarquee } from './components/ScrollMarquee';
import { useSmoothScroll, scrollToTarget } from './hooks/useSmoothScroll';

export default function App() {
  // Initialize luxury smooth inertial scrolling
  useSmoothScroll();
  const [business, setBusiness] = useState<BusinessInfo>(INITIAL_BUSINESS_INFO);
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize data from Firebase / cache
  useEffect(() => {
    async function loadData() {
      try {
        const [
          fetchedBusiness,
          fetchedCategories,
          fetchedMenu,
          fetchedGallery,
          fetchedSettings,
        ] = await Promise.all([
          getBusinessInfo(),
          getMenuCategories(),
          getMenuItems(),
          getGalleryItems(),
          getWebsiteSettings(),
        ]);

        const unifiedLogo = fetchedSettings?.logoUrl || fetchedBusiness?.logoUrl || '/logo.svg';
        if (fetchedBusiness) {
          setBusiness({
            ...fetchedBusiness,
            logoUrl: unifiedLogo,
          });
        }
        if (fetchedCategories && fetchedCategories.length > 0) setCategories(fetchedCategories);
        if (fetchedMenu && fetchedMenu.length > 0) setMenuItems(fetchedMenu);
        if (fetchedGallery && fetchedGallery.length > 0) setGalleryItems(fetchedGallery);
        if (fetchedSettings) {
          setSettings({
            ...fetchedSettings,
            logoUrl: unifiedLogo || fetchedSettings.logoUrl || '',
          });
        }
      } catch (err) {
        console.warn('Error loading initial website data, running on resilient fallback:', err);
      } finally {
        setIsDataLoaded(true);
      }
    }

    loadData();

    // Check for admin URL flag (#admin or ?admin=true)
    if (
      window.location.hash === '#admin' ||
      new URLSearchParams(window.location.search).get('admin') === 'true'
    ) {
      setIsAdminOpen(true);
    }

    // Subscribe to authentication state
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleExploreMenu = () => {
    scrollToTarget('#menu');
  };

  const handleFindUs = () => {
    scrollToTarget('#contact');
  };

  const activeLogoUrl = settings.logoUrl || business.logoUrl || '/logo.svg';

  return (
    <div className="min-h-screen flex flex-col bg-[#090604] text-[#F4EFEB] relative overflow-x-hidden selection:bg-[#C5A059]/30 selection:text-white">
      {/* Living Ambient Lighting & Parallax Depth */}
      <AmbientBackground />

      {/* Desktop Quick-Jump Micro-Dock */}
      <ScrollNavigator />

      {/* Navigation Bar */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={Boolean(currentUser)}
        logoUrl={activeLogoUrl}
        instagramUrl={business.instagramUrl}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={{ ...settings, logoUrl: activeLogoUrl }}
          business={{ ...business, logoUrl: activeLogoUrl }}
          onExploreMenu={handleExploreMenu}
          onFindUs={handleFindUs}
        />

        {/* Dynamic Kinetic Marquee Ticker */}
        <ScrollMarquee />

        {/* Interactive Menu Section with WhatsApp Ordering */}
        <MenuSection
          categories={categories}
          items={menuItems}
          whatsappNumber={business.whatsappNumber || business.phone}
          onOpenAdminToEdit={() => setIsAdminOpen(true)}
        />

        {/* About Section */}
        <AboutSection />

        {/* Verified Reviews Section */}
        <ReviewsSection business={business} />

        {/* Gallery Section */}
        <GallerySection items={galleryItems} />

        {/* Location & Contact Section */}
        <ContactSection business={business} />
      </main>

      {/* Footer */}
      <Footer
        business={{ ...business, logoUrl: activeLogoUrl }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        logoUrl={activeLogoUrl}
      />

      {/* Dynamic Scroll Progress Ring & Back to Top */}
      <BackToTop />

      {/* Admin Dashboard Drawer / Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          // Clear #admin hash if present
          if (window.location.hash === '#admin') {
            window.history.pushState(
              '',
              document.title,
              window.location.pathname + window.location.search
            );
          }
        }}
        currentUser={currentUser}
        business={business}
        categories={categories}
        menuItems={menuItems}
        galleryItems={galleryItems}
        settings={settings}
        onUpdateBusiness={setBusiness}
        onUpdateCategories={setCategories}
        onUpdateMenuItems={setMenuItems}
        onUpdateGallery={setGalleryItems}
        onUpdateSettings={setSettings}
        onUserAuthChange={setCurrentUser}
      />
    </div>
  );
}
