// ====================================================
//      Controller Notification
// ====================================================

const serviceNotification = require('../services/notification');

//==============================================
//Mostrar notificaciones de usuario no leídas
//==============================================
async function getAllByUser(req, res) {
    return serviceNotification.getAllByUser(req, res);
}

//==============================================
//Marcar notifiación leída por id
//==============================================
async function statusNotification(req, res) {
    return serviceNotification.statusNotification(req, res);
}

//==============================================================
//Marcar todas las notifiaciones leídas de un usuario logeado
//==============================================================
async function statusAllNotification(req, res) {
    return serviceNotification.statusAllNotification(req, res);
}

module.exports = {
    getAllByUser,
    statusNotification,
    statusAllNotification,
}