// ====================================================
//      HACKER INVITATION SERVICE
// ====================================================

const HackerInvitation = require('../models').HackerInvitation;
const models = require('../models');
const { validateExpirationDate, validateInvitationAccess } = require('../utils/validations');
const { successMsg, errorMsg, exceptionMsg, unauthhorized } = require('../utils/responses');
const { saveLog } = require('./log');
const { sendMail } = require('./email');
const { notificationType, message, saveUserNotification } = require('./notification');

//=========================================
//Mostrar todas las invitaciones
//=========================================
async function getHackerInvitations(req, res) {
    try {
        const invitations = await HackerInvitation.findAll({
            include: [models.Program, models.Hacker]
        })
        successMsg(res, 200, 'correcto', invitations);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
//Mostrar hackers invitados a un programa
//=========================================
async function getHackerInvitationsByProgramId(req, res) {
    try {
        const id = req.params.programId;

        const checkProgram = await models.Program.findOne({ where: { id } });
        if (!checkProgram)
            return exceptionMsg(res, id, 'Programa');

        if (req.user.businessId != undefined && req.user.businessId != null && checkProgram.businessId != req.user.businessId)
            return unauthhorized(res);

        const program = await models.Program.findOne({
            where: { id },
            include: [{
                model: HackerInvitation,
                required: false,
                include: [models.Program, {
                    model: models.Hacker,
                    include: [models.User]
                }]
            }]
        });
        program ?
            successMsg(res, 200, 'correcto', program.HackerInvitations) :
            exceptionMsg(res, id, 'Invitaciones para el programa');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
//Mostrar invitaciones de un hacker
//=========================================
async function getProgramInvitationsByHackerId(req, res) {
    try {
        const id = req.params.hackerId;

        let checkHacker = await models.Hacker.findOne({
            where: { id }
        });
        if (!checkHacker)
            return res.status(404).send({
                ok: false,
                message: `No existe el hacker con id: ${id}`,
            });

        if (req.user.roleId == 2) {
            const user = await models.User.findOne({ where: { id: checkHacker.userId } });
            if (user.id != req.user.id)
                return res.status(400).send({
                    ok: false,
                    message: `Datos de búsqueda de hacker ${id} incorrectos`
                });
        }

        const hacker = await models.Hacker.findOne({
            where: { id },
            include: [{
                model: HackerInvitation,
                where: { status: 1 },
                required: false,
                include: [{
                    model: models.Program,
                    include: [{ model: models.Asset, include: [models.AssetType] },
                        { model: models.Vulnerability, include: [models.VulnerabilityType] },
                        models.VulnerabilityType,
                        models.File
                    ]
                }, {
                    model: models.Hacker,
                    include: [models.User]
                }]
            }]
        })
        hacker ?
            successMsg(res, 200, 'correcto', hacker.HackerInvitations) :
            exceptionMsg(res, id, 'Invitaciones para el hacker');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
//Mostrar invitaciones de una empresa
//=========================================
async function getProgramInvitationsByBusinessId(req, res) {
    try {
        const id = req.params.businessId;

        let checkBusiness = await models.Business.findOne({
            where: { id }
        });
        if (!checkBusiness)
            return res.status(404).send({
                ok: false,
                message: `No existe la empresa con id: ${id}`,
            });

        if (req.user.businessId != undefined && checkBusiness.id != req.user.businessId)
            return res.status(400).send({
                ok: false,
                message: `Datos de búsqueda de empresa ${id} incorrectos`
            });

        const programIds = [];
        const programs = await models.Program.findAll({
            where: { businessId: id }
        });
        programs.forEach(program => {
            programIds.push(program.id);
        });

        const invitations = await HackerInvitation.findAll({
            where: { programId: programIds },
            include: [models.Program, models.Hacker]
        })
        invitations ?
            successMsg(res, 200, 'correcto', invitations) :
            exceptionMsg(res, id, 'Invitaciones para el hacker');
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
//Mostrar invitación por id
//=========================================
async function getHackerInvitationById(req, res) {
    try {
        const id = req.params.id;

        const hackerInvitation = await HackerInvitation.findOne({
            where: { id },
            include: [models.Hacker, {
                model: models.Program,
                include: [models.Asset,
                    models.Vulnerability,
                    models.VulnerabilityType,
                    models.File
                ]
            }, ]
        })

        if (!hackerInvitation)
            return exceptionMsg(res, id, 'Invitaciones para el hacker');

        let check = validateInvitationAccess(req, hackerInvitation);
        if (!check)
            return unauthhorized(res);

        successMsg(res, 200, 'correcto', hackerInvitation);

    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
// Crear invitación
//=========================================
async function saveHackerInvitation(req, res) {
    try {
        const body = req.body;

        if (!body.expirationDate || validateExpirationDate(body.expirationDate) <= 0)
            return res.status(409).json({
                ok: false,
                message: `La fecha de expiración de la invitación debe ser mayor a la actual`
            });

        const hacker = await models.Hacker.findOne({
            where: { id: body.hackerId },
            include: [models.User]
        })
        if (!hacker)
            return exceptionMsg(res, body.hackerId, 'Hacker');

        const program = await models.Program.findOne({ where: { id: body.programId } })
        if (!program)
            return exceptionMsg(res, body.programId, 'Programa');

        if (program.public == 1)
            return res.status(409).json({
                ok: false,
                message: `El programa seleccionado es público`
            });

        if (program.approved != 1)
            return res.status(409).json({
                ok: false,
                message: `El programa seleccionado no ha sido aprobado`
            });

        const newInvitation = {
            hackerId: body.hackerId,
            programId: body.programId,
            progress: 0,
            status: 1,
            expirationDate: body.expirationDate
        }

        const invitation = await HackerInvitation.create(newInvitation);
        await saveUserNotification(res, message.invitation, program.name, notificationType.invitation, invitation.id, hacker.User.id);
        saveLog(req, "create", "HackerInvitation", invitation.id, req.user.id);

        var context = {
            email: hacker.name,
            programName: program.name,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Invitación a programa privado', hacker.User.email, 'newHackerInvitation', context);

        const programInvitations = await models.Program.findOne({
            where: { id: invitation.programId },
            include: [{
                model: HackerInvitation,
                required: false,
                include: [models.Hacker]
            }]
        });
        successMsg(res, 200, "Invitación creada con éxito", programInvitations.HackerInvitations);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}


//=========================================
// Actualizar expiración de invitación
//=========================================
async function updateHackerInvitation(req, res) {
    try {
        const id = req.params.id;
        const body = req.body;

        if (!body.expirationDate || validateExpirationDate(body.expirationDate) <= 0)
            return res.status(409).json({
                ok: false,
                message: `La fecha de expiración de la invitación debe ser mayor a la actual`
            });

        const hackerInvitation = await HackerInvitation.findOne({ where: { id } })
        if (!hackerInvitation)
            return exceptionMsg(res, id, 'Invitación de Hacker');

        hackerInvitation.expirationDate = body.expirationDate;
        hackerInvitation.status = 1;
        await hackerInvitation.save();

        successMsg(res, 200, "Invitación actualizada con éxito", hackerInvitation);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
// Actualizar progreso de invitación
//=========================================
async function updateProgressHackerInvitation(req, res) {
    try {
        const id = req.params.invitationId;
        const body = req.body;

        if (!body.progress || Number(body.progress) <= 0 || Number(body.progress) > 100)
            return res.status(409).json({
                ok: false,
                message: `El progreso debe ser un número entre 1-100`
            });

        const hackerInvitation = await HackerInvitation.findOne({ where: { id } })
        if (!hackerInvitation)
            return exceptionMsg(res, id, 'Invitación de Hacker');

        if (req.user.Hacker.id != hackerInvitation.hackerId)
            return unauthhorized(res);

        hackerInvitation.progress = Number(body.progress);
        await hackerInvitation.save();

        successMsg(res, 200, "Invitación actualizada con éxito", hackerInvitation);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=========================================
// Aceptar invitación
//=========================================
async function acceptHackerInvitation(req, res) {
    try {
        const id = req.params.invitationId;

        const invitation = await HackerInvitation.findOne({ where: { id } });
        if (!invitation)
            return exceptionMsg(res, id, 'Invitación a programa');

        if (req.user.Hacker.id != invitation.hackerId)
            return unauthhorized(res);

        invitation.approved = 1;
        await invitation.save();

        successMsg(res, 200, "Invitación aceptada con éxito", invitation);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

async function cancelHackerInvitation(req, res) {
    try {
        const id = req.params.invitationId;

        const invitation = await HackerInvitation.findOne({ where: { id } });
        if (!invitation)
            return exceptionMsg(res, id, 'Invitación a programa');

        if (req.user.Hacker.id != invitation.hackerId)
            return unauthhorized(res);

        invitation.approved = 0;
        await invitation.save();

        successMsg(res, 200, "Invitación cancelada con éxito", invitation);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

module.exports = {
    getHackerInvitations,
    getHackerInvitationById,
    getHackerInvitationsByProgramId,
    getProgramInvitationsByHackerId,
    getProgramInvitationsByBusinessId,
    saveHackerInvitation,
    updateHackerInvitation,
    updateProgressHackerInvitation,
    acceptHackerInvitation,
    cancelHackerInvitation
}