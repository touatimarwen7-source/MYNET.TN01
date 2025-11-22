# MyNet.tn - B2B Procurement Platform
## Système de Conception Institutionnel

**Date Mise à Jour**: 22 Novembre 2025  
**Statut**: Phase 1 - 2 Complétée | Phase 3 En Cours  
**Version du Thème**: 1.0 (Institutionnel Unifié)

---

## 🎯 Vue d'Ensemble du Projet

**Objectif Principal**: Plateforme B2B moderne avec thème institutionnel unifié  
**Framework**: React + Material-UI (MUI v5)  
**Architecture**: Frontend (Vite) + Backend (Node.js)

### Décisions Clés
- ✅ **Material-UI Exclusif**: Tous les composants via MUI uniquement
- ✅ **Thème Centralisé**: `frontend/src/theme/theme.js` - source unique de vérité
- ✅ **Design Plat**: 0 ombres (box-shadow: none), 0 gradients
- ✅ **Couleurs Fixes**: #0056B3 (bleu), #F9F9F9 (fond), #212121 (texte)
- ✅ **Espacement Grille**: 8px base (multiples: 8, 16, 24, 32px)
- ✅ **Border Radius**: 4px partout (uniforme)

---

## 🎨 Système de Couleurs Institutionnel

### Palette Principale
```
PRIMARY: #0056B3 (Bleu Professionnel)
├─ Light: #1976d2 (pour backgrounds, hovers)
├─ Dark: #003d7a (pour interactions, texte sombre)
└─ Contrast: #FFFFFF

SECONDARY: #616161 (Gris Standard)
├─ Light: #9e9e9e
├─ Dark: #424242
└─ Contrast: #FFFFFF

BACKGROUND:
├─ Default: #F9F9F9 (Page background - épuré)
├─ Paper: #FFFFFF (Cards, Dialogs, Components)
└─ Hover: #f5f5f5

TEXT:
├─ Primary: #212121 (Corps de texte)
├─ Secondary: #616161 (Texte secondaire, labels)
├─ Disabled: #9e9e9e (Éléments inactifs)
└─ Dividers: #E0E0E0

STATES:
├─ Success: #2e7d32 (Vert)
├─ Warning: #f57c00 (Orange)
├─ Error: #c62828 (Rouge)
└─ Info: #0288d1 (Bleu Clair)
```

### Utilisation Obligatoire
- ✅ Tous les boutons actifs: **#0056B3** (primary)
- ✅ Tous les hovers boutons: **#003d7a** (dark primary)
- ✅ Tous les backgrounds cartes: **#FFFFFF** ou **#f5f5f5**
- ✅ Tous les textes: **#212121** (primary) ou **#616161** (secondary)
- ✅ Tous les borders: **#E0E0E0** (divider)
- ⛔ **JAMAIS** #1565c0 (ancien bleu - supprimé)
- ⛔ **JAMAIS** d'autres palettes de couleurs

---

## 📐 Typographie Standardisée

### Fonte: Roboto (système)
```
Headings:
├─ h1: 32px | 600 weight | 1.4 line-height
├─ h2: 28px | 600 weight | 1.4 line-height
├─ h3: 24px | 600 weight | 1.4 line-height
├─ h4: 20px | 600 weight | 1.5 line-height
├─ h5: 16px | 500 weight | 1.5 line-height
└─ h6: 14px | 500 weight | 1.5 line-height

Body:
├─ body1: 14px | 400 weight | 1.6 line-height (standard)
├─ body2: 13px | 400 weight | 1.6 line-height (secondary)
├─ button: 14px | 500 weight | 1.5 line-height
└─ caption: 12px | 400 weight | 1.4 line-height

Couleurs:
├─ heading: #212121 (noir standard)
├─ body: #212121 (noir standard)
├─ secondary: #616161 (gris)
└─ caption: #9e9e9e (gris clair)
```

---

## 🎯 Espacement et Grille

### Base: 8px
```
8px  = xs (compact)
16px = sm (standard)
24px = md (normal)
32px = lg (large)
40px = xl (extra large)
```

### MUI Spacing Utility
```jsx
spacing(1)  // 8px
spacing(2)  // 16px
spacing(3)  // 24px
spacing(4)  // 32px
```

### Composants Standards
- **Button Padding**: 10px vertical | 20px horizontal (minimum 40px height)
- **Card Padding**: 24px (ou 16px compact)
- **Input Height**: 40px (avec 12px vertical padding)
- **Table Cell Padding**: 16px (standard)
- **Container Padding**: 24px (desktop) | 16px (mobile)

---

## 🎨 Design Plat - Règles Obligatoires

### Ombres (ZÉRO)
```
✅ ALL: boxShadow: 'none'
❌ JAMAIS: box-shadow avec px values
❌ JAMAIS: elevation, shadows, z-depth
```

### Gradients (ZÉRO)
```
✅ Couleurs solides uniquement
❌ JAMAIS: linear-gradient, radial-gradient
❌ JAMAIS: background images (sauf très rare)
```

### Border Radius (4px PARTOUT)
```
✅ Boutons: 4px
✅ Cards: 4px
✅ Inputs: 4px
✅ Dialogs: 4px
✅ Chips: 4px
✅ Tabs: 4px (top only)
```

### Borders (Minimaliste)
```
✅ Cards: 1px solid #E0E0E0
✅ Inputs (inactive): 1px solid #E0E0E0
✅ Inputs (focus): 2px solid #0056B3
✅ Dividers: 1px solid #E0E0E0
```

---

## 🔧 Composants MUI Configurés

### Composants Surchargés (30+)
1. **MuiButton**: Flat, #0056B3 primary, 40px min-height
2. **MuiCard**: No shadow, border: 1px solid #E0E0E0
3. **MuiPaper**: No shadow, white background
4. **MuiTextField**: Outlined, white background, #0056B3 focus
5. **MuiTable**: Header gris, texte bleu, no shadows
6. **MuiAlert**: Border only, no shadows, background clair
7. **MuiDialog**: Border #E0E0E0, no shadows
8. **MuiAppBar**: No shadow, border bottom #E0E0E0
9. **MuiChip**: 4px radius, outlined par défaut
10. **MuiCheckbox/Radio**: Blue #0056B3 when checked
11. **MuiLinearProgress**: 4px height, blue gradient
12. **MuiAvatar**: Blue background #0056B3
13. **MuiListItem**: Hover #f5f5f5, selected #e3f2fd
14. **Et 17 autres composants MUI...**

---

## 📋 Structure des Fichiers

```
frontend/
├── src/
│   ├── theme/
│   │   ├── theme.js (590+ lignes - THÈME CENTRAL)
│   │   └── [autres fichiers thème = SUPPRIMÉS]
│   ├── components/
│   │   ├── Sidebar.jsx (utilise #0056B3)
│   │   ├── UnifiedHeader.jsx (utilise #0056B3)
│   │   ├── ToastNotification.jsx
│   │   └── [autres...]
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── [autres...]
│   ├── App.jsx (ThemeProvider + institutionalTheme)
│   ├── index.css (reset minimal)
│   └── [autres fichiers]
└── package.json (+ dépendances MUI)
```

---

## ✅ Checklist Phase 1 - COMPLÉTÉE

- [x] Créer theme.js complet (590+ lignes)
- [x] Configurer 30+ composants MUI
- [x] Définir palette couleurs institutionnelle
- [x] Définir typographie Roboto
- [x] Configurer espacement 8px
- [x] Implémenter design plat (box-shadow: none)
- [x] Mettre à jour App.jsx (ThemeProvider)
- [x] Supprimer emptyTheme.js
- [x] Build SUCCESS (12.30s)

---

## ⏳ Checklist Phase 2 - COMPLÉTÉE

- [x] Remplacer 164 × #1565c0 → #0056B3
- [x] Remplacer box-shadows → none
- [x] Mettre à jour Sidebar (#0056B3)
- [x] Mettre à jour UnifiedHeader (#0056B3)
- [x] Vérifier tous les composants MUI
- [x] Build SUCCESS (12.30s)
- [x] Frontend RUNNING ✅

---

## 🔄 Checklist Phase 3 - EN COURS

- [ ] Tester pages principales (Login, Dashboard, TenderList)
- [ ] Vérifier cohérence couleurs (0% #1565c0)
- [ ] Vérifier box-shadows (0% ombres visibles)
- [ ] Vérifier gradients (0% dégradés)
- [ ] Vérifier espacement (multiples 8px)
- [ ] Test responsif mobile/tablet
- [ ] Performance & bundle size
- [ ] Build production final
- [ ] Documentation finale

---

## 🚀 Recommandations Futures

### Améliorations Possibles
1. **Code Splitting**: Réduire bundle size (actuellement 770.93 KB)
2. **Grid v2 Migration**: Mettre à jour vers MUI Grid v2 (deprecation warning)
3. **React Router v7**: Migrer vers React Router v7 (future flags)
4. **Dark Mode**: Implémenter thème sombre (si nécessaire)
5. **RTL Support**: Support complet droite-à-gauche (arabe)

### Maintenance du Thème
- ✅ **SEULE SOURCE**: Modifications via `theme.js` UNIQUEMENT
- ⛔ **JAMAIS** modifier colors dans les composants (sx={} sauf espacing)
- ⛔ **JAMAIS** ajouter CSS custom en dehors du thème
- ✅ **VERSIONNER**: Incrémenter version thème à chaque changement majeur

---

## 📞 Références Utiles

- Theme Central: `frontend/src/theme/theme.js`
- MUI Documentation: https://mui.com/material-ui/getting-started/
- Palette Color Hex: #0056B3 | #F9F9F9 | #212121
- Spacing Unit: 8px (base)
- Border Radius: 4px (uniform)

---

**Last Updated**: 22 Nov 2025 | **By**: Replit Agent | **Status**: Phase 1-2 Complete ✅
