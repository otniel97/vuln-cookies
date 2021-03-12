// ====================================================
//      ROLE SERVICE
// ====================================================

const Role = require('../models').Role;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todas los roles
//==============================================
async function getRoles(req, res) {
    try {
        const roles = await Role.findAll();
        successMsg(res, 200, 'correcto', roles)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todas los roles por estatus
//==============================================
async function getRolesByStatus(req, res) {
    try {
        const status = req.params.status;
        const roles = await Role.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', roles);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar rol por id
//=================================
async function getRoleById(req, res) {
    try {
        const id = req.params.id;
        const role = await Role.findOne({ where: { id } })
        role ?
            successMsg(res, 200, 'correcto', role) :
            exceptionMsg(res, id, 'Rol');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear rol
//==============================
async function saveRole(req, res) {
    try {
        let body = req.body;

        let rol = {
            name: body.name,
            description: body.description,
            status: body.status || 1
        }

        const role = await Role.create(rol);
        saveLog(req, "create", "Role", role.id, req.user.id);

        const msg = role.name ?
            `${role.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, role);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Actualizar rol
//==============================
async function updateRoleById(req, res) {
    try {
        const id = req.params.id;
        const role = await Role.findOne({ where: { id } })

        if (!role)
            exceptionMsg(res, id, 'Rol');
        else {
            role.set({...req.body })
            await role.save();
            saveLog(req, "update", "Role", role.id, req.user.id);
            const msg = role.name ?
                `Se edito ${ role.name } con exito` :
                'Actualización de datos exitosa'

            successMsg(res, 200, msg, role);
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar rol
//=====================================
async function updateRoleStatusById(req, res) {
    try {
        const id = req.params.id;
        const role = await Role.findOne({ where: { id } })

        if (!role)
            exceptionMsg(res, id, 'Rol');
        else {
            if (role.status != 0)
                role.set({ status: 0 })
            else
                role.set({ status: 1 })
            await role.save();
            saveLog(req, "update status", "Role", role.id, req.user.id);

            const msg = role.name ?
                `se actualizo el estatus de ${role.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, role)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==================================
//Eliminar rol por id
//==================================
async function deleteRoleById(req, res) {
    try {
        const id = req.params.id;
        const role = await Role.findOne({ where: { id } });
        if (!role)
            return exceptionMsg(res, id, 'Rol');

        const deleteRole = await Role.destroy({ where: { id } });
        saveLog(req, "delete", "Role", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteRole);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getRoles,
    getRolesByStatus,
    getRoleById,
    saveRole,
    updateRoleById,
    deleteRoleById,
    updateRoleStatusById,
}