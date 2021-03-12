// ====================================================
//      VULN CONFIGURATION SERVICE
// ====================================================

const VulnConfiguration = require('../models').VulnConfiguration;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todas las config de vulnerabilidad
//==============================================
async function getVulnConfigurations(req, res) {
    try {
        const vulnConfigurations = await VulnConfiguration.findAll();
        successMsg(res, 200, 'correcto', vulnConfigurations)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//======================================================
//Mostrar todas las config de vulnerabilidad por estatus
//======================================================
async function getVulnConfigurationsByStatus(req, res) {
    try {
        const status = req.params.status;
        const vulnConfigurations = await VulnConfiguration.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', vulnConfigurations);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=======================================
//Mostrar config de vulnerabilidad por id
//=======================================
async function getVulnConfigurationById(req, res) {
    try {
        const id = req.params.id;
        const vulnConfiguration = await VulnConfiguration.findOne({ where: { id } })
        vulnConfiguration ?
            successMsg(res, 200, 'correcto', vulnConfiguration) :
            exceptionMsg(res, id, 'Configuración de vulnerabilidad');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear config de vulnerabilidad
//==============================
async function saveVulnConfiguration(req, res) {
    try {
        let body = req.body;

        let newVulnConfiguration = {
            name: body.name,
            description: body.description,
            status: body.status || 1
        }

        const vulnConfiguration = await VulnConfiguration.create(newVulnConfiguration);
        saveLog(req, "create", "VulnConfiguration", vulnConfiguration.id, req.user.id);

        const msg = vulnConfiguration.name ?
            `${vulnConfiguration.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, vulnConfiguration);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//====================================
//Actualizar config de vulnerabilidad
//====================================
async function updateVulnConfigurationById(req, res) {
    try {
        const id = req.params.id;
        const vulnConfiguration = await VulnConfiguration.findOne({ where: { id } })

        if (!vulnConfiguration)
            return exceptionMsg(res, id, 'Configuración de vulnerabilidad');

        vulnConfiguration.set({...req.body })
        await vulnConfiguration.save();
        saveLog(req, "update", "VulnConfiguration", vulnConfiguration.id, req.user.id);
        const msg = vulnConfiguration.name ?
            `Se edito ${ vulnConfiguration.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, vulnConfiguration);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//===========================================
//Activar desactivar config de vulnerabilidad
//===========================================
async function updateVulnConfigurationStatusById(req, res) {
    try {
        const id = req.params.id;
        const vulnConfiguration = await VulnConfiguration.findOne({ where: { id } })

        if (!vulnConfiguration)
            exceptionMsg(res, id, 'Configuración de vulnerabilidad');
        else {
            if (vulnConfiguration.status != 0)
                vulnConfiguration.set({ status: 0 })
            else
                vulnConfiguration.set({ status: 1 })
            await vulnConfiguration.save();
            saveLog(req, "update status", "VulnConfiguration", vulnConfiguration.id, req.user.id);

            const msg = vulnConfiguration.name ?
                `se actualizo el estatus de ${vulnConfiguration.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, vulnConfiguration)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//========================================
//Eliminar config de vulnerabilidad por id
//========================================
async function deleteVulnConfigurationById(req, res) {
    try {
        const id = req.params.id;
        const vulnConfiguration = await VulnConfiguration.findOne({ where: { id } });
        if (!vulnConfiguration)
            return exceptionMsg(res, id, "Configuración de vulnerabilidad");

        const deleteVulnConfiguration = await VulnConfiguration.destroy({ where: { id } });
        saveLog(req, "delete", "VulnConfiguration", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteVulnConfiguration);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getVulnConfigurations,
    getVulnConfigurationsByStatus,
    getVulnConfigurationById,
    saveVulnConfiguration,
    updateVulnConfigurationById,
    deleteVulnConfigurationById,
    updateVulnConfigurationStatusById,
}