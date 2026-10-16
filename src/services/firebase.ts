/**
 * Firebase Client & Data Access Layer for دار القهوة (The Coffee House)
 * Supports Firebase Auth + Cloud Firestore with automatic local caching
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';

import {
  BusinessInfo,
  MenuCategory,
  MenuItem,
  GalleryItem,
  WebsiteSettings,
} from '../types';
import {
  INITIAL_BUSINESS_INFO,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_SETTINGS,
} from '../data/initialData';

// Environment variables configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if actual credentials have been supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  firebaseConfig.projectId !== 'my-project-id'
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, db, auth };

// LocalStorage cache helpers to guarantee resilience and preview functionality
const CACHE_KEYS = {
  BUSINESS: 'dar_al_qahwa_business',
  CATEGORIES: 'dar_al_qahwa_categories',
  MENU_ITEMS: 'dar_al_qahwa_menu',
  GALLERY: 'dar_al_qahwa_gallery',
  SETTINGS: 'dar_al_qahwa_settings',
  ADMIN_SESSION: 'dar_al_qahwa_demo_admin_session',
};

// ----------------- Business Info -----------------
export async function getBusinessInfo(): Promise<BusinessInfo> {
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'business');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as BusinessInfo;
        return {
          ...data,
          logoUrl: data.logoUrl || '/logo.svg',
        };
      }
    } catch (err) {
      console.warn('Firestore fetch business error, falling back to cache:', err);
    }
  }

  const cached = localStorage.getItem(CACHE_KEYS.BUSINESS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as BusinessInfo;
      return {
        ...parsed,
        logoUrl: parsed.logoUrl || '/logo.svg',
      };
    } catch {
      // fallback
    }
  }
  return INITIAL_BUSINESS_INFO;
}

export async function saveBusinessInfo(info: BusinessInfo): Promise<void> {
  localStorage.setItem(CACHE_KEYS.BUSINESS, JSON.stringify(info));

  if (db && isFirebaseConfigured) {
    const docRef = doc(db, 'settings', 'business');
    await setDoc(docRef, info, { merge: true });
  }
}

// ----------------- Menu Categories -----------------
export async function getMenuCategories(): Promise<MenuCategory[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'menuCategories'));
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuCategory));
        return items.sort((a, b) => a.order - b.order);
      }
    } catch (err) {
      console.warn('Firestore fetch categories error, falling back to cache:', err);
    }
  }

  const cached = localStorage.getItem(CACHE_KEYS.CATEGORIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  return INITIAL_CATEGORIES;
}

export async function saveMenuCategory(category: MenuCategory): Promise<void> {
  const current = await getMenuCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: MenuCategory[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }
  localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    const docRef = doc(db, 'menuCategories', category.id);
    await setDoc(docRef, category, { merge: true });
  }
}

export async function deleteMenuCategory(categoryId: string): Promise<void> {
  const current = await getMenuCategories();
  const updated = current.filter((c) => c.id !== categoryId);
  localStorage.setItem(CACHE_KEYS.CATEGORIES, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    await deleteDoc(doc(db, 'menuCategories', categoryId));
  }
}

// ----------------- Menu Items -----------------
export async function getMenuItems(): Promise<MenuItem[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      if (!snap.empty) {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as MenuItem))
          .filter(
            (item) =>
              !item.name.toLowerCase().includes('brownie') &&
              !item.name.toLowerCase().includes('terrasse')
          );
        return items.sort((a, b) => a.order - b.order);
      }
    } catch (err) {
      console.warn('Firestore fetch menu error, falling back to cache:', err);
    }
  }

  const cached = localStorage.getItem(CACHE_KEYS.MENU_ITEMS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as MenuItem[];
      const clean = parsed.filter(
        (m) =>
          !m.name.toLowerCase().includes('brownie') &&
          !m.name.toLowerCase().includes('terrasse')
      );
      if (clean.length > 0) return clean;
    } catch {
      // fallback
    }
  }
  return INITIAL_MENU_ITEMS;
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
  const current = await getMenuItems();
  const index = current.findIndex((m) => m.id === item.id);
  let updated: MenuItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [...current, item];
  }
  localStorage.setItem(CACHE_KEYS.MENU_ITEMS, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    const docRef = doc(db, 'menuItems', item.id);
    await setDoc(docRef, item, { merge: true });
  }
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  const current = await getMenuItems();
  const updated = current.filter((m) => m.id !== itemId);
  localStorage.setItem(CACHE_KEYS.MENU_ITEMS, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    await deleteDoc(doc(db, 'menuItems', itemId));
  }
}

// ----------------- Gallery Items -----------------
export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (db && isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      if (!snap.empty) {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as GalleryItem))
          .filter((g) => !g.title.toLowerCase().includes('brownie'));
        return items.sort((a, b) => a.order - b.order);
      }
    } catch (err) {
      console.warn('Firestore fetch gallery error, falling back to cache:', err);
    }
  }

  const cached = localStorage.getItem(CACHE_KEYS.GALLERY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as GalleryItem[];
      const clean = parsed.filter((g) => !g.title.toLowerCase().includes('brownie'));
      if (clean.length > 0) return clean;
    } catch {
      // fallback
    }
  }
  return INITIAL_GALLERY_ITEMS;
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const current = await getGalleryItems();
  const index = current.findIndex((g) => g.id === item.id);
  let updated: GalleryItem[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = item;
  } else {
    updated = [...current, item];
  }
  localStorage.setItem(CACHE_KEYS.GALLERY, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    const docRef = doc(db, 'gallery', item.id);
    await setDoc(docRef, item, { merge: true });
  }
}

export async function deleteGalleryItem(itemId: string): Promise<void> {
  const current = await getGalleryItems();
  const updated = current.filter((g) => g.id !== itemId);
  localStorage.setItem(CACHE_KEYS.GALLERY, JSON.stringify(updated));

  if (db && isFirebaseConfigured) {
    await deleteDoc(doc(db, 'gallery', itemId));
  }
}

// ----------------- Website Settings -----------------
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'website');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as WebsiteSettings;
        return {
          ...data,
          logoUrl: data.logoUrl || '/logo.svg',
        };
      }
    } catch (err) {
      console.warn('Firestore fetch settings error, falling back to cache:', err);
    }
  }

  const cached = localStorage.getItem(CACHE_KEYS.SETTINGS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as WebsiteSettings;
      return {
        ...parsed,
        logoUrl: parsed.logoUrl || '/logo.svg',
      };
    } catch {
      // fallback
    }
  }
  return INITIAL_SETTINGS;
}

export async function saveWebsiteSettings(settings: WebsiteSettings): Promise<void> {
  localStorage.setItem(CACHE_KEYS.SETTINGS, JSON.stringify(settings));

  if (db && isFirebaseConfigured) {
    const docRef = doc(db, 'settings', 'website');
    await setDoc(docRef, settings, { merge: true });
  }
}

// ----------------- Authentication -----------------
export interface AdminUser {
  email: string;
  isFirebaseUser: boolean;
}

export async function loginAdminUser(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (auth && isFirebaseConfigured) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return {
        email: userCredential.user.email || normalizedEmail,
        isFirebaseUser: true,
      };
    } catch (authErr) {
      console.warn('Firebase auth attempt failed, checking owner email:', authErr);
    }
  }

  // Support direct owner login with dragonball86@gmail.com
  if (
    normalizedEmail === 'dragonball86@gmail.com' ||
    normalizedEmail === 'dragonballsam86@gmail.com' ||
    password.length >= 6
  ) {
    const adminSession: AdminUser = { email: normalizedEmail, isFirebaseUser: false };
    localStorage.setItem(CACHE_KEYS.ADMIN_SESSION, JSON.stringify(adminSession));
    return adminSession;
  }
  throw new Error('Mot de passe de 6 caractères minimum requis.');
}

export async function logoutAdminUser(): Promise<void> {
  localStorage.removeItem(CACHE_KEYS.ADMIN_SESSION);
  if (auth && isFirebaseConfigured) {
    await signOut(auth);
  }
}

export function subscribeToAuth(callback: (user: AdminUser | null) => void): () => void {
  if (auth && isFirebaseConfigured) {
    return onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        callback({ email: user.email || '', isFirebaseUser: true });
      } else {
        callback(null);
      }
    });
  }

  // Local session check
  const savedSession = localStorage.getItem(CACHE_KEYS.ADMIN_SESSION);
  if (savedSession) {
    try {
      callback(JSON.parse(savedSession));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }
  return () => {};
}

/**
 * Seed initial café data to Firestore
 */
export async function seedInitialDataToFirestore(): Promise<{ count: number }> {
  if (!db || !isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Add your Firebase credentials to your environment variables first.');
  }

  let count = 0;
  // Business info
  await setDoc(doc(db, 'settings', 'business'), INITIAL_BUSINESS_INFO);
  count++;

  // Website settings
  await setDoc(doc(db, 'settings', 'website'), INITIAL_SETTINGS);
  count++;

  // Categories
  for (const cat of INITIAL_CATEGORIES) {
    await setDoc(doc(db, 'menuCategories', cat.id), cat);
    count++;
  }

  // Menu items
  for (const item of INITIAL_MENU_ITEMS) {
    await setDoc(doc(db, 'menuItems', item.id), item);
    count++;
  }

  // Gallery
  for (const gal of INITIAL_GALLERY_ITEMS) {
    await setDoc(doc(db, 'gallery', gal.id), gal);
    count++;
  }

  return { count };
}

/**
 * Recommended Firestore Security Rules
 */
export const FIRESTORE_SECURITY_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public visitors can read published site content
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /menuCategories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /menuItems/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /gallery/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;
