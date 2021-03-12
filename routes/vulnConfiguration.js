// ====================================================
//      Routes API: Vuln Configuration
// ====================================================

const express = require('express');
const vulnConfController = require('../controllers/vulnConfiguration');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =====================================
// Todas las config de vulnerabilidades
// =====================================
api.get('/all', [authenticate, verifiedAdminRol], vulnConfController.getVulnConfigurations);

// ==================================================
// Todas las config de vulnerabilidades por estatus
// ==================================================
api.get('/all/:status', [authenticate], vulnConfController.getVulnConfigurationsByStatus);

// ===================================
// Una config de vulnerabilidad por id
// ===================================
api.get('/:id', [authenticate, verifiedAdminRol], vulnConfController.getVulnConfigurationById);

// ====================================
// Crear nueva config de vulnerabilidad
// ====================================
api.post('/save', [authenticate, verifiedAdminRol], vulnConfController.saveVulnConfiguration);

// ====================================
// Actualizar config de vulnerabilidad
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], vulnConfController.updateVulnConfiguration);

// ================================================
// Actualizar status de config de vulnerabilidad
// ================================================
api.put('/:id/status', [authenticate, verifiedAdminRol], vulnConfController.updateVulnConfigurationStatus);

// ====================================
// Eliminar config de vulnerabilidad
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], vulnConfController.deleteVulnConfiguration);

module.exports = api;