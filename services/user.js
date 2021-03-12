// ====================================================
//      USER SERVICE
// ====================================================

const User = require('../models').User;
const Role = require('../models').Role;
const Hacker = require('../models').Hacker;
const Business = require('../models').Business;
const db = require('../models/index');
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
const { sendMail, sendHackerToAdminMails } = require('../services/email');
const { uploadFile, deleteFile } = require('./upload');
const { createHas, encrypt } = require('../utils/hash');
const { successMsg, errorMsg, exceptionMsg, unauthhorized } = require('../utils/responses');
const { saveLog } = require('./log');
const { validatePassword } = require('../utils/validations');
const generator = require('generate-password');

//======================================
//Mostrar todos los usuarios
//======================================
async function getUsers(req, res) {
    try {

        let { businessId } = req.query;

        let where = {};

        if (businessId && businessId !== null && businessId !== undefined) {

            let bussinesExists = await Business.findOne({ where: { id: businessId } });

            if (!bussinesExists)
                return res.status(404).send({
                    ok: false,
                    message: `La empresa no existe.`,
                });

            where = {
                '$Business.id$': businessId
            }
        }

        const users = await User.findAll({
            where,
            include: [{
                    model: Role,
                    required: false,
                },
                {
                    model: Hacker,
                    required: false,
                },
                {
                    model: Business,
                    required: false
                }
            ]
        })
        successMsg(res, 200, 'correcto', users);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================================
//Mostrar todos los usuarios
//==============================================
async function getUsersByStatus(req, res) {
    try {
        const status = req.params.status;

        const users = await User.findAll({
            where: { status },
            include: [{
                    model: Role,
                    required: false,
                },
                {
                    model: Hacker,
                    required: false,
                },
                {
                    model: Business,
                    required: false,
                }
            ]
        })
        successMsg(res, 200, 'correcto', users);
    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error);
    }
}

//=================================
//Mostrar usuario por id
//=================================
async function getUserById(req, res) {
    try {
        const id = req.params.id;

        const user = await User.findOne({
            where: { id },
            include: [{
                    model: Role,
                    required: false,
                },
                {
                    model: Hacker,
                    required: false,
                },
                {
                    model: Business,
                    required: false,
                }
            ]
        });

        user ?
            successMsg(res, 200, 'correcto', user) :
            exceptionMsg(res, id, 'Usuario');

    } catch (error) {
        errorMsg(res, 500, 'Ha ocurrido un error', error)
    }
}

//==============================
//Crear usuario administrador
//==============================
async function saveUserAdmin(req, res) {
    try {
        let body = req.body;

        if (body.password !== body.passwordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseñas no coinciden',
            });

        if (!body.password || body.password.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (!validatePassword(body.password))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        let checkUser = await User.findOne({
            where: {
                [Op.or]: [{
                    email: {
                        [Op.eq]: body.email
                    }
                }]
            }
        });

        if (checkUser)
            return res.status(500).send({
                ok: false,
                message: `Ya existe un usuario con este correo electrónico: ${body.email}`,
            });

        const newPassword = generator.generate({ length: 20, lowercase: true, uppercase: true, symbols: true, numbers: true });

        let newUser = {
            email: body.email,
            password: createHas(newPassword),
            status: parseInt(body.status) || 1,
            roleId: 1,
            verified: 1,
            googleAuthenticator: 0,
            passwordConfirm: 0,
            passwordUpdate: new Date()
        }
        const user = await User.create(newUser);
        saveLog(req, "create", "User", user.id, req.user.id);

        let access = { userId: user.id, email: user.email };
        let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = tokenSimple;
        tokenSimple = encrypt(JSON.stringify(tokenSimple));
        await user.save();

        var context = {
            email: user.email,
            password: body.password,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            url: `${process.env.CLIENT_CORS_URL}/auth/adminpwd?token=${tokenSimple}`,
            app: `${process.env.APP_NAME}`
        }

        sendMail('Registro de usuario administrador', user.email, 'welcomeAdmin', context)

        const msg = user.email ?
            `${user.email} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, user);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Crear usuario hacker
//==============================
async function saveUserHacker(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let body = req.body;

        if (body.password !== body.passwordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseñas no coinciden',
            });

        if (!body.password || body.password.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (!validatePassword(body.password))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        let checkUser = await User.findOne({
            where: {
                [Op.or]: [{
                    email: {
                        [Op.eq]: body.email
                    }
                }]
            }
        });

        let checkHacker = await Hacker.findOne({
            where: {
                [Op.or]: [{
                    nickname: {
                        [Op.eq]: body.nickname
                    }
                }]
            }
        });

        if (checkUser)
            return res.status(500).send({
                ok: false,
                message: `Ya existe un usuario con este correo electrónico: ${body.email}`,
            });

        if (checkHacker)
            return res.status(500).send({
                ok: false,
                message: `Ya existe un usuario con este nickname: ${body.nickname}`,
            });

        if (!body.name || !body.lastname || !body.nickname)
            return res.status(500).send({
                ok: false,
                message: `Debe llenar todos los campos`,
            });

        let newUser = {
            email: body.email,
            password: createHas(body.password),
            status: parseInt(body.status) || 1,
            roleId: 2,
            verified: 0,
            googleAuthenticator: 0,
            passwordConfirm: 1,
            passwordUpdate: new Date()
        }
        const user = await User.create(newUser, { transaction });

        let newHacker = {
            name: body.name,
            lastname: body.lastname,
            nickname: body.nickname,
            phone: body.phone,
            userId: user.id,
            rankingId: 1,
            score: 100,
            status: 1
        }
        const hacker = await Hacker.create(newHacker, { transaction });
        const admins = await User.findAll({ where: { roleId: 1 } });

        await transaction.commit();

        let access = { userId: user.id, email: user.email };
        let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = tokenSimple;
        await user.save();
        tokenSimple = encrypt(JSON.stringify(tokenSimple));

        var context = {
            hacker,
            email: user.email,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            app: `${process.env.APP_NAME}`,
            url: `${process.env.CLIENT_CORS_URL}/auth/validate?token=${tokenSimple}`
        }
        sendMail('Validación de correo electrónico', user.email, 'emailValidation', context);
        sendHackerToAdminMails(admins, 'Nuevo hacker registrado', 'newHackerAdmin', context);
        saveLog(req, "create", "User", user.id, user.id);

        const msg = user.email ?
            `${user.email} creado con exito, hemos enviado un código de veificación a tu correo` :
            'creación exitosa, hemos enviado un código de veificación a tu correo!'

        successMsg(res, 200, msg, user);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Crear usuario business
//==============================
async function saveUserBusiness(req, res) {
    try {
        let body = req.body;

        let checkUser = await User.findOne({
            where: {
                [Op.or]: [{
                    email: {
                        [Op.eq]: body.email
                    }
                }]
            }
        });
        if (checkUser)
            return res.status(500).send({
                ok: false,
                message: `Ya existe un usuario con este correo electrónico: ${body.email}`,
            });

        let business = await Business.findOne({ where: { id: body.businessId } });
        if (!business)
            return res.status(404).send({
                ok: false,
                message: `No existe empresa con el id: ${body.businessId}`,
            });

        const newPassword = generator.generate({ length: 20, lowercase: true, uppercase: true, symbols: true, numbers: true });

        let newUser = {
            email: body.email,
            password: createHas(newPassword),
            status: parseInt(body.status) || 1,
            roleId: 3,
            verified: 1,
            googleAuthenticator: 0,
            passwordConfirm: 0,
            passwordUpdate: new Date(),
            businessId: body.businessId
        }
        const user = await User.create(newUser);

        let access = { userId: user.id, email: user.email };
        let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = tokenSimple;
        tokenSimple = encrypt(JSON.stringify(tokenSimple));
        await user.save();

        var context = {
            email: user.email,
            businessName: business.name,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            url: `${process.env.CLIENT_CORS_URL}/auth/businesspwd?token=${tokenSimple}`,
            app: `${process.env.APP_NAME}`
        }

        sendMail('Registro de usuario empresa', user.email, 'welcomeBusiness', context)
        saveLog(req, "create", "User", user.id, req.user.id);

        const msg = user.email ?
            `${user.email} creado con exito` :
            'creación exitosa!'

        successMsg(res, 200, msg, user);
    } catch (error) {
        errorMsg(res, 500, 'Lo sentimos!, hemos  cometido un error', error)
    }
}

//==============================
//Actualizar usuario
//==============================
async function updateUser(req, res) {
    try {
        const id = req.params.id;

        if (req.body.roleId) {
            let checkRole = await Role.findOne({ where: { id: req.body.roleId } });
            if (!checkRole)
                return res.status(404).send({
                    ok: false,
                    message: `No existe el rol con id: ${req.body.roleId}`,
                });
        }

        const user = await User.findOne({ where: { id } })

        if (!user)
            return exceptionMsg(res, id, 'Usuario');

        await user.save();

        saveLog(req, "update", "User", user.id, req.user.id);
        const msg = user.email ?
            `Se edito ${ user.email } con exito` :
            'Actualización de datos exitosa'

        successMsg(res, 200, msg, user);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=====================================
//Activar desactivar usuario
//=====================================
async function statusUser(req, res) {
    try {
        const id = req.params.id;

        const user = await User.findOne({ where: { id } })

        if (!user)
            exceptionMsg(res, id, 'Usuario');
        else {
            if (user.status != 0)
                user.set({ status: 0 })
            else
                user.set({ status: 1 })
            await user.save();
            saveLog(req, "update status", "User", user.id, req.user.id);

            const msg = user.email ?
                `se actualizo el estatus de ${user.email}` :
                'actualización exitosa'

            successMsg(res, 200, msg, user);
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//=========================================
//Actualizar imagen de perfil
//=========================================
async function updateImageProfile(req, res) {
    try {
        if (!req.files) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No hay archivo seleccionado"
                }
            });
        }

        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user)
            successMsg(res, 200, `No existe datos para el id: ${id}`);

        if (user.id !== req.user.id)
            return unauthhorized(res);

        req.params.type = 'users';
        req.params.format = 'image';
        const file = await uploadFile(req, res)

        if (user.image !== '')
            deleteFile('users', user.image);

        user.set({ image: file })
        await user.save();
        saveLog(req, "update image", "User", user.id, req.user.id);
        const msg = user.email ?
            `se actualizó imagen de ${user.email}` :
            'actualización exitosa'

        successMsg(res, 200, msg, user)
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

module.exports = {
    getUsers,
    getUsersByStatus,
    getUserById,
    saveUserAdmin,
    saveUserHacker,
    saveUserBusiness,
    updateUser,
    statusUser,
    updateImageProfile,
}