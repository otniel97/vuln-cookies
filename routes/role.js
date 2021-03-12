// ====================================================
//      Routes API: Role
// ====================================================

const express = require('express');
const roleController = require('../controllers/role');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los roles
// =================================
api.get('/all', [authenticate, verifiedAdminRol], roleController.getRoles);

// =================================
// Todos los roles por estatus
// =================================
api.get('/all/:status', [authenticate, verifiedAdminRol], roleController.getRolesByStatus);

// ==============================
// Un rol por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], roleController.getRoleById);

// ===============================
// Crear nuevo rol
// ===============================
api.post('/save', [authenticate, verifiedAdminRol], roleController.saveRole);

// ====================================
// Actualizar rol
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], roleController.updateRole);

// ====================================
// Actualizar status de rol
// ====================================
api.put('/:id/status', [authenticate, verifiedAdminRol], roleController.updateRoleStatus);

// ====================================
// Eliminar rol
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], roleController.deleteRole);

module.exports = api;