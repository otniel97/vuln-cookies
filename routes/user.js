// ====================================================
//      Routes API: User
// ====================================================

const express = require('express');
const userController = require('../controllers/user');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los usuarios
// =================================
api.get('/all', [authenticate, verifiedAdminRol], userController.getUsers);

// =================================
// Todos los usuarios por status
// =================================
api.get('/all/:status', [authenticate, verifiedAdminRol], userController.getUsersByStatus);

// ==============================
// Un usuario por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], userController.getUserById);

// ==================================
// Crear nuevo usuario administrador
// ==================================
api.post('/save-admin', [authenticate, verifiedAdminRol], userController.saveUserAdmin);

// ==================================
// Crear nuevo usuario hacker
// ==================================
api.post('/save-hacker', userController.saveUserHacker);

// ==================================
// Crear nuevo usuario business
// ==================================
api.post('/save-business', [authenticate, verifiedAdminRol], userController.saveUserBusiness);

// =============================
// Editar usuario
// =============================
api.put('/:id', [authenticate, verifiedAdminRol], userController.updateUser);

// ====================================
// Cambiar estatus de usuario
// ====================================
api.put('/status/:id', [authenticate, verifiedAdminRol], userController.statusUser);

// ================================
// Actualizar foto de perfil
// ================================
api.put('/:id/imageProfile', authenticate, userController.updateImageProfile);

module.exports = api;