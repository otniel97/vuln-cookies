// ====================================================
//      Controller Auth
// ====================================================

const serviceAuth = require('../services/auth');

//======================================
// Sign in General
//======================================
async function signIn(req, res) {
    return serviceAuth.signIn(req, res)
}

//======================================
// Sign in Admin
//======================================
async function signInAdmin(req, res) {
    return serviceAuth.signInAdmin(req, res)
}

//=================================
// Verificar usuario
//=================================
async function verifiedUser(req, res) {
    return serviceAuth.verifiedUser(req, res)
}

//=================================
// Actualizar contraseña
//=================================
async function updatePasswordUser(req, res) {
    return serviceAuth.updatePasswordUser(req, res)
}

//======================================
// Actualizar contraseña nuevo usuario
//======================================
async function newPasswordUser(req, res) {
    return serviceAuth.newPasswordUser(req, res)
}

//======================================
// Correo Recuperar contraseña
//======================================
async function emailRecoverPassword(req, res) {
    return serviceAuth.emailRecoverPassword(req, res)
}

//======================================
// Recuperar contraseña
//======================================
async function recoverPassword(req, res) {
    return serviceAuth.recoverPassword(req, res)
}

//=================================
// Cambiar contraseña
//=================================
async function changePassword(req, res) {
    return serviceAuth.changePassword(req, res)
}

//======================================
// Sign in Google Authenticator
//======================================
async function signInGoogleAuthenticator(req, res) {
    return serviceAuth.signInGoogleAuthenticator(req, res)
}

//======================================
// Log Out of app
//======================================
async function logout(req, res) {
    return serviceAuth.logout(req, res)
}

module.exports = {
    signIn,
    signInAdmin,
    verifiedUser,
    updatePasswordUser,
    newPasswordUser,
    emailRecoverPassword,
    recoverPassword,
    changePassword,
    signInGoogleAuthenticator,
    logout
}