const express = require('express');
const ProfileController = require('../controllers/user/ProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const { validateIdMiddleware } = require('../middleware/validateIdMiddleware');

router.put('/supplier/preferences', authMiddleware, (req, res) =>
  ProfileController.updateSupplierPreferences(req, res)
);

router.get('/supplier/preferences', authMiddleware, (req, res) =>
  ProfileController.getSupplierPreferences(req, res)
);

module.exports = router;
