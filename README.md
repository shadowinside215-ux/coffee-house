# دار القهوة — The Coffee House

Site web officiel et panneau d'administration pour **دار القهوة (The Coffee House)**, café & salon de thé situé à Sala Al Jadida, Maroc.

---

## 1. Informations Officielles de l'Établissement

- **Nom en Arabe :** دار القهوة
- **Nom en Anglais :** The Coffee House
- **Catégorie :** Café / Coffee House
- **Adresse :** 4 Résidence Belle Vue 3, Magasin 21, Sala Al Jadida 11100, Maroc
- **Téléphone :** [+212 750-385157](tel:+212750385157)
- **Google Maps Plus Code :** `X7W6+GJ, Sala Al Jadida`
- **Fourchette de prix :** 1–50 MAD par personne
- **Note Google :** 4.3/5 sur 41 avis vérifiés
- **Services :** Sur place (Dine-in) & Terrasse extérieure
- **Plateforme de commande :** Glovo
- **Lien officiel :** [https://taplink.cc](https://taplink.cc)
- **Spécialités phares :** Crêpe Brownie, Café Espresso en Terrasse, Msemen, Harcha, Petit-déjeuner Beldi & Omelettes.

---

## 2. Architecture Technique

- **Frontend :** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Google Fonts (Amiri, Playfair Display, Plus Jakarta Sans).
- **Backend & Données :** Cloud Firestore (collections `settings`, `menuCategories`, `menuItems`, `gallery`) & Firebase Authentication.
- **Médias & Visuels :** Cloudinary CDN avec transformations automatiques (`f_auto,q_auto,w_...`), lazy loading et conteneurs de secours stylisés.
- **SEO & Référencement :** Balises OpenGraph, Twitter Cards et données structurées Schema.org JSON-LD `CafeOrCoffeeShop`.
- **Hébergement :** Prêt pour Vercel avec fichier de routage `vercel.json`.

---

## 3. Guide de Configuration Firebase

Pour activer la synchronisation permanente dans le Cloud et l'authentification multi-appareils :

1. Rendez-vous sur la [Console Firebase](https://console.firebase.google.com/) et créez un projet (ex: `dar-al-qahwa`).
2. Ajoutez une application Web et copiez les clés de configuration.
3. Dans **Build > Firestore Database**, cliquez sur **Create database** (mode production).
4. Dans l'onglet **Rules**, collez les règles de sécurité suivantes et publiez :
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
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
   }
   ```
5. Dans **Build > Authentication**, activez le fournisseur **Email/Password** et créez le compte administrateur du café.
6. Renseignez les variables dans votre fichier `.env` ou sur Vercel :
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_FIREBASE_PROJECT_ID="..."
   VITE_FIREBASE_STORAGE_BUCKET="..."
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."
   ```

---

## 4. Guide de Configuration Cloudinary

1. Créez un compte gratuit sur [Cloudinary](https://cloudinary.com/).
2. Récupérez votre **Cloud Name** depuis le tableau de bord.
3. Allez dans **Settings > Upload > Upload presets**, cliquez sur **Add upload preset**, définissez le Signing Mode sur **Unsigned** et nommez-le (ex: `dar_al_qahwa_preset`).
4. Ajoutez ces variables d'environnement :
   ```env
   VITE_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
   VITE_CLOUDINARY_UPLOAD_PRESET="dar_al_qahwa_preset"
   ```

---

## 5. Déploiement sur Vercel

1. Poussez le dépôt Git sur GitHub ou GitLab.
2. Connectez-vous sur [Vercel](https://vercel.com) et cliquez sur **Add New > Project**.
3. Importez le dépôt et nommez le projet `dar-al-qahwa`.
4. Dans la section **Environment Variables**, ajoutez les variables Firebase et Cloudinary.
5. Cliquez sur **Deploy**. Le build Vite génère le dossier `dist` et `vercel.json` gère automatiquement la réécriture des URLs.
