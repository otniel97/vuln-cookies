// ====================================================
//      Service Business
// ====================================================

const serviceBusiness = require('../services/business');

//======================================
//Mostrar todos las empresas
//======================================
async function getBusinesses(req, res) {
    return serviceBusiness.getBusinesses(req, res);
}

//==============================================
//Mostrar todos las empresas
//==============================================
async function getBusinessesByStatus(req, res) {
    return serviceBusiness.getBusinessesByStatus(req, res);
}

//=================================
//Mostrar empresa por id
//=================================
async function getBusinessById(req, res) {
    return serviceBusiness.getBusinessById(req, res);
}

//==============================
//Creaer empresa
//==============================
async function saveBusiness(req, res) {
    return serviceBusiness.saveBusiness(req, res);
}

//==============================
//Actualizar empresa
//==============================
async function updateBusiness(req, res) {
    return serviceBusiness.updateBusinessById(req, res);
}

//=====================================
//Activar desactivar empresa
//=====================================
async function statusBusiness(req, res) {
    return serviceBusiness.updateBusinessStatusById(req, res);
}

//=====================================
//Actualizar image business
//=====================================
async function updateImageBusiness(req, res) {
    return serviceBusiness.updateImageBusiness(req, res);
}


module.exports = {
    getBusinesses,
    getBusinessesByStatus,
    getBusinessById,
    saveBusiness,
    updateBusiness,
    statusBusiness,
    updateImageBusiness
}