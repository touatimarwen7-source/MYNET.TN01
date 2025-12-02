# 🔐 Guide de Connexion Administrateur - MyNet.tn

## Accès au Compte Administrateur

### Étapes de Connexion:

1. **Allez à la page de connexion**: `https://mynet.tn/login` (ou le port local 5000)

2. **Entrez vos identifiants d'administrateur**:
   - **Email**: `admin@mynet.tn`
   - **Mot de passe**: Consultez les variables d'environnement du backend (voir `.env`)

### Identifiants par Défaut:

| Rôle             | Email               | Statut           |
| ---------------- | ------------------- | ---------------- |
| Administrateur   | `admin@mynet.tn`    | Rôle: `admin`    |
| Acheteur Test    | `buyer@mynet.tn`    | Rôle: `buyer`    |
| Fournisseur Test | `supplier@mynet.tn` | Rôle: `supplier` |

### Une Fois Connecté:

1. Vous accédez au **Tableau de Bord Administrateur** (`/admin`)
2. Menu d'administration avec accès à:
   - **Audit et Logs**: Consulter toutes les opérations
   - **Santé du Système**: Monitorer les performances
   - **Gestion des Archives**: Archiver les données anciennes
   - **Tiers d'Abonnement**: Gérer les plans de tarification
   - **Gestion des Utilisateurs**: Créer, modifier, supprimer des utilisateurs

### Accès Rapide:

- **Tous les Appels d'Offres**: `/tenders`
- **Gestion d'Équipe**: `/team-management`
- **Notifications**: `/notifications`
- **Profil**: `/profile`

### Problèmes de Connexion?

Si vous ne pouvez pas vous connecter:

1. ✅ Vérifiez que le **Backend** est en cours d'exécution
2. ✅ Vérifiez que le **Frontend** est en cours d'exécution
3. ✅ Vérifiez les identifiants dans `.env` du backend
4. ✅ Vérifiez que la base de données PostgreSQL est active

### Configuration Base de Données:

Pour initialiser un compte admin dans la base de données:

```bash
# Depuis le backend:
npm run db:seed  # Si un script seed existe
# Sinon, consulter les scripts de migration
```

---

**MyNet.tn - Plateforme Tunisienne de Marchés Publics** 🇹🇳
