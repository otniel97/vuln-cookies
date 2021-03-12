// ====================================================
//      Routes API: TwoFactor
// ====================================================

const express = require('express');
const twoFactorController = require('../controllers/twoFactor');
const { authenticate, verified } = require('../middlewares/auth');
const api = express.Router();

// ====================================
// Generar secret key para two factor
// ====================================
api.get('/generateSecret', authenticate, twoFactorController.generateSecret);

// ==============================================
// Verificar nueva secret key para two factor
// ==============================================
api.post('/verifyNewSecret', authenticate, twoFactorController.verifyNewSecret);

// ==============================================
// Regenerar códigos secretos de recuperación
// ==============================================
api.get('/regenerateCodes', authenticate, twoFactorController.regenerateCodes);

// ==============================================
// Verificar nuevos códigos de recuperación
// ==============================================
api.post('/verifyRegenerateCodes', authenticate, twoFactorController.verifyRegenerateCodes);

// ==============================================
// Deshabilitar two factor authenticator
// ==============================================
api.put('/disabled', authenticate, twoFactorController.twoFactorDisabled);

// =================================
// Correo resetear two factor
// =================================
api.post('/emailReset', authenticate, twoFactorController.emailResetTwoFactor);

// =================================
// Resetear two factor
// =================================
api.put('/reset', verified, twoFactorController.resetTwoFactor);

module.exports = api;