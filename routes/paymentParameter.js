// ====================================================
//      Routes API: PaymentParameter
// ====================================================

const express = require('express');
const paymentParameterController = require('../controllers/paymentParameter');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los parámetros de pago
// =================================
api.get('/all', [authenticate, verifiedAdminRol], paymentParameterController.getPaymentParameters);

// ============================================
// Todos los parámetros de pago por estatus
// ============================================
api.get('/all/:status', authenticate, paymentParameterController.getPaymentParametersByStatus);

// ==============================
// Un parámetro de pago por id
// ==============================
api.get('/:id', [authenticate, verifiedAdminRol], paymentParameterController.getPaymentParameterById);

// ===============================
// Crear nuevo parámetro de pago
// ===============================
api.post('/save', [authenticate, verifiedAdminRol], paymentParameterController.savePaymentParameter);

// ====================================
// Actualizar parámetro de pago
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], paymentParameterController.updatePaymentParameter);

// =======================================
// Actualizar status de parámetro de pago
// =======================================
api.put('/:id/status', [authenticate, verifiedAdminRol], paymentParameterController.updatePaymentParameterStatus);

// ====================================
// Eliminar parámetro de pago
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], paymentParameterController.deletePaymentParameter);

module.exports = api;