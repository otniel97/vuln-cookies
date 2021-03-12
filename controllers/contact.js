// ====================================================
//      Controller Contact
// ====================================================

const serviceContact = require('../services/contact')

//======================================
//Mostrar todos los contactos
//======================================
async function getContacts(req, res) {
    return serviceContact.getContacts(req, res);
}

//==========================================
//Mostrar todos los contactos por estatus
//==========================================
async function getContactsByStatus(req, res) {
    return serviceContact.getContactsByStatus(req, res);
}

//=================================
//Mostrar contacto por id
//=================================
async function getContactById(req, res) {
    return serviceContact.getContactById(req, res);
}

//==============================
//Crear contacto
//==============================
async function saveContact(req, res) {
    return serviceContact.saveContact(req, res)
}

//==============================
// Actualizar contacto
//==============================
async function updateContact(req, res) {
    return serviceContact.updateContactById(req, res);
}

//==============================
// Cambiar status de contacto
//==============================
async function updateContactStatus(req, res) {
    return serviceContact.updateContactStatusById(req, res);
}

//==============================
//  Eliminar contacto
//==============================
async function deleteContact(req, res) {
    return serviceContact.deleteContactById(req, res);
}

module.exports = {
    getContacts,
    getContactsByStatus,
    getContactById,
    saveContact,
    updateContact,
    updateContactStatus,
    deleteContact
}