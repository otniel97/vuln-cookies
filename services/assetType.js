// ====================================================
//      ASSET TYPE SERVICE
// ====================================================

const AssetType = require('../models').AssetType;
const { successMsg, errorMsg, exceptionMsg } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todas los tipos de activos
//==============================================
async function getAssetTypes(req, res) {
    try {
        const assetTypes = await AssetType.findAll();
        successMsg(res, 200, 'correcto', assetTypes)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todas los tipos de activos por estatus
//==============================================
async function getAssetTypesByStatus(req, res) {
    try {
        const status = req.params.status;
        const assetTypes = await AssetType.findAll({ where: { status } });
        successMsg(res, 200, 'correcto', assetTypes);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar tipo de activo por id
//=================================
async function getAssetTypeById(req, res) {
    try {
        const id = req.params.id;
        const assetType = await AssetType.findOne({ where: { id } })
        assetType ?
            successMsg(res, 200, 'correcto', assetType) :
            exceptionMsg(res, id, 'Tipo de activo');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear tipo de activo
//==============================
async function saveAssetType(req, res) {
    try {
        let body = req.body;

        let newAssetType = {
            name: body.name,
            description: body.description,
            status: body.status || 1
        }

        const assetType = await AssetType.create(newAssetType);
        saveLog(req, "create", "AssetType", assetType.id, req.user.id);

        const msg = assetType.name ?
            `${assetType.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, assetType);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Actualizar tipo de activo
//==============================
async function updateAssetTypeById(req, res) {
    try {
        const id = req.params.id;
        const assetType = await AssetType.findOne({ where: { id } })

        if (!assetType)
            exceptionMsg(res, id, 'Tipo de activo');
        else {
            assetType.set({...req.body })
            await assetType.save();
            saveLog(req, "update", "AssetType", assetType.id, req.user.id);
            const msg = assetType.name ?
                `Se edito ${ assetType.name } con exito` :
                'Actualización de datos exitosa'

            successMsg(res, 200, msg, assetType);
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar tipo de activo
//=====================================
async function updateAssetTypeStatusById(req, res) {
    try {
        const id = req.params.id;
        const assetType = await AssetType.findOne({ where: { id } })

        if (!assetType)
            exceptionMsg(res, id, 'Tipo de activo');
        else {
            if (assetType.status != 0)
                assetType.set({ status: 0 })
            else
                assetType.set({ status: 1 })
            await assetType.save();
            saveLog(req, "update status", "AssetType", assetType.id, req.user.id);

            const msg = assetType.name ?
                `se actualizo el estatus de ${assetType.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, assetType)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==================================
//Eliminar tipo de activo por id
//==================================
async function deleteAssetTypeById(req, res) {
    try {
        const id = req.params.id;
        const assetType = await AssetType.findOne({ where: { id } });
        if (!assetType)
            return exceptionMsg(res, id, "Tipo de activo");

        const deleteAssetType = await AssetType.destroy({ where: { id } });
        saveLog(req, "delete", "AssetType", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteAssetType);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getAssetTypes,
    getAssetTypesByStatus,
    getAssetTypeById,
    saveAssetType,
    updateAssetTypeById,
    deleteAssetTypeById,
    updateAssetTypeStatusById,
}