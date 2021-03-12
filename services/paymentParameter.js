// ====================================================
//      PAYMENTPARAMETER SERVICE
// ====================================================

const PaymentParameter = require('../models').PaymentParameter;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todas los parámetros de pago
//==============================================
async function getPaymentParameters(req, res) {
    try {
        const parameters = await PaymentParameter.findAll();
        successMsg(res, 200, 'correcto', parameters)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================================
//Mostrar todas los parámetros de pago por estatus
//=================================================
async function getPaymentParametersByStatus(req, res) {
    try {
        const status = req.params.status;
        const parameters = await PaymentParameter.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', parameters);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar parámetro de pago por id
//=================================
async function getPaymentParameterById(req, res) {
    try {
        const id = req.params.id;
        const parameter = await PaymentParameter.findOne({ where: { id } })
        parameter ?
            successMsg(res, 200, 'correcto', parameter) :
            exceptionMsg(res, id, 'Parámetro de pago');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear parámetro de pago
//==============================
async function savePaymentParameter(req, res) {
    try {
        let body = req.body;

        let rol = {
            name: body.name,
            description: body.description,
            coin: body.coin,
            status: body.status || 1
        }

        const parameter = await PaymentParameter.create(rol);
        saveLog(req, "create", "PaymentParameter", parameter.id, req.user.id);

        const msg = parameter.name ?
            `${parameter.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, parameter);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Actualizar parámetro de pago
//==============================
async function updatePaymentParameterById(req, res) {
    try {
        const id = req.params.id;
        const parameter = await PaymentParameter.findOne({ where: { id } })

        if (!parameter)
            return exceptionMsg(res, id, 'Parámetro de pago');

        parameter.set({...req.body })
        await parameter.save();
        saveLog(req, "update", "PaymentParameter", parameter.id, req.user.id);
        const msg = parameter.name ?
            `Se edito ${ parameter.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, parameter);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar parámetro de pago
//=====================================
async function updatePaymentParameterStatusById(req, res) {
    try {
        const id = req.params.id;
        const parameter = await PaymentParameter.findOne({ where: { id } })

        if (!parameter)
            return exceptionMsg(res, id, 'Parámetro de pago');

        if (parameter.status != 0)
            parameter.set({ status: 0 })
        else
            parameter.set({ status: 1 })
        await parameter.save();
        saveLog(req, "update status", "PaymentParameter", parameter.id, req.user.id);

        const msg = parameter.name ?
            `se actualizo el estatus de ${parameter.name}` :
            'actualización exitosa'

        successMsg(res, 200, msg, parameter);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==================================
//Eliminar parámetro de pago por id
//==================================
async function deletePaymentParameterById(req, res) {
    try {
        const id = req.params.id;
        const parameter = await PaymentParameter.findOne({ where: { id } });
        if (!parameter)
            return exceptionMsg(res, id, 'Parámetro de pago');

        const deletePaymentParameter = await PaymentParameter.destroy({ where: { id } });
        saveLog(req, "delete", "PaymentParameter", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deletePaymentParameter);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getPaymentParameters,
    getPaymentParametersByStatus,
    getPaymentParameterById,
    savePaymentParameter,
    updatePaymentParameterById,
    deletePaymentParameterById,
    updatePaymentParameterStatusById,
}