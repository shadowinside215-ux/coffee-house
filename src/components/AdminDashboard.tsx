import React, { useState } from 'react';
import {
  X,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertTriangle,
  Upload,
  Layers,
  Utensils,
  Image as ImageIcon,
  Sliders,
  Database,
  RefreshCw,
  MessageCircle,
  Coffee,
} from 'lucide-react';
import {
  BusinessInfo,
  MenuCategory,
  MenuItem,
  GalleryItem,
  WebsiteSettings,
} from '../types';
import {
  isFirebaseConfigured,
  AdminUser,
  loginAdminUser,
  logoutAdminUser,
  saveBusinessInfo,
  saveMenuCategory,
  deleteMenuCategory,
  saveMenuItem,
  deleteMenuItem,
  saveGalleryItem,
  deleteGalleryItem,
  saveWebsiteSettings,
  seedInitialDataToFirestore,
  FIRESTORE_SECURITY_RULES,
} from '../services/firebase';
import {
  CLOUDINARY_CONFIG,
  getCloudinaryConfig,
  saveCloudinaryConfig,
  uploadImageToCloudinary,
  DEFAULT_CAFE_IMAGES,
} from '../services/cloudinary';
import { compressImageFile } from '../services/imageOptimizer';
import { SafeImage } from './SafeImage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AdminUser | null;
  business: BusinessInfo;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  galleryItems: GalleryItem[];
  settings: WebsiteSettings;
  onUpdateBusiness: (updated: BusinessInfo) => void;
  onUpdateCategories: (updated: MenuCategory[]) => void;
  onUpdateMenuItems: (updated: MenuItem[]) => void;
  onUpdateGallery: (updated: GalleryItem[]) => void;
  onUpdateSettings: (updated: WebsiteSettings) => void;
  onUserAuthChange: (user: AdminUser | null) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  business,
  categories,
  menuItems,
  galleryItems,
  settings,
  onUpdateBusiness,
  onUpdateCategories,
  onUpdateMenuItems,
  onUpdateGallery,
  onUpdateSettings,
  onUserAuthChange,
}) => {
  const [activeTab, setActiveTab] = useState<
    'menu' | 'categories' | 'gallery' | 'branding' | 'business' | 'setup'
  >('menu');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('dragonball86@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Status message state
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // Editing state for Menu Item modal
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Editing state for Category modal
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Editing state for Gallery modal
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Business state form
  const [businessForm, setBusinessForm] = useState<BusinessInfo>(business);

  // Branding / Settings form
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>(settings);

  // Cloudinary credentials form
  const [cloudinaryForm, setCloudinaryForm] = useState(getCloudinaryConfig());

  // Upload states
  const [isUploadingItem, setIsUploadingItem] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const user = await loginAdminUser(loginEmail, loginPassword);
      onUserAuthChange(user);
      showStatus('Connexion réussie au panneau d’administration.');
    } catch (err: unknown) {
      setLoginError((err as Error).message || 'Échec de la connexion.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdminUser();
    onUserAuthChange(null);
    showStatus('Vous êtes déconnecté.');
  };

  // Generic Image Upload handler
  const handleFileUpload = async (
    file: File,
    setLoading: (l: boolean) => void,
    onSuccess: (url: string) => void
  ) => {
    setLoading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      onSuccess(result.url);
      showStatus('Image téléversée avec succès sur Cloudinary !');
    } catch (error: unknown) {
      // If Cloudinary preset error or not configured, compress to lightweight optimized data URL
      try {
        const compressedUrl = await compressImageFile(file, {
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.88,
        });
        onSuccess(compressedUrl);
        showStatus('Image traitée et appliquée avec succès !', 'success');
      } catch {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onSuccess(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setLoading(false);
    }
  };

  // Menu item save
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    try {
      await saveMenuItem(editingMenuItem);
      const updated = menuItems.map((m) =>
        m.id === editingMenuItem.id ? editingMenuItem : m
      );
      if (!menuItems.some((m) => m.id === editingMenuItem.id)) {
        updated.push(editingMenuItem);
      }
      onUpdateMenuItems(updated);
      setIsItemModalOpen(false);
      setEditingMenuItem(null);
      showStatus('Article de menu enregistré avec succès.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur lors de l’enregistrement.', 'error');
    }
  };

  // Menu item delete
  const handleDeleteMenuItem = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    try {
      await deleteMenuItem(id);
      onUpdateMenuItems(menuItems.filter((m) => m.id !== id));
      showStatus('Article supprimé.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Category save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await saveMenuCategory(editingCategory);
      const updated = categories.map((c) =>
        c.id === editingCategory.id ? editingCategory : c
      );
      if (!categories.some((c) => c.id === editingCategory.id)) {
        updated.push(editingCategory);
      }
      onUpdateCategories(updated);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      showStatus('Catégorie enregistrée.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Category delete
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await deleteMenuCategory(id);
      onUpdateCategories(categories.filter((c) => c.id !== id));
      showStatus('Catégorie supprimée.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Gallery save
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    try {
      await saveGalleryItem(editingGalleryItem);
      const updated = galleryItems.map((g) =>
        g.id === editingGalleryItem.id ? editingGalleryItem : g
      );
      if (!galleryItems.some((g) => g.id === editingGalleryItem.id)) {
        updated.push(editingGalleryItem);
      }
      onUpdateGallery(updated);
      setIsGalleryModalOpen(false);
      setEditingGalleryItem(null);
      showStatus('Photo enregistrée.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Gallery delete
  const handleDeleteGalleryItem = async (id: string) => {
    if (!window.confirm('Supprimer cette photo de la galerie ?')) return;
    try {
      await deleteGalleryItem(id);
      onUpdateGallery(galleryItems.filter((g) => g.id !== id));
      showStatus('Photo supprimée.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Keep forms in sync if props change
  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  React.useEffect(() => {
    setBusinessForm(business);
  }, [business]);

  // Instantly apply and save Logo to settings & business & storage
  const handleApplyLogo = async (newLogoUrl: string) => {
    try {
      const updatedSettings = { ...settingsForm, logoUrl: newLogoUrl };
      const updatedBusiness = { ...businessForm, logoUrl: newLogoUrl };

      setSettingsForm(updatedSettings);
      setBusinessForm(updatedBusiness);

      // Save to persistence (Firebase & local cache)
      await Promise.all([
        saveWebsiteSettings(updatedSettings),
        saveBusinessInfo(updatedBusiness),
      ]);

      // Inform parent state immediately
      onUpdateSettings(updatedSettings);
      onUpdateBusiness(updatedBusiness);

      if (newLogoUrl) {
        showStatus('Le logo de دار القهوة est maintenant en ligne et appliqué sur tout le site !', 'success');
      } else {
        showStatus('Logo réinitialisé vers le monogramme par défaut.', 'success');
      }
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur lors de la mise à jour du logo.', 'error');
    }
  };

  // Instantly apply and save Hero Image
  const handleApplyHeroImage = async (newHeroUrl: string) => {
    try {
      const updatedSettings = { ...settingsForm, heroImageUrl: newHeroUrl };
      setSettingsForm(updatedSettings);

      await saveWebsiteSettings(updatedSettings);
      onUpdateSettings(updatedSettings);

      showStatus('Photo Hero appliquée et enregistrée avec succès !', 'success');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur lors de la mise à jour de la photo Hero.', 'error');
    }
  };

  // Save Branding (Logo & Hero Image)
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveWebsiteSettings(settingsForm);
      onUpdateSettings(settingsForm);

      // Also sync logoUrl with business info
      const updatedBusiness = { ...businessForm, logoUrl: settingsForm.logoUrl };
      setBusinessForm(updatedBusiness);
      await saveBusinessInfo(updatedBusiness);
      onUpdateBusiness(updatedBusiness);

      showStatus('Logo et photo Hero mis à jour avec succès !');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Business save
  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveBusinessInfo(businessForm);
      onUpdateBusiness(businessForm);
      showStatus('Informations et coordonnées mises à jour avec succès.');
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur.', 'error');
    }
  };

  // Save Cloudinary Settings
  const handleSaveCloudinarySettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudinaryConfig(cloudinaryForm.cloudName, cloudinaryForm.uploadPreset);
    showStatus('Paramètres Cloudinary sauvegardés avec succès !');
  };

  // Sync / Seed Firestore
  const handleSeedFirestore = async () => {
    if (!window.confirm('Voulez-vous synchroniser les données initiales vers votre Firestore ?')) return;
    try {
      const res = await seedInitialDataToFirestore();
      showStatus(`Succès ! ${res.count} documents créés dans Firestore.`);
    } catch (err: unknown) {
      showStatus((err as Error).message || 'Erreur Firestore.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#06140E] text-[#F4EFEB] rounded-3xl border border-[#183E2C] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#081B13] text-white flex items-center justify-between border-b border-[#143525] shrink-0">
          <div className="flex items-center gap-3">
            {settingsForm.logoUrl || business.logoUrl ? (
              <div className="w-9 h-9 rounded-xl bg-[#1C130D] border border-[#C5A059]/50 flex items-center justify-center p-1 overflow-hidden shrink-0 neon-cup-glow">
                <img
                  src={settingsForm.logoUrl || business.logoUrl}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#1C130D] border border-white/10 flex items-center justify-center text-white neon-cup-glow">
                <Lock className="w-4 h-4 text-[#E0C07A]" />
              </div>
            )}
            <div>
              <h2 className="font-serif text-lg font-bold text-white leading-tight">
                Administration — the coffee house دار القهوة
              </h2>
              <p className="text-xs text-[#8E796D]">
                Gestion des formules (L’express, Frenchy, Beldi), photos Cloudinary et WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-[#D4C3B7] hover:text-white bg-[#1A120C] hover:bg-[#251911] rounded-xl flex items-center gap-1.5 border border-[#2B1B12] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#8E796D] hover:text-white hover:bg-[#1A120C] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
                : 'bg-red-950/80 text-red-300 border-b border-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body Container */}
        {!currentUser ? (
          /* Authentication View */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto my-auto w-full">
            {settingsForm.logoUrl || business.logoUrl ? (
              <div className="w-16 h-16 rounded-2xl bg-[#140E0A] flex items-center justify-center mb-6 shadow-xl border-2 border-[#C5A059]/60 p-2 overflow-hidden neon-cup-glow">
                <img
                  src={settingsForm.logoUrl || business.logoUrl}
                  alt="Logo دار القهوة"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-[#140E0A] text-white flex items-center justify-center mb-6 shadow-lg border border-white/10 neon-cup-glow">
                <Lock className="w-7 h-7 text-[#E0C07A]" />
              </div>
            )}
            <h3 className="font-serif text-2xl font-bold text-white text-center mb-1">
              Connexion Propriétaire / Admin
            </h3>
            <p className="text-xs text-[#8E796D] text-center mb-8">
              Connectez-vous avec votre adresse email <strong className="text-white">dragonball86@gmail.com</strong> pour gérer le café.
            </p>

            {loginError && (
              <div className="w-full mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B8A79B] uppercase tracking-wider mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="dragonball86@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#140E0A] border border-[#2B1B12] rounded-xl text-white focus:border-white/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8A79B] uppercase tracking-wider mb-1.5">
                  Mot de Passe
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#140E0A] border border-[#2B1B12] rounded-xl text-white focus:border-white/40 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#1C130D] hover:bg-[#2A1D13] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md mt-2 disabled:opacity-50 border border-white/20 cursor-pointer"
              >
                {isLoggingIn ? 'Connexion en cours...' : 'Se Connecter'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#1C120C] w-full text-center">
              <span className="text-[11px] text-[#8E796D] block">
                {isFirebaseConfigured
                  ? 'Connecté à Firebase Authentication'
                  : 'Compte gérant reconnu : dragonball86@gmail.com (accès sécurisé immédiat).'}
              </span>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard View with Tabs */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-[#120C08] border-r border-[#22160F] p-4 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'menu'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <Utensils className="w-4 h-4 text-[#E0C07A]" />
                <span>Formules & Articles ({menuItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'branding'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4 text-[#E0C07A]" />
                <span>Logo & Photo Hero</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 text-[#E0C07A]" />
                <span>Catégories ({categories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'gallery'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#E0C07A]" />
                <span>Galerie Photos ({galleryItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'business'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4 text-[#E0C07A]" />
                <span>Coordonnées & WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('setup')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left whitespace-nowrap ${
                  activeTab === 'setup'
                    ? 'bg-[#1C130D] text-white border border-white/20 shadow'
                    : 'text-[#A38F82] hover:bg-[#1A120C] hover:text-white'
                }`}
              >
                <Database className="w-4 h-4 text-[#E0C07A]" />
                <span>Configuration Cloudinary & Cloud</span>
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* TAB 1: MENU ITEMS */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        Articles de la Carte & Bouton WhatsApp
                      </h3>
                      <p className="text-xs text-[#7D6658]">
                        Gérez les plats (L’express, Frenchy, Beldi, etc.), photos Cloudinary et tarifs Dh/MAD.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingMenuItem({
                          id: `item-${Date.now()}`,
                          name: '',
                          nameAr: '',
                          description: '',
                          descriptionAr: '',
                          price: null,
                          categoryId: categories[0]?.id || 'formules-petit-dejeuner',
                          imageUrl: DEFAULT_CAFE_IMAGES.espressoTerrace || '',
                          isAvailable: true,
                          isFeatured: false,
                          order: menuItems.length + 1,
                        });
                        setIsItemModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-[#2C1810] text-white hover:bg-[#3D2318] text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#C5A059]" />
                      <span>Ajouter un Article</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map((item) => {
                      const category = categories.find((c) => c.id === item.categoryId);
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-4 border border-[#EADBCE] shadow-sm flex gap-4 items-center justify-between"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#2C1810] shrink-0 border border-[#EADBCE]">
                              <SafeImage
                                src={item.imageUrl}
                                alt={item.name}
                                transformOptions={{ width: 120, height: 120, crop: 'fill' }}
                                fallbackCategory="breakfast"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-sm font-bold text-[#2C1810]">
                                  {item.name}
                                </h4>
                                {item.isFeatured && (
                                  <span className="text-[10px] text-[#8C6239] font-medium bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#EADBCE]">
                                    Signature
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-[#8E7668]">
                                {category?.name || item.categoryId}
                              </span>
                              <div className="mt-1">
                                {item.price !== null ? (
                                  <span className="text-xs font-bold text-[#2C1810] tabular-nums">
                                    {item.price} Dh / MAD
                                  </span>
                                ) : (
                                  <span className="text-[11px] italic text-[#8E7668]">
                                    Sur place (1–50 MAD)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingMenuItem({ ...item });
                                setIsItemModalOpen(true);
                              }}
                              className="p-2 text-[#5A4336] hover:text-[#2C1810] hover:bg-[#FAF7F2] rounded-lg border border-[#EADBCE] cursor-pointer"
                              title="Modifier (Photo, Nom, Prix)"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: BRANDING (LOGO & HERO IMAGE UPLOAD) */}
              {activeTab === 'branding' && (
                <form onSubmit={handleSaveBranding} className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        Logo & Photo du Hero Section (Cloudinary)
                      </h3>
                      <p className="text-xs text-[#7D6658]">
                        Téléversez le logo de دار القهوة et la grande image d'arrière-plan du Hero.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#C5A059]" />
                      <span>Enregistrer Logo & Hero</span>
                    </button>
                  </div>

                  {/* Section 1: Official Logo Upload */}
                  <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#2C1810]">
                          1. Logo Officiel de دار القهوة (The Coffee House)
                        </h4>
                        <p className="text-xs text-[#7D6658]">
                          Ce logo apparaît directement dans la barre de navigation, le pied de page et l'enseigne Hero.
                        </p>
                      </div>
                      {settingsForm.logoUrl ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Logo Actif en Ligne</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 w-fit">
                          <span>Monogramme par défaut</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                      {/* Logo Preview Container */}
                      <div className="w-28 h-28 rounded-2xl bg-[#0F0A07] border-2 border-[#C5A059] flex items-center justify-center overflow-hidden shadow-xl shrink-0 p-2.5 relative neon-cup-glow">
                        {settingsForm.logoUrl ? (
                          <img
                            src={settingsForm.logoUrl}
                            alt="Logo Prévisualisation"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-[#C5A059]">
                            <Coffee className="w-7 h-7 mx-auto mb-1 text-[#E0C07A]" />
                            <span className="font-serif text-[11px] block font-bold text-white leading-tight">دار القهوة</span>
                            <span className="text-[8px] uppercase tracking-wider block opacity-75 text-[#C5A059]">Aucun Logo</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 flex-1 w-full">
                        <div>
                          <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                            URL Directe du Logo ou téléversement fichier
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="https://res.cloudinary.com/... ou collez l'URL de votre logo"
                              value={settingsForm.logoUrl || ''}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, logoUrl: e.target.value })
                              }
                              className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyLogo(settingsForm.logoUrl || '')}
                              className="px-4 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm shrink-0"
                            >
                              Appliquer
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md border border-white/20">
                            <Upload className="w-4 h-4 text-[#C5A059]" />
                            <span>{isUploadingLogo ? 'Téléversement & Application...' : 'Téléverser le Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, setIsUploadingLogo, (url) => {
                                    handleApplyLogo(url);
                                  });
                                }
                              }}
                            />
                          </label>

                          {settingsForm.logoUrl && (
                            <button
                              type="button"
                              onClick={() => handleApplyLogo('')}
                              className="text-xs text-red-600 hover:text-red-700 underline cursor-pointer"
                            >
                              Supprimer le logo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Hero Section Photo Upload */}
                  <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#2C1810]">
                          2. Photo d'Arrière-Plan du Hero Section
                        </h4>
                        <p className="text-xs text-[#7D6658]">
                          Grande photo affichée en haut du site (terrasse, café, ambiance chaleureuse).
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                      <div className="w-40 h-24 rounded-2xl bg-[#2C1810] border border-[#C5A059]/40 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                        <img
                          src={settingsForm.heroImageUrl}
                          alt="Hero Prévisualisation"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-3 flex-1 w-full">
                        <div>
                          <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                            URL de l'Image Hero (Cloudinary / CDN)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="https://res.cloudinary.com/.../hero.jpg"
                              value={settingsForm.heroImageUrl}
                              onChange={(e) =>
                                setSettingsForm({ ...settingsForm, heroImageUrl: e.target.value })
                              }
                              className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyHeroImage(settingsForm.heroImageUrl)}
                              className="px-4 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm shrink-0"
                            >
                              Appliquer
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm">
                            <Upload className="w-4 h-4 text-[#C5A059]" />
                            <span>{isUploadingHero ? 'Téléversement...' : 'Téléverser la Photo Hero'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, setIsUploadingHero, (url) => {
                                    handleApplyHeroImage(url);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 3: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        Catégories du Menu
                      </h3>
                      <p className="text-xs text-[#7D6658]">
                        Ajoutez, renommez ou réorganisez les rubriques de votre carte.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCategory({
                          id: `cat-${Date.now()}`,
                          name: '',
                          nameAr: '',
                          order: categories.length + 1,
                          isActive: true,
                        });
                        setIsCategoryModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-[#2C1810] text-white hover:bg-[#3D2318] text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#C5A059]" />
                      <span>Ajouter une Catégorie</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white rounded-xl p-4 border border-[#EADBCE] flex items-center justify-between shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#EADBCE] flex items-center justify-center text-xs font-mono font-medium text-[#7D6658]">
                            {cat.order}
                          </span>
                          <div>
                            <strong className="text-sm font-semibold text-[#2C1810]">
                              {cat.name}
                            </strong>
                            {cat.nameAr && (
                              <span className="font-arabic text-xs text-[#8C6239] ml-2">
                                ({cat.nameAr})
                              </span>
                            )}
                            <span className="text-[11px] text-[#8E7668] ml-3">
                              ID: {cat.id}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory({ ...cat });
                              setIsCategoryModalOpen(true);
                            }}
                            className="p-2 text-[#5A4336] hover:bg-[#FAF7F2] rounded-lg border border-[#EADBCE] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        Galerie Photos
                      </h3>
                      <p className="text-xs text-[#7D6658]">
                        Gérez les visuels hébergés via Cloudinary pour le café, la terrasse et le petit-déjeuner.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingGalleryItem({
                          id: `gal-${Date.now()}`,
                          title: '',
                          titleAr: '',
                          category: 'coffee',
                          imageUrl: DEFAULT_CAFE_IMAGES.espressoTerrace,
                          caption: '',
                          order: galleryItems.length + 1,
                        });
                        setIsGalleryModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-[#2C1810] text-white hover:bg-[#3D2318] text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
                    >
                      <Plus className="w-4 h-4 text-[#C5A059]" />
                      <span>Ajouter une Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((gal) => (
                      <div
                        key={gal.id}
                        className="bg-white rounded-2xl overflow-hidden border border-[#EADBCE] shadow-sm flex flex-col"
                      >
                        <div className="h-40 bg-[#2C1810]">
                          <SafeImage
                            src={gal.imageUrl}
                            alt={gal.title}
                            transformOptions={{ width: 400, height: 300, crop: 'fill' }}
                            fallbackCategory={gal.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#8C6239] tracking-wider">
                              {gal.category}
                            </span>
                            <h4 className="font-serif text-sm font-bold text-[#2C1810] mt-0.5">
                              {gal.title}
                            </h4>
                            {gal.caption && (
                              <p className="text-xs text-[#7D6658] mt-1 line-clamp-2">
                                {gal.caption}
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-[#F0E6D8] mt-3 flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingGalleryItem({ ...gal });
                                setIsGalleryModalOpen(true);
                              }}
                              className="p-1.5 text-[#5A4336] hover:bg-[#FAF7F2] rounded-lg border border-[#EADBCE] cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteGalleryItem(gal.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BUSINESS & WHATSAPP */}
              {activeTab === 'business' && (
                <form onSubmit={handleSaveBusiness} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EADBCE]">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                        Informations, Contact & Numéro WhatsApp
                      </h3>
                      <p className="text-xs text-[#7D6658]">
                        Mettez à jour le numéro WhatsApp pour les commandes directes, la note Google et les liens.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#2C1810] hover:bg-[#3D2318] text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Save className="w-4 h-4 text-[#C5A059]" />
                      <span>Enregistrer</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Numéro WhatsApp pour Commandes (ex: +212 750-385157)
                      </label>
                      <div className="relative">
                        <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                        <input
                          type="text"
                          value={businessForm.whatsappNumber || businessForm.phone}
                          onChange={(e) =>
                            setBusinessForm({ ...businessForm, whatsappNumber: e.target.value })
                          }
                          className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Téléphone Fixe / Mobile
                      </label>
                      <input
                        type="text"
                        value={businessForm.phone}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Nom Commercial en Arabe
                      </label>
                      <input
                        type="text"
                        value={businessForm.arabicName}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, arabicName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Nom Commercial en Anglais
                      </label>
                      <input
                        type="text"
                        value={businessForm.englishName}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, englishName: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Adresse Complète
                      </label>
                      <input
                        type="text"
                        value={businessForm.address}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, address: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Google Plus Code
                      </label>
                      <input
                        type="text"
                        value={businessForm.plusCode}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, plusCode: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Fourchette de Prix
                      </label>
                      <input
                        type="text"
                        value={businessForm.priceRange}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, priceRange: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Note Google Maps (ex: 4.3)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={businessForm.googleRating}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            googleRating: parseFloat(e.target.value) || 4.3,
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Nombre d'Avis Google (ex: 41)
                      </label>
                      <input
                        type="number"
                        value={businessForm.reviewCount}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            reviewCount: parseInt(e.target.value) || 41,
                          })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Lien de Commande Glovo
                      </label>
                      <input
                        type="url"
                        value={businessForm.glovoUrl}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, glovoUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Lien Google Maps / Fiche Établissement
                      </label>
                      <input
                        type="url"
                        value={businessForm.googleMapsUrl}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, googleMapsUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Lien Profil Instagram (ex: https://www.instagram.com/thecoffeehouse.slj/)
                      </label>
                      <input
                        type="url"
                        value={businessForm.instagramUrl || ''}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, instagramUrl: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                        Horaires d'Ouverture (ex: Ouvert · Ferme à 00:00)
                      </label>
                      <input
                        type="text"
                        value={businessForm.openingHours || ''}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, openingHours: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#EADBCE] rounded-lg text-[#2C1810]"
                      />
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 6: CLOUDINARY CONFIGURATION & CLOUD SETUP */}
              {activeTab === 'setup' && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-[#EADBCE]">
                    <h3 className="font-serif text-xl font-bold text-[#2C1810]">
                      Configuration Cloudinary & Firebase
                    </h3>
                    <p className="text-xs text-[#7D6658]">
                      Configurez vos identifiants Cloudinary pour téléverser en toute sécurité vos images et synchroniser Firestore.
                    </p>
                  </div>

                  {/* Cloudinary Configuration Form */}
                  <form
                    onSubmit={handleSaveCloudinarySettings}
                    className="p-5 rounded-2xl bg-white border border-[#EADBCE] shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-[#2C1810]">
                        Paramètres de votre compte Cloudinary
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          CLOUDINARY_CONFIG.isConfigured
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {CLOUDINARY_CONFIG.isConfigured ? 'Prêt pour téléversement' : 'À configurer'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6E5546] leading-relaxed">
                      Pour permettre le téléversement direct de vos photos (Logo, Hero, Plats du menu) depuis le tableau de bord, renseignez vos identifiants Cloudinary (ou placez-les dans vos variables d’environnement) :
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                          Cloudinary Cloud Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ex: dar-al-qahwa"
                          value={cloudinaryForm.cloudName}
                          onChange={(e) =>
                            setCloudinaryForm({ ...cloudinaryForm, cloudName: e.target.value })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                          Cloudinary Upload Preset (Unsigned)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ex: dar_al_qahwa_preset"
                          value={cloudinaryForm.uploadPreset}
                          onChange={(e) =>
                            setCloudinaryForm({
                              ...cloudinaryForm,
                              uploadPreset: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-[#8E7668]">
                        Dans Cloudinary : <em>Settings &gt; Upload &gt; Upload presets (Mode: Unsigned)</em>.
                      </span>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#2C1810] hover:bg-[#3D2318] text-white text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
                      >
                        Enregistrer Cloudinary
                      </button>
                    </div>
                  </form>

                  {/* Firebase Firestore Status */}
                  <div className="p-5 rounded-2xl bg-white border border-[#EADBCE] shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#2C1810]">
                        Firebase Firestore & Authentification
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          isFirebaseConfigured
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isFirebaseConfigured ? 'Connecté à Firestore' : 'Mode Local / Démo'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E5546] leading-relaxed">
                      {isFirebaseConfigured
                        ? 'Les données sont directement synchronisées avec votre base Cloud Firestore.'
                        : 'Les modifications sont sauvegardées localement en mémoire persistante. Ajoutez vos clés Firebase dans vos variables d’environnement pour activer la synchronisation permanente.'}
                    </p>
                    {isFirebaseConfigured && (
                      <button
                        onClick={handleSeedFirestore}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F0E6D8] border border-[#EADBCE] rounded-lg text-xs font-medium text-[#2C1810] flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Synchroniser les formules vers Firestore</span>
                      </button>
                    )}
                  </div>

                  {/* Firestore Security Rules Box */}
                  <div className="p-5 rounded-2xl bg-white border border-[#EADBCE] shadow-sm space-y-3">
                    <h4 className="font-serif text-sm font-bold text-[#2C1810]">
                      Règles de Sécurité Firestore Recommandées (firestore.rules)
                    </h4>
                    <p className="text-xs text-[#7D6658]">
                      Copiez ces règles dans la console Firebase pour autoriser la lecture publique de la carte et restreindre l’écriture aux administrateurs :
                    </p>
                    <pre className="p-4 bg-[#1E130E] text-[#E8D4B0] rounded-xl text-[11px] font-mono overflow-x-auto">
                      {FIRESTORE_SECURITY_RULES}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Edit Menu Item with Cloudinary Image Upload */}
      {isItemModalOpen && editingMenuItem && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <h4 className="font-serif text-lg font-bold text-[#2C1810]">
                {editingMenuItem.name ? `Modifier : ${editingMenuItem.name}` : 'Nouvel Article'}
              </h4>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1 text-[#7D6658] hover:text-[#2C1810] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Nom de l’Article / Formule (ex: L’express, Beldi)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: L’express"
                  value={editingMenuItem.name}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Nom en Arabe
                </label>
                <input
                  type="text"
                  placeholder="ex: فطور إكسبريس"
                  value={editingMenuItem.nameAr || ''}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, nameAr: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg font-arabic text-right text-[#2C1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Catégorie
                </label>
                <select
                  value={editingMenuItem.categoryId}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Tarif en Dh / MAD (ex: 28, 42)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="ex: 28"
                  value={editingMenuItem.price !== null ? editingMenuItem.price : ''}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      price: e.target.value === '' ? null : parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={3}
                  value={editingMenuItem.description}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg text-[#2C1810]"
                />
              </div>

              {/* Cloudinary Image Input & Direct Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#5A4336]">
                  Photo du Plat / Formule (Cloudinary)
                </label>

                {/* Thumbnail Preview */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[#2C1810] overflow-hidden border border-[#EADBCE] shrink-0">
                    <SafeImage
                      src={editingMenuItem.imageUrl}
                      alt={editingMenuItem.name}
                      transformOptions={{ width: 100, height: 100, crop: 'fill' }}
                      fallbackCategory="breakfast"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="URL de l'image"
                      value={editingMenuItem.imageUrl}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, imageUrl: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                    />

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2C1810] hover:bg-[#3D2318] text-white rounded-lg text-[11px] font-semibold cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{isUploadingItem ? 'Téléversement...' : 'Téléverser photo via Cloudinary'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, setIsUploadingItem, (url) => {
                              setEditingMenuItem((prev) => (prev ? { ...prev, imageUrl: url } : null));
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-[#2C1810] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isAvailable}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        isAvailable: e.target.checked,
                      })
                    }
                    className="rounded text-[#C5A059]"
                  />
                  <span>Disponible aujourd’hui</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-[#2C1810] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingMenuItem.isFeatured}
                    onChange={(e) =>
                      setEditingMenuItem({
                        ...editingMenuItem,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="rounded text-[#C5A059]"
                  />
                  <span>Mettre en avant (Signature)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#EADBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#7D6658] hover:bg-[#FAF7F2] rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#2C1810] hover:bg-[#3D2318] rounded-lg cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Category */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <h4 className="font-serif text-lg font-bold text-[#2C1810]">
                {editingCategory.name ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}
              </h4>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#7D6658]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Nom de la Catégorie
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Nom en Arabe
                </label>
                <input
                  type="text"
                  value={editingCategory.nameAr || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, nameAr: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg font-arabic text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={editingCategory.order}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-[#EADBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#7D6658]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#2C1810] rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Gallery Item */}
      {isGalleryModalOpen && editingGalleryItem && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCE] shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADBCE] mb-4">
              <h4 className="font-serif text-lg font-bold text-[#2C1810]">
                {editingGalleryItem.title ? 'Modifier la Photo' : 'Nouvelle Photo'}
              </h4>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 text-[#7D6658]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Titre du Visuel
                </label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.title}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Catégorie Visuelle
                </label>
                <select
                  value={editingGalleryItem.category}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      category: e.target.value as 'coffee' | 'breakfast' | 'desserts' | 'ambiance',
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                >
                  <option value="coffee">Café & Barista</option>
                  <option value="breakfast">Petit-Déjeuner Beldi</option>
                  <option value="desserts">Crêpes & Douceurs</option>
                  <option value="ambiance">Ambiance & Terrasse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  URL Cloudinary / CDN
                </label>
                <input
                  type="text"
                  required
                  value={editingGalleryItem.imageUrl}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg mb-2"
                />

                <label className="flex items-center gap-2 px-3 py-2 bg-[#FAF7F2] hover:bg-[#F0E6D8] border border-[#EADBCE] rounded-lg text-xs text-[#2C1810] cursor-pointer w-fit">
                  <Upload className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    {isUploadingGallery ? 'Téléversement...' : 'Téléverser photo via Cloudinary'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, setIsUploadingGallery, (url) => {
                          setEditingGalleryItem((prev) =>
                            prev ? { ...prev, imageUrl: url } : null
                          );
                        });
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A4336] mb-1">
                  Légende
                </label>
                <input
                  type="text"
                  value={editingGalleryItem.caption || ''}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      caption: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#EADBCE] rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-[#EADBCE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#7D6658]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#2C1810] rounded-lg"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
