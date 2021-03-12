// ====================================================
//      Routes API: Logs
// ====================================================

const express = require('express');
const logController = require('../controllers/log');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth');
const api = express.Router();

// =================================
// Todos los logs
// =================================
api.get('/all', [authenticate, verifiedAdminRol], logController.getLogs);

// =================================
// Logs por user id
// =================================
api.get('/:userId', [authenticate, verifiedAdminRol], logController.getLogsByUserId);

// =================================
// Logs por modelo
// =================================
api.get('/model/:modelName', [authenticate, verifiedAdminRol], logController.getLogsByModel);

// =================================
// Logs por fechas
// =================================
api.post('/date/all', [authenticate, verifiedAdminRol], logController.getLogsByDate);


module.exports = api;