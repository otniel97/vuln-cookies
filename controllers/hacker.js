// ====================================================
//      Service Hacker
// ====================================================

const serviceHacker = require('../services/hacker');

//======================================
//Mostrar todos los hackers
//======================================
async function getHackers(req, res) {
    return serviceHacker.getHackers(req, res);
}

//==============================================
//Mostrar todos los hackers
//==============================================
async function getHackersByStatus(req, res) {
    return serviceHacker.getHackersByStatus(req, res);
}

//=================================
//Mostrar hacker por id
//=================================
async function getHackerById(req, res) {
    return serviceHacker.getHackerById(req, res);
}

//==============================
//Actualizar hacker
//==============================
async function updateHacker(req, res) {
    return serviceHacker.updateHackerById(req, res);
}

//=====================================
//Activar desactivar hacker
//=====================================
async function statusHacker(req, res) {
    return serviceHacker.updateHackerStatusById(req, res);
}

//=====================================
//Asociar párametro de pago
//=====================================
async function savePaymentParameterHacker(req, res) {
    return serviceHacker.savePaymentParameterHacker(req, res);
}

//=====================================
//Actualizar párametro de pago
//=====================================
async function updatePaymentParameterHacker(req, res) {
    return serviceHacker.updatePaymentParameterHacker(req, res);
}

//=====================================
//Eliminar párametro de pago
//=====================================
async function deletePaymentParameterHacker(req, res) {
    return serviceHacker.deletePaymentParameterHacker(req, res);
}

//=====================================
//Hacker con párametro de pago
//=====================================
async function getPaymentParametersByHackerId(req, res) {
    return serviceHacker.getPaymentParametersByHackerId(req, res);
}

//=====================================
//Hacker con ranking
//=====================================
async function getRankingByHackerId(req, res) {
    return serviceHacker.getRankingByHackerId(req, res);
}

module.exports = {
    getHackers,
    getHackersByStatus,
    getHackerById,
    updateHacker,
    statusHacker,
    savePaymentParameterHacker,
    updatePaymentParameterHacker,
    deletePaymentParameterHacker,
    getPaymentParametersByHackerId,
    getRankingByHackerId
}