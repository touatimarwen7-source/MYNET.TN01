#!/bin/bash

# Fix Profile.jsx comprehensively
sed -i 's/Modifier les Données/Modifier votre Profil/g' pages/Profile.jsx
sed -i 's/Annuler l'"'"'Opération/Annuler/g' pages/Profile.jsx
sed -i 's/Supprimer l'"'"'Élément/Supprimer/g' pages/Profile.jsx
sed -i 's/Domaines de Spécialisation/Domaines d'"'"'Intérêt Professionnel/g' pages/Profile.jsx

# Fix SupplierProfile.jsx 
sed -i 's/Profil Professionnel du Fournisseur/Profil Professionnel/g' pages/SupplierProfile.jsx
sed -i 's/📋 Historique d'"'"'Activité/📋 Journal d'"'"'Activité/g' pages/SupplierProfile.jsx
sed -i 's/Aucun domaine de spécialisation défini/Aucun domaine défini/g' pages/SupplierProfile.jsx

# Update all remaining pages and components
sed -i 's/Accueil/Accueil Professionnel/g' pages/Dashboard.jsx 2>/dev/null
sed -i 's/Recherche Rapide/Recherche Avancée/g' components/*.jsx 2>/dev/null
sed -i 's/À Propos/À Propos de MyNet.tn/g' pages/*.jsx 2>/dev/null
sed -i 's/Aide/Centre d'"'"'Aide/g' components/*.jsx 2>/dev/null
sed -i 's/Déconnexion/Se Déconnecter/g' components/*.jsx 2>/dev/null

echo "✓ All formal improvements applied"
