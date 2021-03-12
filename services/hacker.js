// ====================================================
//      HACKER SERVICE
// ====================================================

const Hacker = require('../models').Hacker;
const User = require('../models').User;
const models = require('../models');
const PaymentParameterHacker = require('../models').PaymentParameterHacker;
const PaymentParameter = require('../models').PaymentParameter;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todos los hackers
//==============================================
async function getHackers(req, res) {
    try {
        const hackers = await Hacker.findAll({
            include: [{
                    model: User,
                    required: false
                },
                {
                    model: models.MoneyFlow,
                    required: false
                },
                {
                    model: models.Ranking,
                    required: false
                },
                {
                    model: models.PaymentParameter,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', hackers)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todos los hackers por estatus
//==============================================
async function getHackersByStatus(req, res) {
    try {
        const status = req.params.status;
        const hackers = await Hacker.findAll({
            where: { status },
            include: [{
                    model: User,
                    required: false
                },
                {
                    model: models.MoneyFlow,
                    required: false
                },
                {
                    model: models.Ranking,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', hackers);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar hacker por id
//=================================
async function getHackerById(req, res) {
    try {
        const id = req.params.id;
        const hacker = await Hacker.findOne({
            where: { id },
            include: [{
                    model: User,
                    required: false
                },
                {
                    model: models.MoneyFlow,
                    required: false
                },
                {
                    model: models.Ranking,
                    required: false
                }
            ]
        })
        hacker ?
            successMsg(res, 200, 'correcto', hacker) :
            exceptionMsg(res, id, 'Hacker');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Actualizar hacker
//==============================
async function updateHackerById(req, res) {
    try {
        const id = req.params.id;
        const hacker = await Hacker.findOne({ where: { id }, include: [models.Ranking] })
        if (!hacker)
            return exceptionMsg(res, id, 'Hacker');

        const body = req.body;

        hacker.set({
            name: body.name,
            lastname: body.lastname,
            nickname: body.nickname,
            phone: body.phone,
            githubHandle: body.githubHandle,
            gitlabHandle: body.gitlabHandle,
            linkedinHandle: body.linkedinHandle,
            twitterHandle: body.twitterHandle
        })
        await hacker.save();

        saveLog(req, "update", "Hacker", hacker.id, req.user.id);
        const msg = hacker.name ?
            `Se edito ${ hacker.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar hacker
//=====================================
async function updateHackerStatusById(req, res) {
    try {
        const id = req.params.id;
        const hacker = await Hacker.findOne({ where: { id }, include: [User] })

        if (!hacker)
            return exceptionMsg(res, id, 'Hacker');

        if (hacker.status != 0) {
            hacker.set({ status: 0 })
            hacker.User.set({ status: 0 })

        } else {
            hacker.set({ status: 1 })
            hacker.User.set({ status: 1 })
        }

        await hacker.save();
        await hacker.User.save();
        saveLog(req, "update status", "Hacker", hacker.id, req.user.id);

        const msg = hacker.name ?
            `se actualizo el estatus de ${hacker.name}` :
            'actualización exitosa'

        successMsg(res, 200, msg, hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Asociar párametro de pago
//=====================================
async function savePaymentParameterHacker(req, res) {
    try {
        const id = req.user.id;
        const body = req.body;

        const checkHacker = await Hacker.findOne({ where: { userId: id } });
        if (!checkHacker)
            return exceptionMsg(res, id, 'Hacker');

        const checkParameter = await PaymentParameter.findOne({ where: { id: body.paymentParameterId } });
        if (!checkParameter)
            return exceptionMsg(res, req.body.paymentParameterId, 'Parámetro de pago');

        const checkPayment = await PaymentParameterHacker.findOne({ where: { hackerId: checkHacker.id, paymentParameterId: body.paymentParameterId } });
        if (checkPayment)
            return res.status(409).send({
                ok: false,
                message: `Ya tiene un parámetro de pago asociado a ${checkParameter.name}`,
            });

        let payment = {
            hackerId: checkHacker.id,
            paymentParameterId: body.paymentParameterId,
            email: body.email,
            country: body.country,
            account: body.account,
            status: 1
        }
        await PaymentParameterHacker.create(payment);
        const hacker = await Hacker.findOne({ where: { userId: id }, include: [PaymentParameter] })
        successMsg(res, 200, "correcto", hacker)
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Actualizar párametro de pago
//=====================================
async function updatePaymentParameterHacker(req, res) {
    try {
        const body = req.body;
        const id = req.user.id;
        const paymentParameterId = req.params.paymentParameterId;

        let hacker = await Hacker.findOne({ where: { userId: id } });
        if (!hacker)
            return exceptionMsg(res, id, 'Hacker');

        const paymentParameter = await PaymentParameterHacker.findOne({ where: { paymentParameterId, hackerId: hacker.id } });
        if (!paymentParameter)
            return exceptionMsg(res, paymentParameterId, 'Parámetro de pago');

        await PaymentParameterHacker.update({
            email: body.email,
            country: body.country,
            account: body.account
        }, {
            where: { paymentParameterId, hackerId: hacker.id }
        });

        hacker = await Hacker.findOne({ where: { userId: id }, include: [PaymentParameter] });
        successMsg(res, 200, "correcto", hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Eliminar párametro de pago
//=====================================
async function deletePaymentParameterHacker(req, res) {
    try {
        const id = req.user.id;
        const paymentParameterId = req.params.paymentParameterId;

        let hacker = await Hacker.findOne({ where: { userId: id } });
        if (!hacker)
            return exceptionMsg(res, id, 'Hacker');

        const paymentParameter = await PaymentParameterHacker.findOne({ where: { paymentParameterId, hackerId: hacker.id } });
        if (!paymentParameter)
            return exceptionMsg(res, paymentParameterId, 'Parámetro de pago');

        const deletePayParameter = await PaymentParameterHacker.destroy({ where: { paymentParameterId, hackerId: hacker.id } });
        hacker = await Hacker.findOne({ where: { userId: id }, include: [PaymentParameter] });

        successMsg(res, 200, 'Registro eliminado con éxito', hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Hacker con párametro de pago
//=====================================
async function getPaymentParametersByHackerId(req, res) {
    try {
        const hackerId = req.params.hackerId;
        const hacker = await Hacker.findOne({ where: { id: hackerId }, include: [PaymentParameter] });
        if (!hacker)
            return exceptionMsg(res, hackerId, 'Hacker');
        successMsg(res, 200, "correcto", hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
// Obtener ranking del hacker
//=====================================
async function getRankingByHackerId(req, res) {
    try {
        const hackerId = req.params.hackerId;
        const hacker = await Hacker.findOne({ where: { id: hackerId }, include: [models.Ranking] });
        if (!hacker)
            return exceptionMsg(res, hackerId, 'Hacker');

        successMsg(res, 200, "correcto", hacker);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

module.exports = {
    getHackers,
    getHackersByStatus,
    getHackerById,
    updateHackerById,
    updateHackerStatusById,
    savePaymentParameterHacker,
    updatePaymentParameterHacker,
    deletePaymentParameterHacker,
    getPaymentParametersByHackerId,
    getRankingByHackerId
}