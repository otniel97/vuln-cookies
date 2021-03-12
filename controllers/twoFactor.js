// ====================================================
//      Controller TwoFactor
// ====================================================

const serviceTwoFactor = require('../services/twoFactor');

//======================================
// Generar key para two factor
//======================================
async function generateSecret(req, res) {
    return serviceTwoFactor.generateSecret(req, res);
}

//==============================================
// Verificar nueva secret key para two factor
//==============================================
async function verifyNewSecret(req, res) {
    return serviceTwoFactor.verifyNewSecret(req, res);
}

//==============================================
// Regenerar códigos secretos de recuperación
//==============================================
async function regenerateCodes(req, res) {
    return serviceTwoFactor.regenerateCodes(req, res);
}

//==============================================
// Verificar códigos secretos de recuperación
//==============================================
async function verifyRegenerateCodes(req, res) {
    return serviceTwoFactor.verifyRegenerateCodes(req, res);
}

//======================================
// Deshabilitar two factor authenticator
//======================================
async function twoFactorDisabled(req, res) {
    return serviceTwoFactor.twoFactorDisabled(req, res);
}

//======================================
// Email reset two factor authenticator
//======================================
async function emailResetTwoFactor(req, res) {
    return serviceTwoFactor.emailResetTwoFactor(req, res);
}

//======================================
// Resetear two factor authenticator
//======================================
async function resetTwoFactor(req, res) {
    return serviceTwoFactor.resetTwoFactor(req, res);
}

module.exports = {
    generateSecret,
    verifyNewSecret,
    regenerateCodes,
    verifyRegenerateCodes,
    twoFactorDisabled,
    emailResetTwoFactor,
    resetTwoFactor
}