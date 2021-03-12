// ====================================================
//      Service Hacker Invitation
// ====================================================

const serviceHackerInvitation = require('../services/hackerInvitation');

//=========================================
//Mostrar todas las invitaciones
//=========================================
async function getHackerInvitations(req, res) {
    return serviceHackerInvitation.getHackerInvitations(req, res);
}

//=========================================
//Mostrar una invitación por id
//=========================================
async function getHackerInvitationById(req, res) {
    return serviceHackerInvitation.getHackerInvitationById(req, res);
}

//=========================================
//Mostrar hackers invitados a un programa
//=========================================
async function getHackerInvitationsByProgramId(req, res) {
    return serviceHackerInvitation.getHackerInvitationsByProgramId(req, res);
}

//=========================================
//Mostrar invitaciones de un hacker
//=========================================
async function getProgramInvitationsByHackerId(req, res) {
    return serviceHackerInvitation.getProgramInvitationsByHackerId(req, res);
}

//=========================================
//Mostrar invitaciones de una empresa
//=========================================
async function getProgramInvitationsByBusinessId(req, res) {
    return serviceHackerInvitation.getProgramInvitationsByBusinessId(req, res);
}

//=========================================
// Crear invitacioón
//=========================================
async function saveHackerInvitation(req, res) {
    return serviceHackerInvitation.saveHackerInvitation(req, res);
}

//=========================================
// Actualizar expiración de invitacioón
//=========================================
async function updateHackerInvitation(req, res) {
    return serviceHackerInvitation.updateHackerInvitation(req, res);
}

//=========================================
// Actualizar progreso de invitacioón
//=========================================
async function updateProgressHackerInvitation(req, res) {
    return serviceHackerInvitation.updateProgressHackerInvitation(req, res);
}

//=========================================
// Aceptar invitacioón
//=========================================
async function acceptHackerInvitation(req, res) {
    return serviceHackerInvitation.acceptHackerInvitation(req, res);
}

//=========================================
// Cancelar invitacioón
//=========================================
async function cancelHackerInvitation(req, res) {
    return serviceHackerInvitation.cancelHackerInvitation(req, res);
}

module.exports = {
    getHackerInvitations,
    getHackerInvitationById,
    getHackerInvitationsByProgramId,
    getProgramInvitationsByHackerId,
    getProgramInvitationsByBusinessId,
    saveHackerInvitation,
    updateHackerInvitation,
    updateProgressHackerInvitation,
    acceptHackerInvitation,
    cancelHackerInvitation
}