// ====================================================
//      Routes API: Auth
// ====================================================

const express = require('express');
const authController = require('../controllers/auth');
const { authenticate, verified } = require('../middlewares/auth');
const api = express.Router();

// =================================
// Sign in General
// =================================
api.post('/signIn', authController.signIn);

// =================================
// Sign in Admin
// =================================
api.post('/signIn/admin', authController.signInAdmin);

// =================================
// Verificar usuario
// =================================
api.post('/verified', verified, authController.verifiedUser);

// =================================
// Actualizar contraseña vencida
// =================================
api.post('/updatePassword', verified, authController.updatePasswordUser);

// ====================================
// Actualizar contraseña nuevo usuario
// ====================================
api.post('/newPassword', verified, authController.newPasswordUser);

// =================================
// Correo recuperación de contraseña
// =================================
api.post('/emailRecoverPassword', authController.emailRecoverPassword);

// ====================================
// Recuperar contraseña
// ====================================
api.put('/recoverPassword', verified, authController.recoverPassword);

// =================================
// Cambiar contraseña
// =================================
api.put('/changePassword', authenticate, authController.changePassword);

// =================================
// Sign in Google Authenticator 
// =================================
api.post('/signIn/googleAuthenticator', authenticate, authController.signInGoogleAuthenticator);

// =================================
// Log Out of app
// =================================
api.post('/logout', authController.logout);

module.exports = api;