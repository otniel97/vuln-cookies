// ====================================================
//      Controller Log
// ====================================================

const serviceLog = require('../services/log')

//======================================
//Mostrar todos los logs
//======================================
async function getLogs(req, res) {
    return serviceLog.getLogs(req, res);
}

//======================================
//Logs por id usuario
//======================================
async function getLogsByUserId(req, res) {
    return serviceLog.getLogsByUserId(req, res);
}

//======================================
//Obtener logs por modelo asociado
//======================================
async function getLogsByModel(req, res) {
    return serviceLog.getLogsByModel(req, res);
}

//======================================
//Obtener logs por fechas
//======================================
async function getLogsByDate(req, res) {
    return serviceLog.getLogsByDate(req, res);
}

module.exports = {
    getLogs,
    getLogsByUserId,
    getLogsByModel,
    getLogsByDate
}