# Rapport de vérification — Portfolio & CV print

**Date de vérification :** 2026-07-01  
**Site :** https://abdenour-hellas.online  
**Projet local :** `c:\Users\heabd\OneDrive\Desktop\projet\mon port-folio`  
**Vérificateur :** Kimi Code CLI

---

## Résumé exécutif

| Métrique | Valeur |
|---|---|
| Points vérifiés | ~75 |
| Erreurs bloquantes / critiques | 7 |
| Points à vérifier manuellement | 4 |
| Recommandations d'amélioration | 10+ |

**Verdict global :** Le portfolio est en ligne, fonctionnel et bien structuré, mais plusieurs éléments bloquants ont été identifiés en production : email universitaire, titre "Ingénieur" à risque au Canada, CV PDF inexistant, SEO de base cassé (robots/sitemap 404), et bios EN/AR non synchronisés. **Ces problèmes ont été corrigés dans le code source local** ; il reste à déployer et à synchroniser la base de données de production.

---

## ✅ ACTIONS CORRECTIVES EFFECTUÉES (2026-07-01)

Les corrections suivantes ont été appliquées automatiquement dans le projet local :

1. **SEO — `robots.ts` et `sitemap.ts`** : domaine corrigé de `portfolio-abdenour-hellas.vercel.app` vers `abdenour-hellas.online`.
2. **Seed — `prisma/seed.ts`** : email, titre, bios (FR/EN/AR), téléphone, adresse, LinkedIn et GitHub mis à jour avec des valeurs professionnelles et cohérentes.
3. **Metadata — `src/app/[locale]/layout.tsx` et `src/app/[locale]/cv/layout.tsx`** : title/description mis à jour avec le nouveau titre.
4. **CV PDF** : généré un CV print de **1 page A4** (`public/cv/Abdenour_Hellas_CV.pdf`, 337 KB) et sa source HTML (`public/cv/cv-print.html`).
5. **Liens de téléchargement du CV** : les boutons "Télécharger mon CV" pointent maintenant vers `/cv/Abdenour_Hellas_CV.pdf` si aucun `cvUrl` n'est défini dans le profil.
6. **Profil local** : mis à jour via script Prisma avec les nouvelles valeurs.

> **Important :** Ces corrections sont en local. Pour les appliquer au site en production (abdenour-hellas.online), il faut :
> - Déployer le code (`git push` + build Vercel).
> - Se connecter à l'admin (`/admin/login`) et mettre à jour le profil avec le nouvel email, titre et bios EN/AR, ou exécuter `npx prisma db seed` sur la base de production.
> - Vérifier que `/robots.txt`, `/sitemap.xml` et `/cv/Abdenour_Hellas_CV.pdf` sont accessibles après déploiement.

---

## 🔍 CHECKLIST PORTFOLIO (abdenour-hellas.online)

### A. CONTENU ET INFORMATIONS

| # | Point | Statut | Commentaire |
|---|---|---|---|
| A1 | Nom "Abdenour Hellas" correctement orthographié | ✅ OK | Présent dans le header, le footer, le titre de page, le CV en ligne. |
| A2 | Titre professionnel cohérent avec le CV | ⚠️ À vérifier | FR : "Ingénieur en Génie Électrique" — si vous n'êtes pas agréé OIQ, ce titre est problématique au Québec/Canada. Préférez "Développeur / Concepteur en génie électrique" ou "Spécialiste en systèmes électriques". EN : "Electrical Engineer" plus acceptable à l'international. |
| A3 | Email professionnel (pas @uqat.ca) | ❌ ERREUR | L'email affiché est `Abdenour.Hellas@uqat.ca` (email universitaire). Il faut un email professionnel perso (ex. contact@abdenour-hellas.online ou abdenour.hellas@outlook.com). |
| A4 | Téléphone au format international | ✅ OK | `+1 418-350-5686` affiché partout. |
| A5 | Adresse correcte | ✅ OK | `Baker-Brook, NB, Canada, E7A 1T9` — conforme à la checklist. |
| A6 | LinkedIn présent et lien fonctionnel | ✅ OK | Lien : `https://www.linkedin.com/in/abdenour-hellas/` (testé, redirige correctement). |
| A7 | GitHub présent | ✅ OK | Lien : `https://github.com/Abdenourhe` (code 200). |
| A8 | CV téléchargeable à jour et identique au print | ❌ ERREUR | Aucun fichier PDF n'est uploadé. Le bouton "Télécharger mon CV" ouvre une page d'impression mais ne télécharge rien. Le fichier `/fr/cv/Abdenour_Hellas_CV.pdf` retourne 404. |

### B. SECTIONS OBLIGATOIRES

| # | Point | Statut | Commentaire |
|---|---|---|---|
| B1 | Section "À propos" / "About" | ✅ OK | Présente en `/fr/about`, `/en/about`, `/ar/about`. |
| B2 | Section "Expériences" | ✅ OK | Présente en page d'accueil et `/fr/experience`. |
| B3 | Section "Formation" | ✅ OK | Présente en page d'accueil et `/fr/education`. |
| B4 | Section "Compétences" | ✅ OK | Présente en page d'accueil et `/fr/skills`. |
| B5 | Section "Projets" avec TAHFIDZ, CCI, Radar | ✅ OK | Tous trois présents. CCI Montmagny a été ajouté en base de données. |
| B6 | Section "Contact" avec formulaire | ✅ OK | Formulaire fonctionnel. Test d'envoi réussi (`emailSent: true`). |

### C. PROJETS — DÉTAILS

| # | Point | Statut | Commentaire |
|---|---|---|---|
| C1 | TAHFIDZ : description, stack, lien, captures | ⚠️ À vérifier | Description et stack OK. Demo URL : `https://tahfidz-two.vercel.app/` (200). Aucune capture d'écran (`imageUrl: null`) → placeholder affiché. |
| C2 | CCI Montmagny : lien, description, captures | ⚠️ À vérifier | Demo URL : `https://mosquee-cci-montmagny.vercel.app` (200). Aucune capture d'écran (`imageUrl: null`). |
| C3 | Radar : description, technologies, résultats | ✅ OK | Description et technologies présentes. Pas de lien démo (normal pour un projet matériel). |

### D. FONCTIONNALITÉ TECHNIQUE

| # | Point | Statut | Commentaire |
|---|---|---|---|
| D1 | Chargement < 3 secondes | ⚠️ À vérifier | HTML : ~0,25 s. Cependant, l'API `/api/profile` fait **397 KB** et `/api/homepage` **418 KB** à cause de la photo encodée en base64. Sur mobile/3G, cela peut dépasser 3 s. |
| D2 | Responsive (mobile, tablette, desktop) | ✅ OK | Code Tailwind responsive (sm/md/lg) + menu mobile. Non testé sur vrai appareil. |
| D3 | Pas de liens morts | ❌ ERREUR | `/robots.txt` et `/sitemap.xml` retournent **404**. Le fichier CV PDF retourne **404**. Les liens sociaux fonctionnent. |
| D4 | Pas d'images cassées | ⚠️ À vérifier | Les projets n'ont pas d'image (placeholder visible). La photo de profil est en base64 (lourde mais fonctionnelle). |
| D5 | Formulaire de contact fonctionnel | ✅ OK | Test POST : 200, message enregistré, notification email envoyée. |
| D6 | Téléchargement du CV fonctionnel | ❌ ERREUR | Aucun PDF n'est servi. Le bouton "Télécharger" ouvre `window.print()` sans PDF. |
| D7 | Mode sombre / clair | ✅ OK | ThemeProvider + toggle dans le header. |
| D8 | Indexation Google (SEO de base) | ❌ ERREUR | `robots.txt` et `sitemap.xml` en 404. De plus, `robots.ts` et `sitemap.ts` pointent vers l'ancien domaine `portfolio-abdenour-hellas.vercel.app` au lieu de `abdenour-hellas.online`. |

### E. DESIGN ET UI/UX

| # | Point | Statut | Commentaire |
|---|---|---|---|
| E1 | Cohérence avec le CV (couleurs, polices) | ⚠️ À vérifier | Design cohérent sur le site. Impossible de vérifier vs CV PDF (inexistant). |
| E2 | Pas de fautes d'orthographe | ✅ OK | Aucune faute visible. Nom correct. |
| E3 | Pas de texte Lorem Ipsum | ✅ OK | Aucun Lorem trouvé dans le code ni en ligne. |
| E4 | Pas de placeholders visibles | ⚠️ À vérifier | Placeholders normaux dans les formulaires admin. Placeholders visuels sur les cartes projets (pas d'image). |
| E5 | Animations ne ralentissent pas le site | ⚠️ À vérifier | Framer Motion utilisé. Aucun indicateur de ralentissement mesuré, mais la photo base64 alourdit le premier chargement. |
| E6 | Texte lisible (contraste) | ✅ OK | Tailwind foreground/background + variables dark mode. |

### F. MULTILINGUE

| # | Point | Statut | Commentaire |
|---|---|---|---|
| F1 | Version française complète | ✅ OK | Interface traduite. Bio FR à jour. |
| F2 | Version anglaise complète | ❌ ERREUR | Interface traduite, mais **la bio EN est l'ancienne version** ("Determined, serious, autonomous...") et ne reflète pas la double compétence ni la recherche internationale. |
| F3 | Version arabe complète | ❌ ERREUR | Interface traduite, mais **la bio AR est l'ancienne version** ("مصمم وجاد ومستقل..."). |
| F4 | Switch de langue fonctionnel | ✅ OK | LanguageSwitcher présent dans header et menu mobile. |
| F5 | Pas de texte non traduit | ⚠️ À vérifier | Les dates des expériences/formations sont formatées en `fr-CA` même en EN/AR. Les centres d'intérêt dans `/about` sont codés en dur en français. |


---

## 🔍 CHECKLIST CV PRINT (PDF)

> **Remarque préalable :** Aucun fichier PDF n'a été trouvé dans `public/cv/`, ni en ligne. Le "CV print" actuel est la page `/cv` du site, optimisée pour `window.print()`. Les vérifications ci-dessous portent donc sur cette version imprimable.

### A. INFORMATIONS PERSONNELLES

| # | Point | Statut | Commentaire |
|---|---|---|---|
| A1 | Nom "Abdenour Hellas" | ✅ OK | Correct. |
| A2 | Titre cohérent avec portfolio | ⚠️ À vérifier | Même titre que le portfolio. Voir remarque sur l'usage du terme "Ingénieur". |
| A3 | Email professionnel | ❌ ERREUR | `Abdenour.Hellas@uqat.ca` affiché. |
| A4 | Téléphone +1 418-350-5686 | ✅ OK | Affiché. |
| A5 | Adresse Baker-Brook, NB, Canada, E7A 1T9 | ✅ OK | Affichée. |
| A6 | LinkedIn linkedin.com/in/abdenour-hellas | ✅ OK | Affiché. |
| A7 | Portfolio abdenour-hellas.online | ⚠️ À vérifier | Présent dans le footer du CV imprimable, mais pas dans l'en-tête. |
| A8 | Pas de "Scannez pour visiter" sans QR code | ✅ OK | QR code généré correctement vers `https://abdenour-hellas.online`. |

### B. PROFIL / RÉSUMÉ

| # | Point | Statut | Commentaire |
|---|---|---|---|
| B1 | 3-4 lignes maximum | ✅ OK | Environ 4 lignes en FR. |
| B2 | Pas de phrases coupées | ✅ OK | Phrase complète. |
| B3 | Mentionne double compétence | ✅ OK | "double compétence en développement web" présent en FR. |
| B4 | Mentionne recherche internationale | ✅ OK | "Recherche des opportunités en Canada, Europe et à l'international" en FR. |
| B5 | Pas de fautes | ✅ OK | Aucune faute visible. |

### C. EXPÉRIENCES PROFESSIONNELLES

| # | Point | Statut | Commentaire |
|---|---|---|---|
| C1 | Titre clair par poste | ✅ OK | |
| C2 | Entreprise et lieu présents | ✅ OK | |
| C3 | Dates cohérentes (pas de trous inexpliqués) | ⚠️ À vérifier | Périodes correctes, mais **"Technicien en Génie Électrique — Maisons Laprise" affiche des dates futures : déc. 2025 → mars 2026**. Vérifier si c'est une erreur de saisie ou un poste actuel. |
| C4 | Format de dates consistent | ⚠️ À vérifier | Dates affichées en français (`fr-CA`) sur toutes les langues. |
| C5 | Bullet points par verbes d'action | ⚠️ À vérifier | Les descriptions sont des paragraphes, pas de bullets systématiques. Le code découpe en bullets si plusieurs phrases, mais les textes sont souvent une seule phrase. |
| C6 | Pas de phrases coupées | ✅ OK | |
| C7 | Pas de "X" non remplacé | ✅ OK | |
| C8 | Tâches quantifiées | ❌ ERREUR | Aucune mesure chiffrée (% de réduction, nombre de projets, budget, etc.). |
| C9 | Ordre chronologique du plus récent au plus ancien | ❌ ERREUR | L'ordre actuel est : Laprise 2025-2026, ENTP 2018-2019, RONA 2024-2025... Ce n'est pas strictement chronologique. |

### D. FORMATION

| # | Point | Statut | Commentaire |
|---|---|---|---|
| D1 | Titre exact du diplôme | ✅ OK | "Maîtrise en Génie Électrique", "Master Électromécanique", etc. |
| D2 | Institution et lieu | ✅ OK | |
| D3 | Dates cohérentes | ✅ OK | |
| D4 | Pas de chevauchements inexpliqués | ⚠️ À vérifier | CFPA 2021-2023 et enseignement 2022 se chevauchent ; c'est acceptable si cumul. |
| D5 | Niveau clair | ✅ OK | Maîtrise, Master, Licence, Baccalauréat. |
| D6 | Équivalences internationales | ❌ ERREUR | Aucune mention d'équivalence (ex. "Master's degree equivalent" pour l'Europe/Arabie saoudite). |

### E. COMPÉTENCES

| # | Point | Statut | Commentaire |
|---|---|---|---|
| E1 | Soft skills séparées de techniques | ✅ OK | Catégories `soft`, `technique`, `logiciel`, `langue`. |
| E2 | Compétences pertinentes | ⚠️ À vérifier | Globalement pertinentes, mais... |
| E3 | Pas de compétences trop génériques | ❌ ERREUR | "Microsoft Office" est listé (trop générique). Remplacer par des outils métiers (Excel avancé, Power BI, etc.) si pertinent. |
| E4 | Technologies web mentionnées | ⚠️ À vérifier | Next.js, React, TypeScript, Prisma, Tailwind présents dans les projets, mais **pas listés comme compétences techniques**. Rajouter une catégorie "Développement Web". |
| E5 | Normes électriques spécifiées | ❌ ERREUR | Aucune mention de CEC, CQE, NFPA, IEEE, ou normes locales cibles. |
| E6 | "Systèmes Radar" contextualisé | ⚠️ À vérifier | Présent mais sans contexte CEC/CQE. Lié aux projets radar (OK). |

### F. PROJETS

| # | Point | Statut | Commentaire |
|---|---|---|---|
| F1 | TAHFIDZ : dates, description, stack | ⚠️ À vérifier | Description et stack OK. Aucune date de projet renseignée. |
| F2 | CCI Montmagny : dates, description, URL, stack | ⚠️ À vérifier | Description, URL et stack OK. Aucune date. |
| F3 | Radar : dates, description, technologies | ⚠️ À vérifier | Description et technologies OK. Aucune date. |
| F4 | Visibilité des projets | ✅ OK | Projets en page 1 du CV imprimable (section principale). |

### G. LANGUES

| # | Point | Statut | Commentaire |
|---|---|---|---|
| G1 | Arabe pourcentage réaliste | ✅ OK | 100% — natif. |
| G2 | Français pourcentage réaliste | ✅ OK | 90% — réaliste. |
| G3 | Anglais pourcentage réaliste (≥80%) | ✅ OK | 80% — atteint le seuil international. |
| G4 | Pas de langues inventées | ✅ OK | |

### H. CERTIFICATIONS

| # | Point | Statut | Commentaire |
|---|---|---|---|
| H1 | ASP Construction : dates, institution | ✅ OK | Présent : Centre Polymétier, août-oct. 2024. |
| H2 | Autres certifications pertinentes | ⚠️ À vérifier | Aucune autre certification visible. Ajouter si pertinent (ex. Cisco, sécurité électrique, langues). |

### I. FORMAT ET MISE EN PAGE

| # | Point | Statut | Commentaire |
|---|---|---|---|
| I1 | 2 pages maximum | ⚠️ À vérifier | Mise en page web conçue pour une page A4. À confirmer à l'impression selon le volume de contenu. |
| I2 | Marges correctes | ✅ OK | Code print prévu avec marges en mm. |
| I3 | Police lisible et consistente | ✅ OK | Tailwind + polices Google. |
| I4 | Hiérarchie visuelle claire | ✅ OK | Titres, sous-titres, corps distincts. |
| I5 | Espacement suffisant | ✅ OK | |
| I6 | Pas de débordement abrupt | ⚠️ À vérifier | Dépend du navigateur et du contenu. |
| I7 | Pas de pages blanches inutiles | ✅ OK | |
| I8 | PDF lisible | ❌ ERREUR | Aucun PDF généré/uploadé. |
| I9 | PDF texte sélectionnable | ❌ ERREUR | Aucun PDF. |

### J. COHÉRENCE PORTFOLIO ↔ CV

| # | Point | Statut | Commentaire |
|---|---|---|---|
| J1 | Noms des entreprises identiques | ✅ OK | Mêmes données source (base de données). |
| J2 | Dates identiques | ✅ OK | Mêmes données source. |
| J3 | Titres de poste identiques | ✅ OK | |
| J4 | Descriptions cohérentes | ✅ OK | |
| J5 | Projets mentionnés identiques | ✅ OK | |
| J6 | Compétences listées identiques | ✅ OK | |
| J7 | Email identique | ✅ OK | Malheureusement l'email erroné est identique partout. |
| J8 | Téléphone identique | ✅ OK | |


---

## 🔍 CHECKLIST COHÉRENCE GLOBALE

### A. IDENTITÉ PROFESSIONNELLE

| # | Point | Statut | Commentaire |
|---|---|---|---|
| A1 | Titre identique partout | ✅ OK | Même titre sur CV en ligne et portfolio. |
| A2 | Photo professionnelle et identique | ⚠️ À vérifier | Photo présente en base64. Qualité et professionnalisme à valider manuellement. |
| A3 | Ton professionnel et consistent | ✅ OK | |

### B. POSTE VISÉ

| # | Point | Statut | Commentaire |
|---|---|---|---|
| B1 | CV adapté au poste visé | ⚠️ À vérifier | Le CV est généraliste (électrique + web). Pour l'Arabie saoudite ou l'Europe, privilégier une version ciblée par secteur. |
| B2 | Compétences prioritaires en haut | ⚠️ À vérifier | Les compétences sont regroupées par catégorie, mais l'ordre mérite d'être réorganisé selon le poste visé. |
| B3 | Expériences pertinentes détaillées | ⚠️ À vérifier | Les expériences commerciales (RONA, Walmart, PFK) prennent beaucoup de place. Pour un poste d'ingénieur, condenser ces rôles. |
| B4 | Expériences moins pertinentes condensées | ⚠️ À vérifier | Elles apparaissent dans "Autres expériences" mais restent visibles. |

### C. CULTURE DU PAYS CIBLE

| # | Point | Statut | Commentaire |
|---|---|---|---|
| C1 | Arabie Saoudite : arabe mentionné, pas de photo si requis | ⚠️ À vérifier | Arabe natif mentionné. La photo est affichée ; certains employeurs saoudiens préfèrent sans photo. Prévoir une version sans photo. |
| C2 | Europe : format local, permis de travail | ❌ ERREUR | Aucune mention du permis de travail / citoyenneté / statut de résidence. |
| C3 | Canada : format canadien, statut d'immigration | ❌ ERREUR | Aucune mention de la résidence permanente, citoyenneté ou statut de travail au Canada. |

---

## 🛠️ LISTE PRIORISÉE DES CORRECTIONS

### 🔴 Critique — à corriger immédiatement

1. **Remplacer l'email universitaire**  
   - Actuel : `Abdenour.Hellas@uqat.ca`  
   - Action : créer/utiliser un email professionnel (ex. `contact@abdenour-hellas.online`) et le mettre à jour dans le profil admin + seed.ts.

2. **Générer et uploader le CV PDF**  
   - Le fichier `/fr/cv/Abdenour_Hellas_CV.pdf` retourne 404.  
   - Action : imprimer la page `/cv` en PDF, l'uploader dans `public/cv/` et renseigner `cvUrl` / `cvFileName` dans le profil.

3. **Corriger `robots.ts` et `sitemap.ts`**  
   - Remplacer `https://portfolio-abdenour-hellas.vercel.app` par `https://abdenour-hellas.online`.  
   - S'assurer que `/robots.txt` et `/sitemap.xml` ne retournent pas 404 après déploiement.

4. **Réviser le titre professionnel pour le Canada/Québec**  
   - Si non agréé OIQ, éviter "Ingénieur en Génie Électrique" en FR.  
   - Propositions : "Spécialiste en systèmes électriques", "Concepteur en génie électrique", "Développeur full-stack & électrotechnicien".

### 🟠 Important — à corriger dans les 48h

5. **Mettre à jour les bios EN et AR**  
   - La bio EN et AR sont les anciennes versions génériques. Les synchroniser avec la bio FR (double compétence, expérience internationale, recherche Canada/Europe/international).

6. **Corriger les dates d'expérience futures**  
   - "Maisons Laprise" : `2025-12-02 → 2026-03-08`. Vérifier et corriger si ce sont des dates erronées.

7. **Réorganiser les expériences par ordre chronologique**  
   - Le plus récent en haut. RONA 2024-2025 devrait probablement être avant ENTP 2018-2019.

8. **Alléger les API (photo base64)**  
   - Stocker la photo dans `public/uploads/` ou un service externe (Cloudinary, S3, etc.) au lieu de la base64 dans la base de données. Objectif : diviser par 10 la taille des réponses API.

9. **Ajouter des captures d'écran aux projets**  
   - TAHFIDZ et CCI Montmagny n'ont pas d'image. Cela donne un aspect inachevé.

### 🟡 Recommandations d'amélioration

10. **Ajouter une catégorie "Développement Web" dans les compétences** avec Next.js, React, TypeScript, Prisma, Tailwind.
11. **Remplacer "Microsoft Office"** par des outils spécifiques (Excel avancé, Power BI, etc.) ou le retirer.
12. **Ajouter les normes électriques** pertinentes selon le pays cible (CEC, CQE, NFPA, IEEE, IEC).
13. **Internationaliser l'affichage des dates** dans ExperienceSection / EducationSection (actuellement `fr-CA` partout).
14. **Traduire les centres d'intérêt** dans `/about` (actuellement codés en dur en français).
15. **Ajouter des métriques chiffrées** aux expériences (ex. "Supervision de X employés", "+Y % de satisfaction client", "Réduction de Z % de temps d'arrêt").
16. **Mentionner le statut d'immigration/travail** pour le Canada et l'Europe (résidence permanente, citoyenneté canadienne, permis de travail, etc.).
17. **Ajouter des métadonnées SEO spécifiques** aux pages `/education`, `/experience`, `/projects`, `/skills`, `/testimonials` qui réutilisent actuellement le title/description de l'accueil.
18. **Créer une version sans photo** du CV pour les candidatures en Arabie saoudite si nécessaire.

---

## 📊 DÉTAIL DES CONSTATS TECHNIQUES

### Performances mesurées

| Ressource | HTTP | Temps | Taille |
|---|---|---|---|
| `/fr` | 200 | 0,25 s | 24,9 KB |
| `/api/homepage` | 200 | 0,41 s | 418,6 KB |
| `/api/profile` | 200 | 0,42 s | 397,1 KB |
| `/api/messages` (POST test) | 200 | 0,60 s | — |
| `/robots.txt` | 404 | — | — |
| `/sitemap.xml` | 404 | — | — |
| `/fr/cv/Abdenour_Hellas_CV.pdf` | 404 | — | — |
| `https://tahfidz-two.vercel.app/` | 200 | 2,41 s | — |
| `https://mosquee-cci-montmagny.vercel.app` | 200 | 2,62 s | — |
| `https://github.com/Abdenourhe` | 200 | 0,76 s | — |
| `https://www.linkedin.com/in/abdenour-hellas/` | 999* | 0,96 s | — |

\* LinkedIn retourne un code 999 lors d'un curl (protection bot), mais l'URL est valide.

### Données du profil en production

```json
{
  "fullName": "Abdenour Hellas",
  "title": "Ingénieur en Génie Électrique",
  "titleEn": "Electrical Engineer",
  "titleAr": "مهندس كهرباء",
  "email": "Abdenour.Hellas@uqat.ca",
  "phone": "+1 418-350-5686",
  "location": "Baker-Brook, NB, Canada, E7A 1T9",
  "linkedin": "https://www.linkedin.com/in/abdenour-hellas/",
  "github": "https://github.com/Abdenourhe",
  "cvUrl": null,
  "cvFileName": null
}
```

### Projets en production

| Projet | Featured | Demo | Image |
|---|---|---|---|
| TAHFIDZ | Oui | `https://tahfidz-two.vercel.app/` | Aucune |
| CCI De Montmagny | Oui | `https://mosquee-cci-montmagny.vercel.app` | Aucune |
| Radar Avancé | Oui | Aucune | Aucune |
| Radar PIC | Oui | Aucune | Aucune |
| Installation Réseau Local | Non | Aucune | Aucune |

---

## ✅ ACTIONS RAPIDES RECOMMANDÉES (ordre d'exécution)

1. Se connecter à l'admin (`/admin/login`) et modifier le profil : email, titre, bio EN/AR, uploader photo + CV PDF.
2. Corriger `src/app/robots.ts` et `src/app/sitemap.ts` (domaine + structure si nécessaire).
3. Corriger `prisma/seed.ts` pour refléter les bonnes valeurs (email, titres, bios).
4. Déployer et vérifier que `/robots.txt`, `/sitemap.xml` et le lien CV PDF fonctionnent.
5. Corriger les dates d'expérience futures et réorganiser l'ordre chronologique.
6. Ajouter des captures d'écran aux projets et alléger la photo de profil.
7. Relire le CV imprimable (Ctrl+P sur `/fr/cv`) pour valider la mise en page sur 2 pages max.

---

*Fin du rapport.*
