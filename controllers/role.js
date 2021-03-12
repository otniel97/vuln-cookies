// ====================================================
//      Controller Role
// ====================================================

const serviceRole = require('../services/role')

//======================================
//Mostrar todos los roles
//======================================
async function getRoles(req, res) {
    return serviceRole.getRoles(req, res);
}

//==========================================
//Mostrar todos los roles por estatus
//==========================================
async function getRolesByStatus(req, res) {
    return serviceRole.getRolesByStatus(req, res);
}

//=================================
//Mostrar rol por id
//=================================
async function getRoleById(req, res) {
    return serviceRole.getRoleById(req, res);
}

//==============================
//Crear rol
//==============================
async function saveRole(req, res) {
    return serviceRole.saveRole(req, res)
}

//==============================
// Actualizar rol
//==============================
async function updateRole(req, res) {
    return serviceRole.updateRoleById(req, res);
}

//==============================
// Cambiar status de rol
//==============================
async function updateRoleStatus(req, res) {
    return serviceRole.updateRoleStatusById(req, res);
}

//==============================
//  Eliminar rol
//==============================
async function deleteRole(req, res) {
    return serviceRole.deleteRoleById(req, res);
}

module.exports = {
    getRoles,
    getRolesByStatus,
    getRoleById,
    saveRole,
    updateRole,
    updateRoleStatus,
    deleteRole
}