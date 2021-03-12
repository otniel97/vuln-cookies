// ====================================================
//       Controller Ranking
// ====================================================

const serviceRanking = require('../services/ranking')

//==========================================
//Mostrar todos los rankings
//==========================================
async function getRankings(req, res) {
    return serviceRanking.getRankings(req, res);
}

//=====================================================
//Mostrar todos los rankings por estatus
//=====================================================
async function getRankingsByStatus(req, res) {
    return serviceRanking.getRankingsByStatus(req, res);
}

//=====================================
//Mostrar ranking por id
//=====================================
async function getRankingById(req, res) {
    return serviceRanking.getRankingById(req, res);
}

//==============================
//Crear ranking
//==============================
async function saveRanking(req, res) {
    return serviceRanking.saveRanking(req, res)
}

//==================================
// Actualizar ranking
//==================================
async function updateRanking(req, res) {
    return serviceRanking.updateRankingById(req, res);
}

//=========================================
// Cambiar status de ranking
//=========================================
async function updateRankingStatus(req, res) {
    return serviceRanking.updateRankingStatusById(req, res);
}

//==================================
//  Eliminar ranking
//==================================
async function deleteRanking(req, res) {
    return serviceRanking.deleteRankingById(req, res);
}

module.exports = {
    getRankings,
    getRankingsByStatus,
    getRankingById,
    saveRanking,
    updateRanking,
    updateRankingStatus,
    deleteRanking
}