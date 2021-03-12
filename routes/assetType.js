// ====================================================
//      Routes API: Asset Type
// ====================================================

const express = require('express');
const assetTypeController = require('../controllers/assetType');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los tipos de activos
// =================================
api.get('/all', [authenticate, verifiedAdminRol], assetTypeController.getAssetTypes);

// ==========================================
// Todos los tipos de activos por estatus
// ==========================================
api.get('/all/:status', [authenticate], assetTypeController.getAssetTypesByStatus);

// ==============================
// Un tipo de activo por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], assetTypeController.getAssetTypeById);

// ===============================
// Crear nuevo tipo de activo
// ===============================
api.post('/save', [authenticate, verifiedAdminRol], assetTypeController.saveAssetType);

// ====================================
// Actualizar tipo de activo
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], assetTypeController.updateAssetType);

// ====================================
// Actualizar status de tipo de activo
// ====================================
api.put('/:id/status', [authenticate, verifiedAdminRol], assetTypeController.updateAssetTypeStatus);

// ====================================
// Eliminar tipo de activo
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], assetTypeController.deleteAssetType);

module.exports = api;