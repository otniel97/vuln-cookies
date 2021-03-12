// ====================================================
//      CONTACT SERVICE
// ====================================================

const Contact = require('../models').Contact;
const User = require('../models').User;
const { sendMail, sendContactToAdminMails } = require('../services/email');
const { saveAdminNotifications, message, notificationType } = require('../services/notification');
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { validateCaptcha } = require('../utils/validations');
const { saveLog } = require('./log');

//==============================================
//Mostrar todas los contactos
//==============================================
async function getContacts(req, res) {
    try {
        const contacts = await Contact.findAll();
        successMsg(res, 200, 'correcto', contacts)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todas los contactos por estatus
//==============================================
async function getContactsByStatus(req, res) {
    try {
        const status = req.params.status;
        const contacts = await Contact.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', contacts);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar contacto por id
//=================================
async function getContactById(req, res) {
    try {
        const id = req.params.id;
        const contact = await Contact.findOne({ where: { id } })
        contact ?
            successMsg(res, 200, 'correcto', contact) :
            exceptionMsg(res, id, 'Contacto');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear contacto
//==============================
async function saveContact(req, res) {
    try {
        let body = req.body;

        const checkCaptcha = await validateCaptcha(req);
        if (!checkCaptcha)
            return res.status(500).send({
                ok: false,
                message: `Error en la validación del captcha`
            });

        let newContact = {
            name: body.name,
            lastname: body.lastname,
            email: body.email,
            company: body.company,
            description: body.description,
            reason: body.reason,
            phone: body.phone,
            status: body.status || 1
        }

        const contact = await Contact.create(newContact);
        const admins = await User.findAll({ where: { roleId: 1 } });
        await saveAdminNotifications(res, message.contact, contact.name, notificationType.contact, contact.id);

        var context = {
            contact,
            email: contact.email,
            name: contact.name,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            url: `${process.env.CLIENT_CORS_URL}`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Mensaje recibido', contact.email, 'newMessage', context);
        sendContactToAdminMails(admins, 'Nuevo mensaje de contacto', 'newMessageAdmin', context);

        const msg = contact.name ?
            `${contact.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, contact);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Actualizar contacto
//==============================
async function updateContactById(req, res) {
    try {
        const id = req.params.id;
        const contact = await Contact.findOne({ where: { id } })

        if (!contact)
            return exceptionMsg(res, id, 'Contacto');

        contact.set({...req.body })
        await contact.save();
        saveLog(req, "update", "Contact", contact.id, req.user.id);
        const msg = contact.name ?
            `Se edito ${ contact.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, contact);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar contacto
//=====================================
async function updateContactStatusById(req, res) {
    try {
        const id = req.params.id;
        const contact = await Contact.findOne({ where: { id } })

        if (!contact)
            return exceptionMsg(res, id, 'Contacto');

        if (contact.status != 0)
            contact.set({ status: 0 })
        else
            contact.set({ status: 1 })
        await contact.save();
        saveLog(req, "update status", "Contact", contact.id, req.user.id);

        const msg = contact.name ?
            `se actualizo el estatus de ${contact.name}` :
            'actualización exitosa'

        successMsg(res, 200, msg, contact);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==================================
//Eliminar contacto por id
//==================================
async function deleteContactById(req, res) {
    try {
        const id = req.params.id;
        const contact = await Contact.findOne({ where: { id } });
        if (!contact)
            return exceptionMsg(res, id, 'Contacto');

        const deleteContact = await Contact.destroy({ where: { id } });
        saveLog(req, "delete", "Contact", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteContact);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getContacts,
    getContactsByStatus,
    getContactById,
    saveContact,
    updateContactById,
    deleteContactById,
    updateContactStatusById,
}