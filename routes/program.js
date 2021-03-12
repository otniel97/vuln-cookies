// ====================================================
//      Routes API: Program
// ====================================================

const express = require('express');
const programController = require('../controllers/program');
const { authenticate, verifiedAdminRol, verifiedBusinessRol, verifiedProgramPermission } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los programas
// =================================
api.get('/all', [authenticate, verifiedAdminRol], programController.getAllPrograms);

// ==========================================
// Todos los programas tipo publico o privado
// ==========================================
api.get('/all/:public', [authenticate, verifiedAdminRol], programController.getPrograms);

// ==========================================
// Todos los programas aprobados
// ==========================================
api.get('/all/approved/public', authenticate, programController.getAllProgramsApproved);

// ==========================================
// Todos los programas por estatus
// ==========================================
api.get('/all/:status/:public', [authenticate, verifiedAdminRol], programController.getProgramsByStatus);

// ==============================
// Un programa por id
// ==============================
api.get('/:id', authenticate, programController.getProgramById);

// ===============================
// Crear nuevo programa
// ===============================
api.post('/save', [authenticate, verifiedProgramPermission], programController.saveProgram);

// ====================================
// Actualizar programa
// ====================================
api.put('/:id', [authenticate, verifiedProgramPermission], programController.updateProgram);

// ====================================
// Actualizar status de programa
// ====================================
api.put('/:id/status', [authenticate, verifiedProgramPermission], programController.updateProgramStatus);

// ====================================
// Aprobar programa
// ====================================
api.put('/:id/approve', [authenticate, verifiedAdminRol], programController.approveProgramById);

// ====================================
// Rechazar programa
// ====================================
api.put('/:id/reject', [authenticate, verifiedAdminRol], programController.rejectProgramById);

// ====================================
// Eliminar programa
// ====================================
api.delete('/:id', [authenticate, verifiedProgramPermission], programController.deleteProgram);

// ================================
// Actualizar archivo de programa
// ================================
api.put('/:id/programFile', [authenticate, verifiedProgramPermission], programController.updateProgramFile);

// ==========================================
// Todos los programas publicos por empresa id
// public 1 publicos, o privados
// ==========================================
api.get('/business/:businessId/:public', [authenticate, verifiedAdminRol], programController.getProgramsByBusinessId);

// =============================================
// Todos los programas por empresa id logged
// =============================================
api.get('/business/:businessId', [authenticate, verifiedBusinessRol], programController.getProgramsByBusinessLogged);

// =============================================
// Todos los programas por empresa id
// =============================================
api.get('/business-all/:businessId', [authenticate, verifiedAdminRol], programController.getProgramsByBusiness);

// ===============================
// Agregar regla a programa
// ===============================
api.post('/save/rule', [authenticate, verifiedProgramPermission], programController.saveRule);

// ===============================
// Editar regla a programa
// ===============================
api.put('/rule/:ruleId', [authenticate, verifiedProgramPermission], programController.updateRule);

// ===============================
// Eliminar regla a programa
// ===============================
api.delete('/rule/:ruleId', [authenticate, verifiedProgramPermission], programController.deleteRule);

// ===============================
// Agregar activo a programa
// ===============================
api.post('/save/asset', [authenticate, verifiedProgramPermission], programController.saveAsset);

// ===============================
// Editar activo a programa
// ===============================
api.put('/asset/:assetId', [authenticate, verifiedProgramPermission], programController.updateAsset);

// ===============================
// Eliminar activo a programa
// ===============================
api.delete('/asset/:assetId', [authenticate, verifiedProgramPermission], programController.deleteAsset);

// ===============================
// Agregar vulnerabilidad a programa
// ===============================
api.post('/save/vulnerability', [authenticate, verifiedProgramPermission], programController.saveVulnerability);

// ===============================
// Editar vulnerabilidad a programa
// ===============================
api.put('/vulnerability/:vulnerabilityId', [authenticate, verifiedProgramPermission], programController.updateVulnerability);

// ===================================
// Eliminar vulnerabilidad a programa
// ===================================
api.delete('/vulnerability/:vulnerabilityId', [authenticate, verifiedProgramPermission], programController.deleteVulnerability);

// ======================================================
// Agregar precio por tipo de vulnerabilidad a programa
// ======================================================
api.post('/save/pay/vulnerability', [authenticate, verifiedProgramPermission], programController.saveVulnerabilityPay);

// ===================================================
// Editar precio por tipo de vulnerabilidad a programa
// ===================================================
api.put('/:programId/:vulnerabilityTypeId/pay/vulnerability', [authenticate, verifiedProgramPermission], programController.updateVulnerabilityPay);

// ======================================================
// Eliminar precio por tipo de vulnerabilidad a programa
// ======================================================
api.delete('/:programId/:vulnerabilityTypeId/pay/vulnerability', [authenticate, verifiedProgramPermission], programController.deleteVulnerabilityPay);

// ===============================
// Agregar archivo a programa
// ===============================
api.post('/save/file', [authenticate, verifiedProgramPermission], programController.saveFile);

// ===============================
// Editar archivo a programa
// ===============================
api.put('/file/:fileId', [authenticate, verifiedProgramPermission], programController.updateFile);

// ===============================
// Eliminar archivo a programa
// ===============================
api.delete('/file/:fileId', [authenticate, verifiedProgramPermission], programController.deleteFile);

module.exports = api;