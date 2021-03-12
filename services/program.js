// ====================================================
//      PROGRAM SERVICE
// ====================================================

const Program = require('../models').Program;
const models = require('../models');
const db = require('../models/index');
const { uploadFile, deleteFile } = require('./upload');
const { successMsg, errorMsg, exceptionMsg, unauthhorized } = require('../utils/responses');
const { saveLog } = require('./log');
const { sendProgramToAdminMails } = require('./email');
const { notificationType, message, saveAdminNotifications, saveBusinessNotification } = require('./notification');

//=================================================
//Mostrar todas los programas
//=================================================
async function getAllPrograms(req, res) {
    try {
        const programs = await Program.findAll({
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================================
//Mostrar todas los programas publicos o privados
//=================================================
async function getPrograms(req, res) {
    try {
        const isPublic = req.params.public;
        const programs = await Program.findAll({
            where: { public: isPublic },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================================
//Mostrar todas los programas aprobados
//=================================================
async function getAllProgramsApproved(req, res) {
    try {
        const programs = await Program.findAll({
            where: { public: 1, approved: 1, status: 1 },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs)
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todas los programas por estatus
//==============================================
async function getProgramsByStatus(req, res) {
    try {
        const status = req.params.status;
        const isPublic = req.params.public;
        const programs = await Program.findAll({
            where: { status, public: isPublic },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar programa por id
//=================================
async function getProgramById(req, res) {
    try {
        const id = req.params.id;
        const program = await Program.findOne({
            where: { id },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });

        if (!program)
            return exceptionMsg(res, id, 'Programa');

        if (program.public === 0) {
            if (req.user.roleId === 2) {
                const invitations = await models.HackerInvitation.findAll({
                    where: { hackerId: req.user.Hacker.id, programId: program.id, status: 1 }
                });
                if (invitations.length === 0)
                    return unauthhorized(res);
            }

            if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== program.businessId)
                return unauthhorized(res);
        }

        successMsg(res, 200, 'correcto', program);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear programa
//==============================
async function saveProgram(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = req.body;

        let checkBusiness = await models.Business.findOne({
            where: { id: body.businessId },
            include: [Program]
        });
        if (!checkBusiness)
            return res.status(404).send({
                ok: false,
                message: `No existe la empresa con id: ${body.businessId}`,
            });

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== checkBusiness.id)
            return unauthhorized(res);

        let newProgram = {
            name: body.name,
            description: body.description,
            public: body.public,
            businessId: body.businessId,
            transaction: 25,
            status: 1
        }

        const program = await Program.create(newProgram, { transaction });
        await saveAdminNotifications(res, message.program, program.name, notificationType.program, program.id);

        await transaction.commit();
        saveLog(req, "create", "Program", program.id, req.user.id);

        const admins = await models.User.findAll({ where: { roleId: 1 } });
        var context = {
            businessName: checkBusiness.name,
            programName: program.name,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            app: `${process.env.APP_NAME}`
        }
        sendProgramToAdminMails(admins, 'Nuevo programa registrado', 'newProgramAdmin', context);

        const msg = program.name ?
            `${program.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, program);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//=========================================
//Actualizar archivo de programa
//=========================================
async function updateProgramFile(req, res) {
    try {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No hay archivo seleccionado"
                }
            });
        }

        const program = await models.Program.findOne({ where: { id: req.params.id } });
        if (!program)
            successMsg(res, 200, `No existe datos para el id: ${id}`);

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== program.businessId)
            return unauthhorized(res);

        req.params.type = 'programs';
        req.params.format = 'file';
        const file = await uploadFile(req, res)

        if (program.file !== '')
            deleteFile('programs', program.file);

        program.set({ file })
        await program.save();
        saveLog(req, "update file", "Program", program.id, req.user.id);
        const msg = program.name ?
            `se actualizó archivo de ${program.name}` :
            'actualización exitosa'

        successMsg(res, 200, msg, program);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==============================
//Actualizar programa
//==============================
async function updateProgramById(req, res) {
    try {
        const id = req.params.id;
        let program = await Program.findOne({ where: { id } })

        if (!program)
            return exceptionMsg(res, id, 'Programa');

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== program.businessId)
            return unauthhorized(res);

        const body = req.body;

        program.set({
            name: body.name,
            description: body.description
        })
        await program.save();

        const msg = program.name ?
            `Se edito ${ program.name } con exito` :
            'Actualización de datos exitosa'
        program = await Program.findOne({
            where: { id },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        })
        saveLog(req, "update", "Program", program.id, req.user.id);
        successMsg(res, 200, msg, program);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar programa
//=====================================
async function updateProgramStatusById(req, res) {
    try {
        const id = req.params.id;
        let program = await Program.findOne({ where: { id } })

        if (!program)
            return exceptionMsg(res, id, 'Programa');

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== program.businessId)
            return unauthhorized(res);

        if (program.status != 0)
            program.set({ status: 0 })
        else
            program.set({ status: 1 })
        await program.save();
        saveLog(req, "update status", "Program", program.id, req.user.id);

        const msg = program.name ?
            `se actualizo el estatus de ${program.name}` :
            'actualización exitosa'

        program = await Program.findOne({
            where: { id },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                },
                {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        })

        successMsg(res, 200, msg, program);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Aprobar programa
//=====================================
async function approveProgramById(req, res) {
    try {
        const id = req.params.id;
        const program = await Program.findOne({ where: { id } })

        if (!program)
            exceptionMsg(res, id, 'Programa');
        else {
            program.set({ approved: 1 })
            await program.save();
            await saveBusinessNotification(res, message.programApproved, program.name, notificationType.program, program.id, program.businessId);
            saveLog(req, "approved", "Program", program.id, req.user.id);

            const msg = program.name ?
                `se aprobó el programa ${program.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, program)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
// Rechazar programa
//=====================================
async function rejectProgramById(req, res) {
    try {
        const id = req.params.id;
        const program = await Program.findOne({ where: { id } })

        if (!program)
            exceptionMsg(res, id, 'Programa');
        else {
            program.set({ approved: 0 })
            await program.save();
            await saveBusinessNotification(res, message.programReject, program.name, notificationType.program, program.id, program.businessId);
            saveLog(req, "rejected", "Program", program.id, req.user.id);

            const msg = program.name ?
                `se rechazó el programa ${program.name}` :
                'actualización exitosa'

            successMsg(res, 200, msg, program)
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==================================
//Eliminar programa por id
//==================================
async function deleteProgramById(req, res) {
    try {
        const id = req.params.id;
        const program = await Program.findOne({ where: { id } });
        if (!program)
            return exceptionMsg(res, id, 'Programa');

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== program.businessId)
            return unauthhorized(res);

        const deleteProgram = await Program.destroy({ where: { id } });
        saveLog(req, "delete", "Program", id, req.user.id);

        successMsg(res, 200, 'Registro eliminado con éxito', deleteProgram);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==================================================
//Mostrar todas los programas de empresa id publicos
//==================================================
async function getProgramsByBusinessId(req, res) {
    try {
        const businessId = req.params.businessId;
        const isPublic = req.params.public;

        let checkBusiness = await models.Business.findOne({
            where: { id: businessId }
        });
        if (!checkBusiness)
            return res.status(404).send({
                ok: false,
                message: `No existe la empresa con id: ${businessId}`,
            });

        const programs = await Program.findAll({
            where: { businessId, public: isPublic },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                }, {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================================
//Mostrar todas los programas de empresa id logged
//=================================================
async function getProgramsByBusinessLogged(req, res) {
    try {
        const businessId = req.params.businessId;
        if (businessId != req.user.businessId)
            return res.status(400).send({
                ok: false,
                message: `Datos de búsqueda de empresa ${businessId} incorrectos`,
            });

        let checkBusiness = await models.Business.findOne({
            where: { id: businessId }
        });
        if (!checkBusiness)
            return res.status(404).send({
                ok: false,
                message: `No existe la empresa con id: ${businessId}`,
            });

        const programs = await Program.findAll({
            where: { businessId },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                }, {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================================
//Mostrar todas los programas de empresa id
//==============================================
async function getProgramsByBusiness(req, res) {
    try {
        const businessId = req.params.businessId;

        let checkBusiness = await models.Business.findOne({
            where: { id: businessId }
        });
        if (!checkBusiness)
            return res.status(404).send({
                ok: false,
                message: `No existe la empresa con id: ${businessId}`,
            });

        const programs = await Program.findAll({
            where: { businessId },
            include: [{
                    model: models.Asset,
                    required: false,
                    include: [models.AssetType]
                }, {
                    model: models.Vulnerability,
                    required: false,
                    include: [models.VulnerabilityType]
                },
                {
                    model: models.VulnerabilityType,
                    required: false
                },
                {
                    model: models.File,
                    required: false
                },
                {
                    model: models.Business,
                    required: false
                }
            ]
        });
        successMsg(res, 200, 'correcto', programs);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
// Crear regla
//==============================
async function saveRule(req, res) {
    try {
        let body = req.body;

        let checkProgram = await models.Program.findOne({
            where: { id: body.programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${body.programId}`,
            });

        let newRule = {
            name: body.name,
            description: body.description,
            programId: body.programId,
            status: 1,
        }

        const rule = await models.Rule.create(newRule);
        saveLog(req, "create", "Rule", rule.id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: body.programId },
            include: [models.Rule]
        });
        if (program.Rules.length == 1) {
            program.transaction = program.transaction + 25;
            await program.save();
        }

        const msg = rule.name ?
            `${rule.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, rule);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
// Editar regla
//==============================
async function updateRule(req, res) {
    try {
        const id = req.params.ruleId;
        const rule = await models.Rule.findOne({ where: { id } })

        if (!rule)
            exceptionMsg(res, id, 'Regla');
        else {
            rule.set({...req.body })
            await rule.save();
            saveLog(req, "update", "Rule", rule.id, req.user.id);
            const msg = rule.name ?
                `Se edito ${ rule.name } con exito` :
                'Actualización de datos exitosa'

            successMsg(res, 200, msg, rule);
        }
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
//Eliminar regla por id
//==================================
async function deleteRule(req, res) {
    try {
        const id = req.params.ruleId;

        const rule = await models.Rule.findOne({ where: { id } });
        if (!rule)
            return exceptionMsg(res, id, 'Regla');

        const deleteRule = await models.Rule.destroy({ where: { id } });
        saveLog(req, "delete", "Rule", id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: rule.programId },
            include: [models.Rule]
        });
        if (program.Rules.length == 0) {
            program.transaction = program.transaction - 25;
            await program.save();
        }

        successMsg(res, 200, 'Registro eliminado con éxito', deleteRule);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
// Crear activo
//==============================
async function saveAsset(req, res) {
    try {
        let body = req.body;

        let checkProgram = await models.Program.findOne({
            where: { id: body.programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${body.programId}`,
            });

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== checkProgram.businessId)
            return unauthhorized(res);

        let checkAssetType = await models.AssetType.findOne({
            where: { id: body.assetTypeId }
        });
        if (!checkAssetType)
            return res.status(404).send({
                ok: false,
                message: `No existe el tipo de activo con id: ${body.assetTypeId}`,
            });

        let programIds = [];
        const business = await models.Business.findOne({ where: { id: checkProgram.businessId } });
        if (Number(body.inScope) === 1) {
            const programs = await Program.findAll({
                where: { businessId: checkProgram.businessId }
            })
            for await (prog of programs)
            programIds.push(prog.id)
            const assets = await models.Asset.findAll({
                where: { programId: programIds, inScope: 1 }
            })
            if (assets.length >= business.assetQuantity)
                return res.status(400).send({
                    ok: false,
                    message: `Cantidad de activos publicados ha llegado al límite, comuníquese con la organización`,
                });
        }

        let newAsset = {
            name: body.name,
            description: body.description,
            url: body.url,
            programId: body.programId,
            assetTypeId: body.assetTypeId,
            inScope: body.inScope,
            status: 1,
        }

        const asset = await models.Asset.create(newAsset);
        saveLog(req, "create", "Asset", asset.id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: body.programId },
            include: [models.Asset]
        });
        if (program.Assets.length == 1) {
            program.transaction = program.transaction + 25;
            await program.save();
        }

        newAsset = await models.Asset.findOne({
            where: { id: asset.id },
            include: [models.AssetType]
        });
        const msg = newAsset.name ?
            `${newAsset.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, newAsset);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
// Editar activo
//==============================
async function updateAsset(req, res) {
    try {
        const id = req.params.assetId;
        const asset = await models.Asset.findOne({ where: { id } })

        if (!asset)
            return exceptionMsg(res, id, 'Activo');

        if (req.body.assetTypeId) {
            let checkAssetType = await models.AssetType.findOne({
                where: { id: req.body.assetTypeId }
            });
            if (!checkAssetType)
                return res.status(404).send({
                    ok: false,
                    message: `No existe el tipo de activo con id: ${req.body.assetTypeId}`,
                });
        }

        asset.set({...req.body })
        await asset.save();
        saveLog(req, "update", "Asset", asset.id, req.user.id);

        const editAsset = await models.Asset.findOne({
            where: { id: asset.id },
            include: [models.AssetType]
        });
        const msg = editAsset.name ?
            `Se edito ${ editAsset.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, editAsset);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
//Eliminar activo por id
//==================================
async function deleteAsset(req, res) {
    try {
        const id = req.params.assetId;

        const asset = await models.Asset.findOne({ where: { id } });
        if (!asset)
            return exceptionMsg(res, id, 'Activo');

        const reports = await models.VulnerabilityReport.findAll({ where: { assetId: id } });
        if (reports !== null && reports.length > 0)
            return res.status(400).send({
                ok: false,
                message: `Existen reportes asociados a este activo, no se puede eliminar`,
            });

        const deleteAsset = await models.Asset.destroy({ where: { id } });
        saveLog(req, "delete", "Asset", id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: asset.programId },
            include: [models.Asset]
        });
        if (program.Assets.length == 0) {
            program.transaction = program.transaction - 25;
            await program.save();
        }

        successMsg(res, 200, 'Registro eliminado con éxito', deleteAsset);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
// Crear vulnerabilidad
//==============================
async function saveVulnerability(req, res) {
    try {
        let body = req.body;

        let checkProgram = await models.Program.findOne({
            where: { id: body.programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${body.programId}`,
            });

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== checkProgram.businessId)
            return unauthhorized(res);

        let checkVulnerability = await models.Vulnerability.findOne({
            where: { programId: checkProgram.id, name: body.name }
        });
        if (checkVulnerability)
            return res.status(409).send({
                ok: false,
                message: `Vulnerabilidad seleccionada (${body.name}) ya se encuentra registrada en su programa`,
            });

        let checkVulnerabilityType = await models.VulnerabilityType.findOne({
            where: { id: body.vulnerabilityTypeId }
        });
        if (!checkVulnerabilityType)
            return res.status(404).send({
                ok: false,
                message: `No existe el tipo de vulnerabilidad con id: ${body.vulnerabilityTypeId}`,
            });

        let newVulnerability = {
            name: body.name,
            description: body.description,
            programId: body.programId,
            vulnerabilityTypeId: body.vulnerabilityTypeId,
            isPaid: body.isPaid,
            status: 1,
        }

        const vulnerability = await models.Vulnerability.create(newVulnerability);
        saveLog(req, "create", "Vulnerability", vulnerability.id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: body.programId },
            include: [{
                model: models.Vulnerability,
                include: [models.VulnerabilityType]
            }]
        });
        if (program.Vulnerabilities.length == 1) {
            program.transaction = program.transaction + 25;
            await program.save();
        }

        newVulnerability = await models.Vulnerability.findOne({
            where: { id: vulnerability.id },
            include: [models.VulnerabilityType]
        });
        const msg = newVulnerability.name ?
            `${newVulnerability.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, newVulnerability);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
// Editar vulnerabilidad
//==============================
async function updateVulnerability(req, res) {
    try {
        const id = req.params.vulnerabilityId;
        const vulnerability = await models.Vulnerability.findOne({ where: { id } })

        if (!vulnerability)
            return exceptionMsg(res, id, 'Vulnerabilidad');

        if (req.body.vulnerabilityTypeId) {
            let checkVulnerabilityType = await models.VulnerabilityType.findOne({
                where: { id: req.body.vulnerabilityTypeId }
            });
            if (!checkVulnerabilityType)
                return res.status(404).send({
                    ok: false,
                    message: `No existe el tipo de vulnerabilidad con id: ${req.body.vulnerabilityTypeId}`,
                });
            vulnerability.set({ vulnerabilityTypeId: req.body.vulnerabilityTypeId })
        }

        vulnerability.set({ name: req.body.name, description: req.body.description, isPaid: Number(req.body.isPaid) })
        await vulnerability.save();
        saveLog(req, "update", "Vulnerability", vulnerability.id, req.user.id);

        const editVulnerability = await models.Vulnerability.findOne({
            where: { id: vulnerability.id },
            include: [models.VulnerabilityType]
        });
        const msg = editVulnerability.name ?
            `Se edito ${ editVulnerability.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, editVulnerability);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
//Eliminar vulnerabilidad por id
//==================================
async function deleteVulnerability(req, res) {
    try {
        const id = req.params.vulnerabilityId;

        const vulnerability = await models.Vulnerability.findOne({ where: { id } });
        if (!vulnerability)
            return exceptionMsg(res, id, 'Vulnerabilidad');

        const reports = await models.VulnerabilityReport.findAll({ where: { vulnerabilityId: id } });
        if (reports !== null && reports.length > 0)
            return res.status(400).send({
                ok: false,
                message: `Existen reportes asociados a esta vulnerabilidad, no se puede eliminar`,
            });

        const deleteVulnerability = await models.Vulnerability.destroy({ where: { id } });
        saveLog(req, "delete", "Vulnerability", id, req.user.id);

        const program = await models.Program.findOne({
            where: { id: vulnerability.programId },
            include: [{
                model: models.Vulnerability,
                include: [models.VulnerabilityType]
            }]
        });
        if (program.Vulnerabilities.length == 0) {
            program.transaction = program.transaction - 25;
            await program.save();
        }

        successMsg(res, 200, 'Registro eliminado con éxito', deleteVulnerability);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//================================
// Crear pagos por vulnerabilidad
//================================
async function saveVulnerabilityPay(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = req.body;

        let checkProgram = await models.Program.findOne({
            where: { id: body.programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${body.programId}`,
            });

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== checkProgram.businessId)
            return unauthhorized(res);

        let checkPay = await models.ProgramVulnerabilityType.findOne({
            where: { vulnerabilityTypeId: body.vulnerabilityTypeId, programId: body.programId }
        });
        if (checkPay)
            return res.status(400).send({
                ok: false,
                message: `Ya existe un configuración de pago registrada para este tipo de vulnerabilidad`,
            });

        let minPrice = Number(body.minPrice);
        let maxPrice = Number(body.maxPrice);
        if (minPrice <= 0)
            return res.status(400).json({
                ok: false,
                message: 'El valor mínimo debe ser mayor o igual a 1.'
            });
        if (minPrice > maxPrice)
            return res.status(400).json({
                ok: false,
                message: 'Los valores mínimos para los pagos no pueden ser mayores a los valores máximos.'
            });

        let pay = {
            programId: body.programId,
            vulnerabilityTypeId: body.vulnerabilityTypeId,
            minPrice: body.minPrice,
            maxPrice: body.maxPrice,
            status: 1
        }
        await models.ProgramVulnerabilityType.create(pay, { transaction });
        await transaction.commit()

        const program = await Program.findOne({
            where: { id: body.programId },
            include: [{
                model: models.VulnerabilityType
            }]
        });
        saveLog(req, "create pays", "Program", program.id, req.user.id);

        if (program.VulnerabilityTypes.length == 1) {
            program.transaction = program.transaction + 25;
            await program.save();
        }

        successMsg(res, 200, 'Correcto', program.VulnerabilityTypes);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
// Editar pagos por vulnerabilidad
//==================================
async function updateVulnerabilityPay(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = req.body;
        let programId = req.params.programId;
        let vulnerabilityTypeId = req.params.vulnerabilityTypeId;

        let checkProgram = await models.Program.findOne({
            where: { id: programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${programId}`,
            });

        let checkVulnerabilityType = await models.VulnerabilityType.findOne({
            where: { id: vulnerabilityTypeId }
        });
        if (!checkVulnerabilityType)
            return res.status(404).send({
                ok: false,
                message: `No existe el tipo de vulnerabilidad con id: ${vulnerabilityTypeId}`,
            });

        let minPrice = Number(body.minPrice);
        let maxPrice = Number(body.maxPrice);
        if (minPrice <= 0)
            return res.status(400).json({
                ok: false,
                message: 'El valor mínimo debe ser mayor o igual a 1.'
            });
        if (minPrice > maxPrice) {
            return res.status(400).json({
                ok: false,
                message: 'Los valores mínimos para los pagos no pueden ser mayores a los valores máximos.'
            });
        }

        let pay = await models.ProgramVulnerabilityType.findOne({
            where: { vulnerabilityTypeId, programId }
        });
        if (!pay)
            return res.status(400).send({
                ok: false,
                message: `No existe un configuración de pago registrada para este tipo de vulnerabilidad`,
            });

        pay.minPrice = body.minPrice;
        pay.maxPrice = body.maxPrice;
        await pay.save();
        await transaction.commit();

        const program = await Program.findOne({
            where: { id: programId },
            include: [{
                model: models.VulnerabilityType,
                where: { id: vulnerabilityTypeId }
            }]
        });
        saveLog(req, "update pay", "Program", program.id, req.user.id);

        successMsg(res, 200, 'Correcto', program.VulnerabilityTypes);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
//Eliminar  pagos por vulnerabilidad
//==================================
async function deleteVulnerabilityPay(req, res) {
    try {
        const programId = req.params.programId;
        const vulnerabilityTypeId = req.params.vulnerabilityTypeId;

        const pay = await models.ProgramVulnerabilityType.findOne({ where: { programId, vulnerabilityTypeId } });
        if (!pay)
            return exceptionMsg(res, vulnerabilityTypeId, 'Pago por vulnerabilidad');

        const deletePay = await models.ProgramVulnerabilityType.destroy({ where: { programId, vulnerabilityTypeId } });
        saveLog(req, "delete pay", "Program", programId, req.user.id);

        const program = await models.Program.findOne({
            where: { id: pay.programId },
            include: [models.VulnerabilityType]
        });
        if (program.VulnerabilityTypes.length == 0) {
            program.transaction = program.transaction - 25;
            await program.save();
        }

        successMsg(res, 200, 'Registro eliminado con éxito', program.VulnerabilityTypes);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//==============================
// Crear archivo
//==============================
async function saveFile(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = req.body;

        let checkProgram = await models.Program.findOne({
            where: { id: body.programId }
        });
        if (!checkProgram)
            return res.status(404).send({
                ok: false,
                message: `No existe el programa con id: ${body.programId}`,
            });

        if (req.user.businessId != undefined && req.user.businessId != null && req.user.businessId !== checkProgram.businessId)
            return unauthhorized(res);

        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No hay archivo seleccionado"
                }
            });
        }

        let newFile = {
            name: body.name,
            programId: body.programId,
            fileName: "s",
            status: 1,
        }

        const file = await models.File.create(newFile, { transaction });

        req.params.type = 'programs';
        req.params.format = 'file';
        req.params.id = file.id;
        const fileName = await uploadFile(req, res)
        file.set({ fileName });
        await file.save({ transaction });
        await transaction.commit();
        saveLog(req, "create", "File", file.id, req.user.id);

        const msg = file.name ?
            `${file.name} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, file);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
// Editar archivo
//==============================
async function updateFile(req, res) {
    try {
        const id = req.params.fileId;
        const file = await models.File.findOne({ where: { id } })

        if (!file)
            return exceptionMsg(res, id, 'Archivo');

        file.set({ name: req.body.name })
        if (req.files) {
            req.params.type = 'programs';
            req.params.format = 'file';
            const fileName = await uploadFile(req, res)

            if (file.fileName !== '')
                deleteFile('programs', file.fileName);

            file.set({ fileName })
        }
        await file.save();
        saveLog(req, "update", "File", file.id, req.user.id);
        const msg = file.name ?
            `Se edito ${ file.name } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, file);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==================================
//Eliminar archivo por id
//==================================
async function deleteFiles(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const id = req.params.fileId;

        const file = await models.File.findOne({ where: { id } });
        if (!file)
            return exceptionMsg(res, id, 'Archivo');

        const deleteFiles = await models.File.destroy({ where: { id } }, { transaction });
        if (file.fileName !== '')
            deleteFile('programs', file.fileName);

        saveLog(req, "delete", "File", id, req.user.id);
        await transaction.commit();

        successMsg(res, 200, 'Registro eliminado con éxito', deleteFiles);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getAllPrograms,
    getPrograms,
    getAllProgramsApproved,
    getProgramsByStatus,
    getProgramById,
    saveProgram,
    updateProgramById,
    deleteProgramById,
    updateProgramStatusById,
    approveProgramById,
    rejectProgramById,
    getProgramsByBusinessId,
    getProgramsByBusinessLogged,
    getProgramsByBusiness,
    updateProgramFile,
    saveRule,
    updateRule,
    deleteRule,
    saveAsset,
    updateAsset,
    deleteAsset,
    saveVulnerability,
    updateVulnerability,
    deleteVulnerability,
    saveVulnerabilityPay,
    updateVulnerabilityPay,
    deleteVulnerabilityPay,
    saveFile,
    updateFile,
    deleteFiles
}