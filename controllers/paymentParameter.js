// ====================================================
//      Controller PaymentParameter
// ====================================================

const servicePaymentParameter = require('../services/paymentParameter');

//======================================
//Mostrar todos los roles
//======================================
async function getPaymentParameters(req, res) {
    return servicePaymentParameter.getPaymentParameters(req, res);
}

//==========================================
//Mostrar todos los roles por estatus
//==========================================
async function getPaymentParametersByStatus(req, res) {
    return servicePaymentParameter.getPaymentParametersByStatus(req, res);
}

//=================================
//Mostrar rol por id
//=================================
async function getPaymentParameterById(req, res) {
    return servicePaymentParameter.getPaymentParameterById(req, res);
}

//==============================
//Crear rol
//==============================
async function savePaymentParameter(req, res) {
    return servicePaymentParameter.savePaymentParameter(req, res)
}

//==============================
// Actualizar rol
//==============================
async function updatePaymentParameter(req, res) {
    return servicePaymentParameter.updatePaymentParameterById(req, res);
}

//==============================
// Cambiar status de rol
//==============================
async function updatePaymentParameterStatus(req, res) {
    return servicePaymentParameter.updatePaymentParameterStatusById(req, res);
}

//==============================
//  Eliminar rol
//==============================
async function deletePaymentParameter(req, res) {
    return servicePaymentParameter.deletePaymentParameterById(req, res);
}

module.exports = {
    getPaymentParameters,
    getPaymentParametersByStatus,
    getPaymentParameterById,
    savePaymentParameter,
    updatePaymentParameter,
    updatePaymentParameterStatus,
    deletePaymentParameter
}