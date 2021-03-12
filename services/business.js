// ====================================================
//      Business SERVICE
// ====================================================

const Business = require('../models').Business;
const models = require('../models');
const db = require('../models/index');
const { uploadFile, deleteFile } = require('./upload');
const { successMsg, errorMsg, exceptionMsg, unauthhorized } = require('../utils/responses');
const { saveLog } = require('./log');

//==============================================
//Mostrar todos los businesses
//==============================================
async function getBusinesses(req, res) {
    try {
        const businesses = await Business.findAll({
            include: [{
                    model: models.Program,
                    required: false,
                    where: { public: 1 },
                    include: [models.Asset, models.Vulnerability, models.VulnerabilityType, models.File]
                },
                {
                    model: models.User,
                    required: false
                },
                {
                    model: models.MoneyFlow,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', businesses)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todos los businesses por estatus
//==============================================
async function getBusinessesByStatus(req, res) {
    try {
        const status = req.params.status;
        const businesses = await Business.findAll({
            where: { status },
            include: [{
                    model: models.Program,
                    required: false,
                    where: { public: 1 },
                    include: [models.Asset, models.Vulnerability, models.VulnerabilityType, models.File]
                },
                {
                    model: models.MoneyFlow,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', businesses);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar business por id
//=================================
async function getBusinessById(req, res) {
    try {
        const id = req.params.id;
        const business = await Business.findOne({
            where: { id },
            include: [{
                    model: models.Program,
                    required: false,
                    where: { public: 1 },
                    include: [models.Asset, models.Vulnerability, models.VulnerabilityType, models.File]
                },
                {
                    model: models.MoneyFlow,
                    required: false
                }
            ]
        })
        business ?
            successMsg(res, 200, 'correcto', business) :
            exceptionMsg(res, id, 'Empresa');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear business
//==============================
async function saveBusiness(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = JSON.parse(req.body.company);
        const checkName = await Business.findOne({ where: { name: body.name } });
        if (checkName)
            return res.status(409).json({
                ok: false,
                err: {
                    message: `Ya existe una empresa registrada con el nombre: ${checkName.name}`
                }
            });
        const checkNit = await Business.findOne({ where: { nit: body.nit } });
        if (checkNit)
            return res.status(409).json({
                ok: false,
                err: {
                    message: `Ya existe una empresa registrada con el nit: ${checkNit.nit}`
                }
            });
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No hay imagen de empresa seleccionada"
                }
            });
        }
        let newBusiness = {
            name: body.name,
            description: body.description,
            nit: body.nit,
            phone: body.phone,
            address: body.address,
            country: body.country,
            city: body.city,
            assetQuantity: body.assetQuantity,
            status: 1
        }
        const business = await Business.create(newBusiness, { transaction })

        req.params.type = 'businesses';
        req.params.format = 'image';
        req.params.id = business.id;
        const file = await uploadFile(req, res)

        business.set({ image: file });
        await business.save({ transaction });
        await transaction.commit();
        saveLog(req, "create", "Business", business.id, req.user.id);
        const msg = business.name ?
            `Registro de empresa ${business.name} exitoso` :
            'Registro exitoso'


        successMsg(res, 200, msg, business);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==============================
//Actualizar business
//==============================
async function updateBusinessById(req, res) {
    try {
        const id = req.params.id;
        const business = await Business.findOne({ where: { id } });
        if (!business)
            return exceptionMsg(res, id, 'Empresa');

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId != id)
            return unauthhorized(res);

        const body = req.body;
        business.set({
            name: body.name,
            description: body.description,
            nit: body.nit,
            phone: body.phone,
            address: body.address,
            country: body.country,
            city: body.city,
            assetQuantity: body.assetQuantity
        })
        await business.save();

        saveLog(req, "update", "Business", business.id, req.user.id);
        const msg = business.name ?
            `Se edito ${ business.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, business);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar business
//=====================================
async function updateBusinessStatusById(req, res) {
    try {
        const id = req.params.id;
        const business = await Business.findOne({ where: { id } })

        if (!business)
            return exceptionMsg(res, id, 'Empresa');

        if (business.status != 0) {
            business.set({ status: 0 })
            await models.User.update({ status: 0 }, { where: { businessId: business.id } })
        } else {
            business.set({ status: 1 })
            await models.User.update({ status: 1 }, { where: { businessId: business.id } })
        }
        await business.save();
        saveLog(req, "update status", "Business", business.id, req.user.id);

        const msg = business.name ?
            `se actualizo el estatus de ${business.name}` :
            'actualización exitosa'

        successMsg(res, 200, msg, business);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=========================================
//Actualizar image business
//=========================================
async function updateImageBusiness(req, res) {
    try {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No hay archivo seleccionado"
                }
            });
        }

        const business = await Business.findOne({ where: { id: req.params.id } });
        if (!business)
            return exceptionMsg(res, id, 'Empresa');

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId != req.params.id)
            return unauthhorized(res);

        req.params.type = 'businesses';
        req.params.format = 'image';
        const file = await uploadFile(req, res)

        if (business.image !== '')
            deleteFile('businesses', business.image);

        business.set({ image: file })
        await business.save();
        saveLog(req, "update image", "Business", business.id, req.user.id);
        const msg = business.name ?
            `Actualización de imagen de emrpesa ${business.name} exitoso` :
            'Registro exitoso'

        successMsg(res, 200, msg, business);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}


module.exports = {
    getBusinesses,
    getBusinessesByStatus,
    getBusinessById,
    saveBusiness,
    updateBusinessById,
    updateBusinessStatusById,
    updateImageBusiness
}