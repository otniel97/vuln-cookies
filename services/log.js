// ====================================================
//      LOG SERVICE
// ====================================================

const Log = require('../models').Log;
const User = require('../models').User;
const Op = require('../models').Sequelize.Op;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const iplocate = require("node-iplocate");
const moment = require('moment');

async function saveLog(req, operation, modelName, recordId, userId) {
    if (process.env.NODE_ENV === "production") {
        let ip = req.headers['x-forwarded-for'];
        const address = await iplocate(ip);

        let action = {
            operation,
            method: req.method,
            modelName,
            recordId,
            userId,
            ip: address.ip,
            userAgent: req.headers['user-agent'],
            location: `${address.continent}, ${address.country}`,
            date: new Date()
        }
        await Log.create(action);
    }
}

//======================================
//Obtener todos los logs
//======================================
async function getLogs(req, res) {
    try {
        const logs = await Log.findAll({
            include: [{
                model: User,
                required: true
            }]
        })
        successMsg(res, 200, 'correcto', logs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//======================================
//Obtener logs por id usuario
//======================================
async function getLogsByUserId(req, res) {
    let userId = req.params.userId;
    try {
        const user = await User.findOne({ where: { id: userId } })
        if (!user)
            exceptionMsg(res, userId, 'Usuario');

        const logs = await Log.findAll({
            where: { userId },
            include: [{
                model: User,
                required: true
            }]
        })
        successMsg(res, 200, 'correcto', logs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//======================================
//Obtener logs por modelo asociado
//======================================
async function getLogsByModel(req, res) {
    let modelName = req.params.modelName;
    try {
        const logs = await Log.findAll({
            where: { modelName },
            include: [{
                model: User,
                required: true
            }]
        })
        successMsg(res, 200, 'correcto', logs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//======================================
//Obtener logs por fechas
//======================================
async function getLogsByDate(req, res) {
    try {
        let firstDate = req.body.firstDate;
        let secondDate = req.body.secondDate;

        if (moment(firstDate).format('YYYY-MM-DD') > moment(secondDate).format('YYYY-MM-DD'))
            return res.status(400).json({
                ok: true,
                message: `Error, fecha inicial debe ser menor o igual a fecha final`,
                firstDate
            });

        const logs = await Log.findAll({
            where: {
                [Op.or]: [{
                    date: {
                        [Op.gt]: firstDate,
                        [Op.lt]: secondDate
                    }
                }]
            },
            include: [{
                model: User,
                required: true
            }]
        });
        successMsg(res, 200, 'correcto', logs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

module.exports = {
    saveLog,
    getLogs,
    getLogsByUserId,
    getLogsByModel,
    getLogsByDate
}