// ====================================================
//      RANKING SERVICE
// ====================================================

const Ranking = require('../models').Ranking;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todos los rankings
//==============================================
async function getRankings(req, res) {
    try {
        const rankings = await Ranking.findAll();
        successMsg(res, 200, 'correcto', rankings)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//========================================================
//Mostrar todos los rankings por estatus
//========================================================
async function getRankingsByStatus(req, res) {
    try {
        const status = req.params.status;
        const rankings = await Ranking.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', rankings);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//======================================
//Mostrar ranking por id
//======================================
async function getRankingById(req, res) {
    try {
        const id = req.params.id;
        const ranking = await Ranking.findOne({ where: { id } })
        ranking ?
            successMsg(res, 200, 'correcto', ranking) :
            exceptionMsg(res, id, 'Ranking');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear ranking
//==============================
async function saveRanking(req, res) {
    try {
        let body = req.body;

        if (Number(body.maxValue) <= Number(body.minValue))
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Valor máximo debe ser superior al valor mínimo"
                }
            });

        let newRanking = {
            name: body.name,
            description: body.description,
            maxValue: Number(body.maxValue),
            minValue: Number(body.minValue),
            status: body.status || 1
        }

        const ranking = await Ranking.create(newRanking);
        saveLog(req, "create", "Ranking", ranking.id, req.user.id);

        const msg = ranking.name ?
            `${ranking.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, ranking);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//===================================
//Actualizar ranking
//===================================
async function updateRankingById(req, res) {
    try {
        const id = req.params.id;
        const ranking = await Ranking.findOne({ where: { id } })

        if (!ranking)
            exceptionMsg(res, id, 'Ranking');
        else {
            if (Number(req.body.maxValue) <= Number(req.body.minValue))
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Valor máximo debe ser superior al valor mínimo"
                    }
                });

            ranking.set({...req.body })
            await ranking.save();
            saveLog(req, "update", "Ranking", ranking.id, req.user.id);

            const msg = ranking.name ?
                `Se edito ${ ranking.name } con exito` :
                'Actualización de datos exitosa'

            successMsg(res, 200, msg, ranking);
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==========================================
//Activar desactivar ranking
//==========================================
async function updateRankingStatusById(req, res) {
    try {
        const id = req.params.id;
        const ranking = await Ranking.findOne({ where: { id } })

        if (!ranking)
            exceptionMsg(res, id, 'Ranking');
        else {
            if (ranking.status != 0)
                ranking.set({ status: 0 })
            else
                ranking.set({ status: 1 })
            await ranking.save();
            saveLog(req, "update status", "Ranking", ranking.id, req.user.id);

            const msg = ranking.name ?
                `se actualizo el estatus de ${ranking.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, ranking)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=======================================
//Eliminar ranking por id
//=======================================
async function deleteRankingById(req, res) {
    try {
        const id = req.params.id;
        const ranking = await Ranking.findOne({ where: { id } });
        if (!ranking)
            return exceptionMsg(res, id, 'Ranking');

        const deleteRanking = await Ranking.destroy({ where: { id } });
        saveLog(req, "delete", "Ranking", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteRanking);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getRankings,
    getRankingsByStatus,
    getRankingById,
    saveRanking,
    updateRankingById,
    deleteRankingById,
    updateRankingStatusById,
}