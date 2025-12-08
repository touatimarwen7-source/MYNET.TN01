
# Guide de Validation Middleware - MyNet.tn

## Vue d'ensemble

Ce guide explique comment utiliser le système de validation middleware pour sécuriser les routes backend.

## Middleware Disponibles

### 1. validationMiddleware
**Fichier**: `backend/middleware/validationMiddleware.js`

**Utilisation**:
```javascript
const { validationMiddleware } = require('../middleware/validationMiddleware');

router.use(validationMiddleware);
```

**Fonction**: Sanitise automatiquement toutes les entrées (body, query, params)

### 2. validateIdMiddleware
**Fichier**: `backend/middleware/validateIdMiddleware.js`

**Utilisation**:
```javascript
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

router.get('/users/:id', validateIdMiddleware('id'), handler);
router.get('/tenders/:tenderId/offers/:offerId', 
  validateIdMiddleware(['tenderId', 'offerId']), 
  handler
);
```

**Fonction**: Valide les paramètres d'ID (UUID ou numérique)

### 3. endpointValidators
**Fichier**: `backend/middleware/endpointValidators.js`

**Utilisation**:
```javascript
const { authValidators, procurementValidators } = require('../middleware/endpointValidators');

router.post('/login', (req, res) => {
  const error = authValidators.validateLoginRequest(req.body);
  if (error) return res.status(400).json(error);
  // Continue processing
});
```

**Fonction**: Validation spécifique par type de requête

## Bonnes Pratiques

1. **Appliquer validationMiddleware globalement**:
```javascript
router.use(validationMiddleware);
```

2. **Valider les IDs sur les routes paramétrées**:
```javascript
router.get('/:id', validateIdMiddleware('id'), handler);
```

3. **Utiliser les validators spécifiques dans les controllers**:
```javascript
const error = procurementValidators.validateTenderCreation(req.body);
if (error) return res.status(400).json(error);
```

4. **Toujours sanitiser avant de valider**:
Le validationMiddleware sanitise automatiquement, mais vous pouvez aussi utiliser:
```javascript
const { sanitizers } = require('../middleware/validationMiddleware');
const cleanEmail = sanitizers.normalizeEmail(email);
```

## Routes à Protéger

### Routes Critiques
- Toutes les routes admin (`/api/admin/*`)
- Routes d'authentification (`/api/auth/*`)
- Routes de paiement (`/api/payments/*`)

### Routes Paramétrées
- `/api/tenders/:id`
- `/api/offers/:id`
- `/api/users/:id`
- Toute route avec des paramètres d'ID

## Exemples Complets

### Route Admin Sécurisée
```javascript
const express = require('express');
const router = express.Router();
const { validationMiddleware } = require('../middleware/validationMiddleware');
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Apply validation to all routes
router.use(validationMiddleware);

// Protected route with ID validation
router.get('/users/:id', 
  authMiddleware.verifyToken,
  authMiddleware.checkRole(['admin']),
  validateIdMiddleware('id'),
  async (req, res) => {
    // req.params.id is validated and sanitized
    const user = await getUserById(req.params.id);
    res.json(user);
  }
);
```

### Validation de Formulaire
```javascript
const { procurementValidators } = require('../middleware/endpointValidators');

router.post('/tenders', async (req, res) => {
  // Validate tender data
  const error = procurementValidators.validateTenderCreation(req.body);
  if (error) {
    return res.status(400).json(error);
  }
  
  // Data is valid, proceed
  const tender = await createTender(req.body);
  res.status(201).json(tender);
});
```

## Checklist de Sécurité

- [ ] validationMiddleware appliqué globalement
- [ ] validateIdMiddleware sur toutes les routes avec :id
- [ ] Validation spécifique dans les controllers
- [ ] Sanitisation des entrées utilisateur
- [ ] Gestion des erreurs de validation
- [ ] Tests de validation ajoutés

## Ressources

- [Validation Schemas](../backend/utils/validationSchemas.js)
- [Form Validation Guide](./FORM_VALIDATION_GUIDE.md)
- [Security Guide](./SECURITY_INTEGRATION_GUIDE.md)
