// ====================================================
//      NOTIFICATION SERVICE
// ====================================================

const Notification = require('../models').Notification;
const User = require('../models').User;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');

//==============================================
// Crear notificaciones de administrador
//==============================================
async function saveAdminNotifications(res, message, description, type, recordId) {
    try {
        const admins = await User.findAll({ where: { roleId: 1 } });
        for await (user of admins) {
            await Notification.create({ message, description, type, status: 0, recordId, userId: user.id });
        }
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================================
// Crear notificaciones de usuario
//==============================================
async function saveUserNotification(res, message, description, type, recordId, userId) {
    try {
        if (typeof(recordId) === 'number')
            await Notification.create({ message, description, type, status: 0, recordId, userId });
        else
            await Notification.create({ message, description, type, status: 0, uuid: recordId, userId });
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================================
// Crear notificaciones de usuario empresa
//==============================================
async function saveBusinessNotification(res, message, description, type, recordId, businessId) {
    try {
        const users = await User.findAll({ where: { businessId } });
        for await (user of users) {
            await Notification.create({ message, description, type, status: 0, recordId, userId: user.id });
        }
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================================
//Mostrar notificaciones de usuario no leídas
//==============================================
async function getAllByUser(req, res) {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id, status: 0 }
        });
        successMsg(res, 200, 'correcto', notifications);

    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================================
//Marcar notifiación leída por id
//==============================================
async function statusNotification(req, res, model) {
    try {
        const id = req.params.id;
        const notification = await Notification.findOne({ where: { id, userId: req.user.id } })

        if (!notification)
            return exceptionMsg(res, id, 'Notificación');

        notification.status = 1;
        await notification.save();

        successMsg(res, 200, "Notificación leída", notification)
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error)
    }
}

//==============================================================
//Marcar todas las notifiaciones leídas de un usuario logeado
//==============================================================
async function statusAllNotification(req, res) {
    try {
        const notification = await Notification.update({ status: 1 }, { where: { userId: req.user.id } })
        if (notification[0] === 0)
            successMsg(res, 200, `No se encontraron resultados para el usuario: ${req.user.id}.`)
        else
            successMsg(res, 200, 'Notificaciones marcadas leídas', notification)
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error)
    }
}

const notificationType = {
    report: "REPORT",
    program: "PROGRAM",
    invitation: "INVITATION",
    comment: "COMMENT",
    moneyFlow: "MONEYFLOW",
    contact: "CONTACT"
}

const message = {
    report: "Nuevo reporte",
    reportApproved: "Reporte aprobado",
    reportReject: "Reporte rechazado",
    program: "Nuevo programa",
    programApproved: "Programa aprobado",
    programReject: "Programa rechazado",
    invitation: "Nueva invitación",
    comment: "Nuevo comentario en reporte",
    moneyFlow: "Nueva transacción de pago",
    contact: "Nuevo mensaje de contacto"
}

module.exports = {
    saveAdminNotifications,
    saveUserNotification,
    saveBusinessNotification,
    getAllByUser,
    statusNotification,
    statusAllNotification,
    notificationType,
    message
}