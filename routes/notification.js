// ====================================================
//      Routes API: Notifications
// ====================================================

const express = require('express');
const notificationController = require('../controllers/notification');
const { authenticate } = require('../middlewares/auth.js');
const api = express.Router();

// ===============================================
// Mostrar notificaciones de usuario no leídas
// ===============================================
api.get('/all', authenticate, notificationController.getAllByUser);

// ===============================================
// Marcar leída notificación id 
// ===============================================
api.put('/:id', authenticate, notificationController.statusNotification);

// ==========================================================
// Marcar leídas todas las notificaciones de usuario logeado
// ==========================================================
api.put('/all/read', authenticate, notificationController.statusAllNotification);

module.exports = api;