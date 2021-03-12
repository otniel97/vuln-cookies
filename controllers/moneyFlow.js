// ====================================================
//      Controller Money Flow
// ====================================================

const serviceMoneyFlow = require('../services/moneyFlow');

//==============================================
//Mostrar todos las transacciones de una empresa
//==============================================
async function getMoneyFlowsByBusiness(req, res) {
    return serviceMoneyFlow.getMoneyFlowsByBusiness(req, res);
}

//==================================================
//Mostrar todos las transacciones de un hacker
//==================================================
async function getMoneyFlowsByHacker(req, res) {
    return serviceMoneyFlow.getMoneyFlowsByHacker(req, res);
}

//=================================
//Mostrar transaccion por id
//=================================
async function getMoneyFlowById(req, res) {
    return serviceMoneyFlow.getMoneyFlowById(req, res);
}

//==============================
//Crear transaccion crédito
//==============================
async function saveMoneyFlowCredit(req, res) {
    return serviceMoneyFlow.saveMoneyFlowCredit(req, res)
}

//==============================
//Crear transaccion débito
//==============================
async function saveMoneyFlowDebit(req, res) {
    return serviceMoneyFlow.saveMoneyFlowDebit(req, res)
}

module.exports = {
    getMoneyFlowsByBusiness,
    getMoneyFlowsByHacker,
    getMoneyFlowById,
    saveMoneyFlowCredit,
    saveMoneyFlowDebit
}