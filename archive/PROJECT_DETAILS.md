# Portfolio Abdenour Hellas — Documentation Complète

> Dernière mise à jour : 2026-07-01  
> Domaine de production : https://abdenour-hellas.online  
> Repository GitHub : https://github.com/Abdenourhe/portfolio-abdenour-hellas.git

---

## 1. Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16.2.7 (App Router) |
| Langage | TypeScript 5 |
| UI | React 19.2.4 |
| Styling | Tailwind CSS v4 |
| ORM / Base de données | Prisma 5.22.0 + PostgreSQL |
| Authentification | NextAuth.js 4.24.14 (Credentials / JWT) |
| i18n | Système i18n personnalisé (fr / en / ar) |
| Animations | Framer Motion 12.40.0 |
| Icônes | Lucide React 1.17.0 |
| Email | SendGrid (@sendgrid/mail) |
| Génération PDF | html2pdf.js (navigateur) + script Node.js avec Edge/Chrome headless |
| Validation | Zod 4.4.3 |
| Hashage mots de passe | bcryptjs 3.0.3 |
| QR Code | qrcode 1.5.4 |

**Dev dependencies :** ESLint 9 + eslint-config-next, ts-node, TypeScript, plugin PostCSS Tailwind v4.

---

## 2. Structure du Projet

```
C:\Users\heabd\OneDrive\Desktop\projet\mon port-folio
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   └── seed.ts             # Script de seed avec données par défaut
├── public/
│   ├── cv/
│   │   ├── Abdenour_Hellas_CV.pdf
│   │   └── cv-print.html   # Source HTML statique pour le PDF headless
│   └── uploads/            # Images uploadées (si local)
├── scripts/
│   └── generate-cv-pdf.js  # Générateur PDF via navigateur headless
├── src/
│   ├── app/
│   │   ├── [locale]/       # Routes publiques i18n (fr/en/ar)
│   │   ├── admin/          # Pages du tableau de bord admin
│   │   ├── api/            # Routes API Next.js
│   ├── hooks/              # Hooks React personnalisés
│   │   └── useLocale.ts    # Hook de gestion de la locale
│   │   ├── globals.css     # Tokens CSS + thèmes light/dark
│   │   ├── layout.tsx      # Layout racine
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── admin/          # Composants UI admin
│   │   ├── public/         # Composants publics + sections
│   │   └── ui/             # (vide actuellement)
│   ├── hooks/              # (vide actuellement)
│   ├── i18n/
│   │   ├── config.ts
│   │   └── messages/
│   │       ├── ar.json
│   │       ├── en.json
│   │       └── fr.json
│   ├── lib/
│   │   ├── auth.ts         # Options NextAuth
│   │   ├── email.ts        # Helpers SendGrid
│   │   ├── prisma.ts       # Singleton PrismaClient
│   │   └── utils.ts        # Helper cn()
│   └── types/
│       ├── html2pdf.d.ts
│       └── index.ts        # Interfaces TypeScript partagées
├── .env                    # Variables d'environnement (secrets)
├── components.json         # Configuration shadcn/ui
├── eslint.config.mjs
├── middleware.ts           # Locale + protection admin
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 3. Schéma de Base de Données (Prisma)

**Datasource :** PostgreSQL via `DATABASE_URL`.

### Enums

| Enum | Valeurs |
|------|---------|
| `Role` | `ADMIN` |
| `EducationType` | `DEGREE` \| `CERTIFICATE` \| `DIPLOMA` |

### Modèles

| Modèle | Description | Champs clés |
|--------|-------------|-------------|
| `User` | Authentification admin | `id` (CUID), `email` (unique), `name`, `password`, `role`, `createdAt`, `updatedAt` |
| `Profile` | Profil public unique | `fullName`, `title`, `titleEn`, `titleAr`, `email`, `phone`, `location`, `bio`, `bioEn`, `bioAr`, `photoUrl`, `cvUrl`, `cvFileName`, réseaux sociaux |
| `Experience` | Expériences professionnelles | `title`, `company`, `location`, `startDate`, `endDate`, `current`, `description`, `url`, `certificateImage`, `category`, `order` |
| `Education` | Formation académique | `degree`, `type` (enum), `school`, `location`, dates, `url`, `certificateImage`, `order` |
| `Skill` | Compétences avec niveaux | `name`, `category`, `level` (0-100), `icon` (nom Lucide), `order` |
| `Project` | Projets du portfolio | `title`, `description`, `technologies` (string[]), `category`, `imageUrl`, `githubUrl`, `demoUrl`, `featured`, `order` |
| `Interest` | Centres d'intérêt | `name`, `icon`, `order` |
| `Testimonial` | Témoignages | `name`, `role`, `company`, `content`, `imageUrl`, `order` |
| `Article` | Articles de blog | `title`, `slug` (unique), `excerpt`, `content`, `imageUrl`, `published`, timestamps |
| `Message` | Messages du formulaire de contact | `name`, `email`, `subject`, `content`, `read`, `reply`, `createdAt` |
| `Stat` | Compteurs d'analytics | `type` (ex: `visit`, `cv_download`), `value`, `ipAddress`, `userAgent`, `date` |

**Notes :** Les modèles sont largement indépendants (pas de clés étrangères explicites). `Profile` est une entité single-row (`findFirst`). L'API `homepage` sépare l'éducation en diplômes et certifications via le champ `type`.

---

## 4. Routes API

| Route | Méthodes | Description |
|-------|----------|-------------|
| `/api/homepage` | GET | Agrège profil, expériences, éducation (diplômes), certifications, compétences, projets, témoignages, articles, intérêts |
| `/api/profile` | GET | Retourne le profil unique |
| `/api/profile` | PUT | Met à jour/crée le profil (admin uniquement) |
| `/api/experiences` | GET/POST/PUT/DELETE | CRUD des expériences |
| `/api/education` | GET/POST/PUT/DELETE | CRUD de l'éducation |
| `/api/skills` | GET/POST/PUT/DELETE | CRUD des compétences |
| `/api/skills/category` | PUT | Renommage en masse d'une catégorie de compétences |
| `/api/projects` | GET/POST/PUT/DELETE | CRUD des projets |
| `/api/articles` | GET/POST/PUT/DELETE | CRUD articles + recherche par slug (`?slug=...`) + filtre published |
| `/api/testimonials` | GET/POST/PUT/DELETE | CRUD des témoignages |
| `/api/messages` | POST | Soumission publique du formulaire de contact |
| `/api/messages` | GET/PUT/DELETE | Gestion de la boîte de réception admin (PUT gère `read` et `reply`) |
| `/api/stats` | GET | Compteurs du dashboard admin |
| `/api/stats` | POST | Enregistre un événement stat (public, ex: téléchargement CV) |
| `/api/admin/setup` | GET | Crée/met à jour l'admin avec `NEXTAUTH_SECRET` |
| `/api/admin/account` | GET/PUT | Récupère l'admin courant / change le mot de passe |
| `/api/auth/[...nextauth]` | GET/POST | Handler NextAuth |

Toutes les routes mutantes (sauf contact/stats) utilisent `getServerSession(authOptions)` pour la protection.

---

## 5. Pages Principales (App Router)

Les routes sont regroupées sous `[locale]` où `locale ∈ {fr, en, ar}`. La racine `/` redirige de façon permanente vers `/fr`.

| Page | Chemin | Fonctionnalités |
|------|--------|-----------------|
| Accueil | `/[locale]` | Hero avec typewriter animé, stats, sections expérience/formation/compétences/projets/témoignages/blog, CTA |
| À propos | `/[locale]/about` | Photo de profil, bio i18n, coordonnées, grille d'intérêts |
| CV | `/[locale]/cv` | Aperçu interactif du CV avec `CVPrintTemplate`, boutons télécharger & imprimer |
| Formation | `/[locale]/education` | Section `EducationSection` en pleine page |
| Expérience | `/[locale]/experience` | Timeline `ExperienceSection` en pleine page |
| Compétences | `/[locale]/skills` | `SkillsSection` groupée par catégorie |
| Projets | `/[locale]/projects` | `ProjectsSection` avec filtres de catégories |
| Témoignages | `/[locale]/testimonials` | Carrousel `TestimonialsSection` |
| Blog | `/[locale]/blog` | Grille `BlogSection` des articles publiés |
| Article | `/[locale]/blog/[slug]` | Vue d'un article avec date, image, extrait, contenu |
| Contact | `/[locale]/contact` | Coordonnées, réseaux sociaux, formulaire de contact validé (Zod) |
| 404 | `/[locale]/not-found.tsx` | Page 404 localisée |

---

## 6. Tableau de Bord Admin

Chemin de base : `/admin` (protégé par middleware + NextAuth).

| Page | Fonctionnalités |
|------|-----------------|
| `/admin/login` | Formulaire de connexion par credentials |
| `/admin/dashboard` | Cartes de stats : visites, téléchargements CV, messages total, messages non lus |
| `/admin/profile` | Édition du profil, upload photo & CV en base64, correcteur orthographique |
| `/admin/experiences` | Ajout/édition/suppression d'expériences, dates, URL/image de certificat |
| `/admin/education` | Ajout/édition/suppression de formations, sélecteur de type, certificat |
| `/admin/skills` | Ajout/édition/suppression de compétences, catégorisation, renommage de catégories |
| `/admin/projects` | Ajout/édition/suppression de projets, mise en avant, tableau de technologies |
| `/admin/testimonials` | Ajout/édition/suppression de témoignages |
| `/admin/articles` | Ajout/édition/suppression d'articles, brouillon/publié, gestion des slugs |
| `/admin/messages` | Marquer lu/non lu, répondre, supprimer ; envoi des réponses via SendGrid |
| `/admin/settings` | Liens sociaux + changement de mot de passe |
| `/admin/cv-print` | Aperçu du CV (modes écran/print), génération PDF avec `html2pdf.js` |

Le layout admin (`src/app/admin/layout.tsx`) affiche `AdminSidebar` uniquement si une session existe.

---

## 7. Système d'Authentification

- **Provider :** NextAuth.js avec `CredentialsProvider`.
- **Flux :** Vérification email + mot de passe contre la table `User` avec `bcrypt.compare`.
- **Session :** Stratégie JWT ; rôle attaché au token et à la session via callbacks.
- **Secret :** `NEXTAUTH_SECRET`.
- **Middleware :** Vérifie les cookies `next-auth.session-token` / `__Secure-next-auth.session-token` ; redirige les utilisateurs non authentifiés de `/admin/*` vers `/admin/login`, et les utilisateurs authentifiés loin de la page login.
- **Seed :** `prisma/seed.ts` crée l'admin avec mot de passe hashé.

---

## 8. Internationalisation (i18n)

- **Config :** `src/i18n/config.ts` définit `locales = ["fr", "en", "ar"]`, `defaultLocale = "fr"`.
- **Messages :** Fichiers JSON dans `src/i18n/messages/{fr,en,ar}.json` avec clés imbriquées (`nav`, `hero`, `about`, `experience`, etc.).
- **Provider :** `I18nProvider` personnalisé (`src/components/public/I18nProvider.tsx`) fournit le contexte de messages et expose `useT()` pour la traduction par chemin de clés.
- **Détection locale :** `middleware.ts` utilise le cookie `locale`, puis l'en-tête `Accept-Language`, puis la locale par défaut.
- **Direction :** L'arabe (`ar`) applique `dir="rtl"` sur le wrapper de layout ; CSS adapte les polices RTL.
- **Changement de langue :** `LanguageSwitcher` remplace le segment locale dans le pathname courant.
- **Static params :** `generateStaticParams` pré-rend `fr`, `en`, `ar`.
- **Metadata :** `generateMetadata` retourne titres/descriptions localisés et liens alternatifs par langue.

---

## 9. Approche de Styling

- **Tailwind CSS v4** avec plugin PostCSS.
- **Tokens de design** définis comme variables CSS dans `src/app/globals.css` (background, foreground, primary `#1E3A5F`, secondary `#C9A962`, muted, destructive, etc.) pour les thèmes clair et `.dark`.
- **Thèmes :** `ThemeProvider` personnalisé bascule la classe `.dark` sur `documentElement`, persiste dans `localStorage`, respecte `prefers-color-scheme`.
- **Typographie :** Google Fonts via `next/font/google` : Inter, Comfortaa, Playfair Display, Amiri (arabe).
- **Style des composants :** Composants majoritairement construits à la main ; `src/components/ui/` est actuellement vide. `components.json` configure quand même les alias shadcn.
- **Effets visuels :** Curseur personnalisé, toile de fond blueprint animée, bordures électriques de cartes, halos, boutons magnétiques, machine à écrire, barre de progression au scroll.
- **Utilitaires :** `cn()` dans `src/lib/utils.ts` fusionne `clsx` + `tailwind-merge`.

---

## 10. Commandes de Build, Dev & Déploiement

| Commande | Usage |
|----------|-------|
| `npm run dev` | Lancer le serveur de développement Next.js |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Lancer ESLint |
| `npm run generate:cv` | Exécuter `scripts/generate-cv-pdf.js` (navigateur headless) |
| `npm run postinstall` | `prisma generate` (lancé automatiquement à l'installation) |
| `npx prisma db seed` | Seeder la base de données (`ts-node prisma/seed.ts`) |

**Cible de déploiement :** Vercel (domaine `https://abdenour-hellas.online`).

---

## 11. Variables d'Environnement (noms uniquement)

| Variable | Usage |
|----------|-------|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL |
| `NEXTAUTH_SECRET` | Secret JWT NextAuth ; aussi utilisé pour l'authentification de la route setup |
| `ADMIN_EMAIL` | Email par défaut de l'admin |
| `ADMIN_PASSWORD` | Mot de passe par défaut de l'admin |
| `SENDGRID_API_KEY` | Clé API SendGrid pour emails transactionnels |
| `FROM_EMAIL` | Adresse d'envoi SendGrid |
| `NODE_ENV` | Environnement Node standard |

---

## 12. Système de Génération PDF

Il existe **deux flux PDF** :

### 12.1 Côté navigateur (admin & page publique CV)
- Composant : `CVPrintTemplate.tsx`
- Librairie : `html2pdf.js`
- Déclenché dans `/admin/cv-print` et la vue imprimable de `/[locale]/cv`.
- Rend un composant React de taille fixe A4 (210 mm × 297 mm) avec profil, expériences, formation, compétences (groupées), langues, projets, certifications.
- Options : A4 portrait, échelle 2x, fond blanc.

### 12.2 Script headless
- `scripts/generate-cv-pdf.js`
- Détecte Microsoft Edge ou Google Chrome, puis exécute :
  ```bash
  <browser> --headless --disable-gpu --no-pdf-header-footer \
    --run-all-compositor-stages-before-draw --virtual-time-budget=20000 \
    --print-to-pdf="public/cv/Abdenour_Hellas_CV.pdf" \
    "file:///.../public/cv/cv-print.html"
  ```
- Sortie : `public/cv/Abdenour_Hellas_CV.pdf`.

Le fichier statique `public/cv/cv-print.html` est un CV HTML autonome utilisé par le script.

---

## 13. Composants Clés

### Layout / Coquille publique
- `Header.tsx` — Navigation sticky, menu mobile, toggle thème, switcher de langue.
- `Footer.tsx` — Copyright, liens sociaux, lien admin.
- `ThemeProvider.tsx` — Contexte light/dark.
- `I18nProvider.tsx` + `useT()` — Contexte de traduction.
- `useLocale.ts` (dans `src/hooks/`) — Lit `params.locale` et construit les chemins localisés.
- `LanguageSwitcher.tsx` — Change de locale en réécrivant le segment du pathname.
- `NetworkCanvas.tsx` (anciennement `BlueprintBackground.tsx`) — Toile de fond avec réseau de particules.
- `CustomCursor.tsx` — Curseur personnalisé Framer Motion (desktop).
- `ReadingProgress.tsx` — Barre de progression de scroll en haut.

### Effets visuels
- `ElectricCard.tsx` — Bordure SVG animée en pointillés sur les cartes.
- `ElectricHalo.tsx` — Anneaux rotatifs/pulsants autour de la photo de profil.
- `MagneticButton.tsx` — Boutons qui suivent la souris au survol.
- `TypeWriter.tsx` — Animation d'écriture avec curseur clignotant.
- `OscilloscopeWave.tsx` — Séparateur en vague animée.
- `AnimatedSection.tsx` — Wrappers fade-up déclenchés au scroll.

### Sections de contenu
- `ExperienceSection.tsx` — Timeline avec lightbox d'images/certificats.
- `EducationSection.tsx` — Grille de cartes avec support certificats.
- `SkillsSection.tsx` — Barres de compétences groupées avec largeurs animées.
- `ProjectsSection.tsx` — Grille de projets filtrable avec projets mis en avant.
- `TestimonialsSection.tsx` — Carrousel horizontal avec flèches/points.
- `BlogSection.tsx` — Grille d'articles.

### Partagés
- `SocialIcons.tsx` — Icônes LinkedIn, GitHub, Twitter/X, Facebook, Instagram, WhatsApp.
- `Skeleton.tsx` / `SkeletonList` / `SkeletonCard` — Placeholders de chargement.
- `SectionHeader.tsx` — Titres de section cohérents.
- `ImageLightbox.tsx` — Visionneuse d'image plein écran.

### Admin
- `AdminSidebar.tsx` — Tiroir de navigation du dashboard.
- `SpellCheck.tsx` — Intègre l'API publique LanguageTool pour la relecture inline des formulaires.

### CV
- `CVPrintTemplate.tsx` — CV React format A4 utilisé à l'affichage et à l'export PDF.

---

## 14. Configurations Notables

### `next.config.ts`
- Redirection permanente de `/` vers `/fr`.
- `images.unoptimized: true` et hostname remote wildcard (`**`) pour autoriser n'importe quelle image externe.
- `experimental.serverActions.bodySizeLimit: "10mb"` pour supporter les uploads base64.

### `middleware.ts`
- Ignore les routes API et les assets statiques.
- Applique le préfixe de locale et persiste le cookie.
- Protège les routes admin via vérification du cookie de session.

### `tsconfig.json`
- Alias de chemin `@/*` → `./src/*`.

### `eslint.config.mjs`
- Utilise `eslint-config-next/core-web-vitals` et `eslint-config-next/typescript`.

### `robots.ts`
- Interdit `/admin` et `/api` ; sitemap à `https://abdenour-hellas.online/sitemap.xml`.

### `sitemap.ts`
- Génère dynamiquement le sitemap pour 3 locales × 10 routes + articles publiés.

---

## 15. Historique Récent (branche main)

Les derniers commits ont principalement concerné l'affinage du layout et de l'espacement du CV pour qu'il tienne sur une seule page A4 tout en restant professionnel.

---

## 16. Points de Vigilance / Maintenance

- Le fichier `public/cv/cv-print.html` est un **duplicata statique** du design du CV. Après toute modification de `CVPrintTemplate.tsx`, pensez à mettre à jour `cv-print.html` et à régénérer le PDF avec `npm run generate:cv`.
- Le seed (`prisma/seed.ts`) utilise `upsert` avec `update: {}` pour le profil : une fois le profil créé en production, le seed ne mettra pas à jour les champs existants. Utilisez l'admin `/admin/profile` pour modifier le profil, ou un script one-off.
- Les constantes par défaut de la page d'accueil sont centralisées dans `src/lib/homepageDefaults.ts`.
- Les uploads d'images en base64 peuvent alourdir la base PostgreSQL ; surveillez la taille des colonnes `photoUrl`, `cvUrl`, `certificateImage`, `imageUrl`.
- Le middleware protège `/admin/*` côté edge, mais chaque route API mutante vérifie également la session côté serveur.
