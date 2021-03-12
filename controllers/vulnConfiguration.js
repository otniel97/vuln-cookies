// ====================================================
//       Controller Vuln Configuration
// ====================================================

const serviceVulnConfiguration = require('../services/vulnConfiguration')

//===========================================
//Mostrar todas las config de vulnerabilidad
//===========================================
async function getVulnConfigurations(req, res) {
    return serviceVulnConfiguration.getVulnConfigurations(req, res);
}

//========================================================
//Mostrar todas las config de vulnerabilidad por estatus
//========================================================
async function getVulnConfigurationsByStatus(req, res) {
    return serviceVulnConfiguration.getVulnConfigurationsByStatus(req, res);
}

//========================================
//Mostrar config de vulnerabilidad por id
//========================================
async function getVulnConfigurationById(req, res) {
    return serviceVulnConfiguration.getVulnConfigurationById(req, res);
}

//==============================
//Crear config de vulnerabilidad
//==============================
async function saveVulnConfiguration(req, res) {
    return serviceVulnConfiguration.saveVulnConfiguration(req, res)
}

//=====================================
// Actualizar config de vulnerabilidad
//=====================================
async function updateVulnConfiguration(req, res) {
    return serviceVulnConfiguration.updateVulnConfigurationById(req, res);
}

//============================================
// Cambiar status de config de vulnerabilidad
//============================================
async function updateVulnConfigurationStatus(req, res) {
    return serviceVulnConfiguration.updateVulnConfigurationStatusById(req, res);
}

//=====================================
//  Eliminar config de vulnerabilidad
//=====================================
async function deleteVulnConfiguration(req, res) {
    return serviceVulnConfiguration.deleteVulnConfigurationById(req, res);
}

module.exports = {
    getVulnConfigurations,
    getVulnConfigurationsByStatus,
    getVulnConfigurationById,
    saveVulnConfiguration,
    updateVulnConfiguration,
    updateVulnConfigurationStatus,
    deleteVulnConfiguration
}