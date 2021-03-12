// ====================================================
//      Routes API: Vulnerability Type
// ====================================================

const express = require('express');
const rankingController = require('../controllers/ranking');
const { authenticate, verifiedAdminRol } = require('../middlewares/auth.js');
const api = express.Router();

// =================================
// Todos los ranking
// =================================
api.get('/all', [authenticate, verifiedAdminRol], rankingController.getRankings);

// ===============================================
// Todos los rankings por estatus
// ===============================================
api.get('/all/:status', authenticate, rankingController.getRankingsByStatus);

// ===================================
// Un ranking por id
// ===================================
api.get('/:id', [authenticate, verifiedAdminRol], rankingController.getRankingById);

// ====================================
// Crear nuevo ranking
// ====================================
api.post('/save', [authenticate, verifiedAdminRol], rankingController.saveRanking);

// ====================================
// Actualizar ranking
// ====================================
api.put('/:id', [authenticate, verifiedAdminRol], rankingController.updateRanking);

// ==============================================
// Actualizar status de ranking
// ==============================================
api.put('/:id/status', [authenticate, verifiedAdminRol], rankingController.updateRankingStatus);

// ====================================
// Eliminar ranking
// ====================================
api.delete('/:id', [authenticate, verifiedAdminRol], rankingController.deleteRanking);

module.exports = api;