// ====================================================
//       Controller Program
// ====================================================

const serviceProgram = require('../services/program');

//======================================
//Mostrar todos los programas
//======================================
async function getAllPrograms(req, res) {
    return serviceProgram.getAllPrograms(req, res);
}

//================================================
//Mostrar todos los programas publicos o privados
//================================================
async function getPrograms(req, res) {
    return serviceProgram.getPrograms(req, res);
}

//================================================
//Mostrar todos los programas aprobados
//================================================
async function getAllProgramsApproved(req, res) {
    return serviceProgram.getAllProgramsApproved(req, res);
}

//=================================================
//Mostrar todos los programas por estatus
//=================================================
async function getProgramsByStatus(req, res) {
    return serviceProgram.getProgramsByStatus(req, res);
}

//=================================
//Mostrar programa por id
//=================================
async function getProgramById(req, res) {
    return serviceProgram.getProgramById(req, res);
}

//==============================
//Crear programa
//==============================
async function saveProgram(req, res) {
    return serviceProgram.saveProgram(req, res)
}

//==============================
// Actualizar programa
//==============================
async function updateProgram(req, res) {
    return serviceProgram.updateProgramById(req, res);
}

//=====================================
// Cambiar status de programa
//=====================================
async function updateProgramStatus(req, res) {
    return serviceProgram.updateProgramStatusById(req, res);
}

//=====================================
// Aprobar programa
//=====================================
async function approveProgramById(req, res) {
    return serviceProgram.approveProgramById(req, res);
}

//=====================================
// Rechazar programa
//=====================================
async function rejectProgramById(req, res) {
    return serviceProgram.rejectProgramById(req, res);
}

//==============================
//  Eliminar programa
//==============================
async function deleteProgram(req, res) {
    return serviceProgram.deleteProgramById(req, res);
}

//=============================================
//   Guardar archivo de programa
//=============================================
async function updateProgramFile(req, res) {
    return serviceProgram.updateProgramFile(req, res);
}

//=============================================
//   Todos los programas publicos por empresa id
//=============================================
async function getProgramsByBusinessId(req, res) {
    return serviceProgram.getProgramsByBusinessId(req, res);
}

//=============================================
//   Todos los programas por empresa id logged
//=============================================
async function getProgramsByBusinessLogged(req, res) {
    return serviceProgram.getProgramsByBusinessLogged(req, res);
}

//=============================================
//   Todos los programas por empresa id
//=============================================
async function getProgramsByBusiness(req, res) {
    return serviceProgram.getProgramsByBusiness(req, res);
}

//==================================
// Agregar regla a programa
//==================================
async function saveRule(req, res) {
    return serviceProgram.saveRule(req, res)
}

//==================================
// Editar regla a programa
//==================================
async function updateRule(req, res) {
    return serviceProgram.updateRule(req, res)
}

//==================================
// Eliminar regla a programa
//==================================
async function deleteRule(req, res) {
    return serviceProgram.deleteRule(req, res)
}

//==================================
// Agregar activo a programa
//==================================
async function saveAsset(req, res) {
    return serviceProgram.saveAsset(req, res)
}

//==================================
// Editar activo a programa
//==================================
async function updateAsset(req, res) {
    return serviceProgram.updateAsset(req, res)
}

//==================================
// Eliminar activo a programa
//==================================
async function deleteAsset(req, res) {
    return serviceProgram.deleteAsset(req, res)
}

//==================================
// Agregar vulnerabilidad a programa
//==================================
async function saveVulnerability(req, res) {
    return serviceProgram.saveVulnerability(req, res)
}

//==================================
// Editar vulnerabilidad a programa
//==================================
async function updateVulnerability(req, res) {
    return serviceProgram.updateVulnerability(req, res)
}

//==================================
// Eliminar vulnerabilidad a programa
//==================================
async function deleteVulnerability(req, res) {
    return serviceProgram.deleteVulnerability(req, res)
}

//===========================================
// Agregar pagos por tipo de vulnerabilidad
//===========================================
async function saveVulnerabilityPay(req, res) {
    return serviceProgram.saveVulnerabilityPay(req, res)
}

//===========================================
// Editar pagos por tipo de vulnerabilidad
//===========================================
async function updateVulnerabilityPay(req, res) {
    return serviceProgram.updateVulnerabilityPay(req, res)
}

//==================================================
// Eliminar pagos por tipo de vulnerabilidad
//==================================================
async function deleteVulnerabilityPay(req, res) {
    return serviceProgram.deleteVulnerabilityPay(req, res)
}

//==================================
// Agregar archivo a programa
//==================================
async function saveFile(req, res) {
    return serviceProgram.saveFile(req, res)
}

//==================================
// Editar archivo a programa
//==================================
async function updateFile(req, res) {
    return serviceProgram.updateFile(req, res)
}

//==================================
// Eliminar archivo a programa
//==================================
async function deleteFile(req, res) {
    return serviceProgram.deleteFiles(req, res)
}

module.exports = {
    getAllPrograms,
    getPrograms,
    getAllProgramsApproved,
    getProgramsByStatus,
    getProgramById,
    saveProgram,
    updateProgram,
    updateProgramStatus,
    approveProgramById,
    rejectProgramById,
    deleteProgram,
    getProgramsByBusinessId,
    getProgramsByBusinessLogged,
    getProgramsByBusiness,
    updateProgramFile,
    saveRule,
    updateRule,
    deleteRule,
    saveAsset,
    updateAsset,
    deleteAsset,
    saveVulnerability,
    updateVulnerability,
    deleteVulnerability,
    saveVulnerabilityPay,
    updateVulnerabilityPay,
    deleteVulnerabilityPay,
    saveFile,
    updateFile,
    deleteFile
}