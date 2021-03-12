// ====================================================
//      Routes API: Hacker
// ====================================================

const express = require('express');
const invitationController = require('../controllers/hackerInvitation');
const { authenticate, verifiedAdminRol, verifiedProgramPermission, verifiedHackerRol, verifiedAdminHacker } = require('../middlewares/auth.js');
const api = express.Router();

//=========================================
// Mostrar todas las invitaciones
//=========================================
api.get('/all', [authenticate, verifiedAdminRol], invitationController.getHackerInvitations);

//=========================================
// Mostrar invitación por id
//=========================================
api.get('/:id', authenticate, invitationController.getHackerInvitationById);

//=========================================
// Mostrar hackers invitados a un programa
//=========================================
api.get('/program/:programId', [authenticate, verifiedProgramPermission], invitationController.getHackerInvitationsByProgramId);

//=========================================
// Mostrar invitaciones de un hacker
//=========================================
api.get('/hacker/:hackerId', [authenticate, verifiedAdminHacker], invitationController.getProgramInvitationsByHackerId);

//=========================================
// Mostrar invitaciones de una empresa
//=========================================
api.get('/business/:businessId', [authenticate, verifiedProgramPermission], invitationController.getProgramInvitationsByBusinessId);

//=========================================
// Enviar invitación a un hacker
//=========================================
api.post('/save', [authenticate, verifiedAdminRol], invitationController.saveHackerInvitation);

//=========================================
// Actualizar expiración de invitación
//=========================================
api.put('/:id', [authenticate, verifiedAdminRol], invitationController.updateHackerInvitation);

//=========================================
// Actualizar progreso de invitación
//=========================================
api.put('/:invitationId/progress', [authenticate, verifiedHackerRol], invitationController.updateProgressHackerInvitation);

//=========================================
// Aceptar invitación
//=========================================
api.put('/:invitationId/accept', [authenticate, verifiedHackerRol], invitationController.acceptHackerInvitation);

//=========================================
// Cancelar invitación
//=========================================
api.put('/:invitationId/cancel', [authenticate, verifiedHackerRol], invitationController.cancelHackerInvitation);

module.exports = api;