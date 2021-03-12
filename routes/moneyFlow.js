// ====================================================
//      Routes API: Money flows
// ====================================================

const express = require('express');
const moneyFlowController = require('../controllers/moneyFlow');
const { authenticate, verifiedAdminRol, verifiedProgramPermission, verifiedHackerRol } = require('../middlewares/auth.js');
const api = express.Router();

// ==================================
// Mostrar transacciones de empresa
// ==================================
api.get('/business/:businessId', [authenticate, verifiedProgramPermission], moneyFlowController.getMoneyFlowsByBusiness);

// ==================================
// Mostrar transacciones de hacker
// ==================================
api.get('/hacker/:hackerId', [authenticate, verifiedHackerRol], moneyFlowController.getMoneyFlowsByHacker);

// ==================================
// Mostrar transacción por id
// ==================================
api.get('/:id', [authenticate], moneyFlowController.getMoneyFlowById);

// ==================================
// Crear transacción crédito
// ==================================
api.post('/save/credit', [authenticate, verifiedAdminRol], moneyFlowController.saveMoneyFlowCredit);

// ==================================
// Crear transacción débito
// ==================================
api.post('/save/debit', [authenticate, verifiedProgramPermission], moneyFlowController.saveMoneyFlowDebit);

module.exports = api;