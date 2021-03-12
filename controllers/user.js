// ====================================================
//      Service User
// ====================================================

const serviceUser = require('../services/user');

//======================================
//Mostrar todos los usuarios
//======================================
async function getUsers(req, res) {
    return serviceUser.getUsers(req, res);
}

//==============================================
//Mostrar todos los usuarios
//==============================================
async function getUsersByStatus(req, res) {
    return serviceUser.getUsersByStatus(req, res);
}

//=================================
//Mostrar usuario por id
//=================================
async function getUserById(req, res) {
    return serviceUser.getUserById(req, res);
}

//==============================
//Crear usuario administrador
//==============================
async function saveUserAdmin(req, res) {
    return serviceUser.saveUserAdmin(req, res);
}

//==============================
//Crear usuario hacker
//==============================
async function saveUserHacker(req, res) {
    return serviceUser.saveUserHacker(req, res);
}

//==============================
//Crear usuario business
//==============================
async function saveUserBusiness(req, res) {
    return serviceUser.saveUserBusiness(req, res);
}

//==============================
//Actualizar usuario
//==============================
async function updateUser(req, res) {
    return serviceUser.updateUser(req, res);
}

//=====================================
//Activar desactivar usuario
//=====================================
async function statusUser(req, res) {
    return serviceUser.statusUser(req, res);
}

//=====================================
//Activar desactivar notificaciones
//=====================================
async function notificationsUser(req, res) {
    return serviceUser.notificationsUser(req, res);
}

//=========================================
//Actualizar imagen de perfil
//=========================================
async function updateImageProfile(req, res) {
    return serviceUser.updateImageProfile(req, res);
}

module.exports = {
    getUsers,
    getUsersByStatus,
    getUserById,
    saveUserAdmin,
    saveUserHacker,
    saveUserBusiness,
    updateUser,
    statusUser,
    notificationsUser,
    updateImageProfile,
}