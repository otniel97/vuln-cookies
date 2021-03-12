// ====================================================
//       Controller Asset Type
// ====================================================

const serviceAssetType = require('../services/assetType')

//======================================
//Mostrar todos los tipos de activo
//======================================
async function getAssetTypes(req, res) {
    return serviceAssetType.getAssetTypes(req, res);
}

//=================================================
//Mostrar todos los tipos de activo por estatus
//=================================================
async function getAssetTypesByStatus(req, res) {
    return serviceAssetType.getAssetTypesByStatus(req, res);
}

//=================================
//Mostrar tipo de activo por id
//=================================
async function getAssetTypeById(req, res) {
    return serviceAssetType.getAssetTypeById(req, res);
}

//==============================
//Crear tipo de activo
//==============================
async function saveAssetType(req, res) {
    return serviceAssetType.saveAssetType(req, res)
}

//==============================
// Actualizar tipo de activo
//==============================
async function updateAssetType(req, res) {
    return serviceAssetType.updateAssetTypeById(req, res);
}

//=====================================
// Cambiar status de tipo de activo
//=====================================
async function updateAssetTypeStatus(req, res) {
    return serviceAssetType.updateAssetTypeStatusById(req, res);
}

//==============================
//  Eliminar tipo de activo
//==============================
async function deleteAssetType(req, res) {
    return serviceAssetType.deleteAssetTypeById(req, res);
}

module.exports = {
    getAssetTypes,
    getAssetTypesByStatus,
    getAssetTypeById,
    saveAssetType,
    updateAssetType,
    updateAssetTypeStatus,
    deleteAssetType
}