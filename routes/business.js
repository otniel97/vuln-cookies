// ====================================================
//      Routes API: Business
// ====================================================

const express = require('express');
const businessController = require('../controllers/business');
const { authenticate, verifiedProgramPermission, verifiedAdminRol, verifiedBusinessRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los businesss
// =================================
api.get('/all', [authenticate, verifiedAdminRol], businessController.getBusinesses);

// =================================
// Todos los businesss por status
// =================================
api.get('/all/:status', [authenticate, verifiedAdminRol], businessController.getBusinessesByStatus);

// ==============================
// Un business por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], businessController.getBusinessById);

// =============================
// Crear business
// =============================
api.post('/save', [authenticate, verifiedAdminRol], businessController.saveBusiness);

// =============================
// Editar business
// =============================
api.put('/:id', [authenticate, verifiedProgramPermission], businessController.updateBusiness);

// ====================================
// Cambiar estatus de business
// ====================================
api.put('/status/:id', [authenticate, verifiedAdminRol], businessController.statusBusiness);

// ================================
// Actualizar logo de empresa
// ================================
api.put('/:id/image', [authenticate, verifiedProgramPermission], businessController.updateImageBusiness);

module.exports = api;