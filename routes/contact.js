// ====================================================
//      Routes API: Contact
// ====================================================

const express = require('express');
const contactController = require('../controllers/contact');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los contactos
// =================================
api.get('/all', [authenticate, verifiedAdminRol], contactController.getContacts);

// =================================
// Todos los contactos por estatus
// =================================
api.get('/all/:status', [authenticate, verifiedAdminRol], contactController.getContactsByStatus);

// ==============================
// Un contacto por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], contactController.getContactById);

// ===============================
// Crear nuevo contacto
// ===============================
api.post('/save', contactController.saveContact);

// ====================================
// Actualizar contacto
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], contactController.updateContact);

// ====================================
// Actualizar status de contacto
// ====================================
api.put('/:id/status', [authenticate, verifiedAdminRol], contactController.updateContactStatus);

// ====================================
// Eliminar contacto
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], contactController.deleteContact);

module.exports = api;