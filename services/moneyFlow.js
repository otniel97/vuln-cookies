// ====================================================
//      MONEY FLOW SERVICE
// ====================================================

const MoneyFlow = require('../models').MoneyFlow;
const models = require('../models');
const { successMsg, errorMsg, exceptionMsg, unauthhorized } = require('../utils/responses');
const { saveLog } = require('./log');
const db = require('../models/index');
const { saveUserNotification, saveBusinessNotification, message, notificationType } = require('../services/notification');

//==============================================
//Mostrar todos las transacciones de una empresa
//==============================================
async function getMoneyFlowsByBusiness(req, res) {
    try {
        const businessId = req.params.businessId;
        const business = await models.Business.findOne({ where: { id: businessId } });
        if (!business)
            return exceptionMsg(res, businessId, 'Empresa');

        if (req.user.businessId !== null && req.user.businessId != businessId)
            return unauthhorized(res);

        const moneyFlows = await MoneyFlow.findAll({
            where: { businessId },
            include: [models.Hacker, models.VulnerabilityReport],
            order: [
                ['id', 'desc']
            ]
        });

        successMsg(res, 200, 'correcto', moneyFlows);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==================================================
//Mostrar todos las transacciones de un hacker
//==================================================
async function getMoneyFlowsByHacker(req, res) {
    try {
        const hackerId = req.params.hackerId;

        const hacker = await models.Hacker.findOne({ where: { id: hackerId }, include: [models.User] });
        if (!hacker)
            return exceptionMsg(res, hackerId, 'Hacker');

        if (req.user.roleId == 2 && hacker.User.id != req.user.id)
            return res.status(400).send({
                ok: false,
                message: `Datos de búsqueda de hacker ${hackerId} incorrectos`
            });

        const moneyFlows = await MoneyFlow.findAll({
            where: { hackerId },
            include: [models.Hacker, models.VulnerabilityReport, models.Business],
            order: [
                ['id', 'desc']
            ]
        });

        successMsg(res, 200, 'correcto', moneyFlows);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar transaccion por id
//=================================
async function getMoneyFlowById(req, res) {
    try {
        const id = req.params.id;
        const moneyFlow = await MoneyFlow.findOne({
            where: { id },
            include: [models.Hacker, models.VulnerabilityReport, models.Business]
        });

        moneyFlow ?
            successMsg(res, 200, 'correcto', moneyFlow) :
            exceptionMsg(res, id, 'Flujo de pago');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
//Crear transacción de crédito
//==============================
async function saveMoneyFlowCredit(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const body = req.body;

        const business = await models.Business.findOne({ where: { id: body.businessId } });
        if (!business)
            return exceptionMsg(res, body.businessId, 'Empresa');

        const debitsBusiness = await MoneyFlow.sum('debit', { where: { businessId: body.businessId } });
        const creditsBusiness = await MoneyFlow.sum('credit', { where: { businessId: body.businessId } });
        const newFlowBusiness = {
            businessId: body.businessId,
            description: body.description || "Dinero acreditado",
            credit: Number(body.credit),
            total: (creditsBusiness || 0) - (debitsBusiness || 0) + Number(body.credit),
            status: 1
        }
        const flow = await MoneyFlow.create(newFlowBusiness, { transaction });
        await saveBusinessNotification(res, message.moneyFlow, flow.description, notificationType.moneyFlow, flow.id, business.id);
        saveLog(req, "create", "MoneyFlow", flow.id, req.user.id);

        await transaction.commit();

        const moneyFlows = await MoneyFlow.findAll({
            where: { businessId: body.businessId },
            include: [models.Hacker, models.VulnerabilityReport],
            order: [
                ['id', 'desc']
            ]
        });
        successMsg(res, 200, "Transacción realizada", moneyFlows);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
//Crear transacción de débito
//==============================
async function saveMoneyFlowDebit(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const body = req.body;

        const business = await models.Business.findOne({ where: { id: body.businessId } });
        if (!business)
            return exceptionMsg(res, body.businessId, 'Empresa');
        if (req.user.businessId !== null && req.user.businessId != business.id)
            return unauthhorized(res);

        const report = await models.VulnerabilityReport.findOne({
            where: { id: body.reportId },
            include: [{ model: models.VulnerabilityType, require: true }, models.Hacker, models.Program]
        });
        if (!report)
            return exceptionMsg(res, body.reportId, 'Reporte');
        if (report.approved !== 1)
            return res.status(400).send({
                ok: false,
                message: `El reporte no está aprobado para realizar el pago`
            });
        if (report.paid === 1)
            return res.status(400).send({
                ok: false,
                message: `El reporte ya fue pagado`
            });
        if (report.Program.businessId !== business.id)
            return res.status(404).send({
                ok: false,
                message: `El reporte no pertenece a ningún programa de la empresa`
            });

        let checkPay = await models.ProgramVulnerabilityType.findOne({
            where: { vulnerabilityTypeId: report.vulnerabilityTypeId, programId: report.programId }
        });
        if (checkPay) {
            if (Number(body.debit) > checkPay.maxPrice || Number(body.debit) < checkPay.minPrice)
                return res.status(400).send({
                    ok: false,
                    message: `El rango de pago esta entre ${checkPay.minPrice}-${checkPay.maxPrice} $`
                });
        } else
            return res.status(400).send({
                ok: false,
                message: `El programa asociado al reporte no tiene configuración de pago para este tipo de vulnerabilidad`
            });

        const debitsBusiness = await MoneyFlow.sum('debit', { where: { businessId: body.businessId } });
        const creditsBusiness = await MoneyFlow.sum('credit', { where: { businessId: body.businessId } });
        const newFlowBusiness = {
            businessId: body.businessId,
            reportId: body.reportId,
            description: body.description,
            score: report.VulnerabilityType.score,
            debit: Number(body.debit),
            total: (creditsBusiness || 0) - (debitsBusiness || 0) - Number(body.debit),
            status: 1
        }
        const flowB = await MoneyFlow.create(newFlowBusiness, { transaction });
        saveLog(req, "create", "MoneyFlow", flowB.id, req.user.id);

        const debitsHacker = await MoneyFlow.sum('debit', { where: { hackerId: report.hackerId } });
        const creditsHacker = await MoneyFlow.sum('credit', { where: { hackerId: report.hackerId } });
        const newFlowHacker = {
            reportId: body.reportId,
            hackerId: report.hackerId,
            description: body.description,
            score: report.VulnerabilityType.score,
            credit: Number(body.debit),
            total: (creditsHacker || 0) - (debitsHacker || 0) + Number(body.debit),
            status: 1
        }
        const flowH = await MoneyFlow.create(newFlowHacker, { transaction });
        await saveUserNotification(res, message.moneyFlow, flowH.description, notificationType.moneyFlow, flowH.id, report.Hacker.userId);
        saveLog(req, "create", "MoneyFlow", flowH.id, req.user.id);

        report.paid = 1;
        await report.save({ transaction });

        await transaction.commit();

        const moneyFlows = await MoneyFlow.findAll({
            where: { businessId: body.businessId },
            include: [models.Hacker, models.VulnerabilityReport],
            order: [
                ['id', 'desc']
            ]
        });
        successMsg(res, 200, "Transacción de pago realizada", moneyFlows);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getMoneyFlowsByBusiness,
    getMoneyFlowsByHacker,
    getMoneyFlowById,
    saveMoneyFlowCredit,
    saveMoneyFlowDebit
}