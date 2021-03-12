// ====================================================
//      Routes API: Hacker
// ====================================================

const express = require('express');
const hackerController = require('../controllers/hacker');
const { authenticate, verifiedAdminRol, verifiedHackerRol, verifiedAdminHacker } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los hackers
// =================================
api.get('/all', [authenticate, verifiedAdminRol], hackerController.getHackers);

// =================================
// Todos los hackers por status
// =================================
api.get('/all/:status', authenticate, hackerController.getHackersByStatus);

// ==============================
// Un hacker por id
// ==============================
api.get('/:id', authenticate, hackerController.getHackerById);

// =============================
// Editar hacker
// =============================
api.put('/:id', [authenticate, verifiedHackerRol], hackerController.updateHacker);

// ====================================
// Cambiar estatus de hacker
// ====================================
api.put('/status/:id', [authenticate, verifiedAdminRol], hackerController.statusHacker);

// =================================
// Hacker con parámetros de pago
// =================================
api.get('/:hackerId/paymentParameters', [authenticate, verifiedAdminHacker], hackerController.getPaymentParametersByHackerId);

// ====================================
// Asociar parámetro de pago a hacker
// ====================================
api.post('/paymentParameter', [authenticate, verifiedHackerRol], hackerController.savePaymentParameterHacker);

// ======================================
// Actualizar parámetro de pago a hacker
// ======================================
api.put('/paymentParameter/:paymentParameterId', [authenticate, verifiedHackerRol], hackerController.updatePaymentParameterHacker);

// ====================================
// Eliminar parámetro de pago a hacker
// ====================================
api.delete('/paymentParameter/:paymentParameterId', [authenticate, verifiedHackerRol], hackerController.deletePaymentParameterHacker);

// =================================
// Hacker con ranking
// =================================
api.get('/:hackerId/ranking', [authenticate, verifiedAdminHacker], hackerController.getRankingByHackerId);

module.exports = api;