// ====================================================
//      AUTH SERVICE
// ====================================================

const User = require('../models').User;
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const moment = require('moment');
const models = require('../models');
const { sendMail } = require('../services/email');
const { createHas, compareHash, encrypt, decrypt } = require('../utils/hash');
const { successMsg, errorMsg } = require('../utils/responses');
const { verifySecret } = require('./twoFactor');
const { saveLog } = require('./log');
const { validatePassword } = require('../utils/validations');

// ====================================================
//      SignIn General
// ====================================================
async function signIn(req, res) {
    try {
        let body = req.body;

        if (!req.sessionID) //Verificar session id
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        let user = await User.findOne({
            where: { email: body.email, roleId: [2, 3] },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `Usuario o clave incorrecta`,
        });

        if (!compareHash(body.password, user.password)) //verificar contraseña
            return res.status(404).json({
            ok: true,
            message: `Contraseña incorrecta`,
        });
        else {
            if (user.status != 1) // verificar estatus de usuario
                return res.status(409).json({
                ok: true,
                message: `Usuario bloqueado, por favor comuníquese con la organización`,
            });

            if (user.token != null & user.token != "") { // verificar sesiones de usuario
                let existToken = user.token;
                let expired = false;
                user.token = "";
                user.sessionId = "";
                user.cookie = "";
                await user.save();

                jwt.verify(existToken, process.env.SEED, (error, data) => {
                    if (error) {
                        if (error.name == 'TokenExpiredError')
                            expired = true;
                    }
                });

                if (!expired)
                    return res.status(409).send({
                        ok: true,
                        message: `Tiene otra sesión abierta, por su seguridad será cerrada. Intente nuevamente en unos segundos`,
                    });
            }

            if (user.verified != 1) { // verificar correo o cuenta de usuario

                let access = { userId: user.id, email: user.email };
                let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_EMAIL });
                user.token = tokenSimple;
                user.sessionId = req.sessionID;
                await user.save();
                tokenSimple = encrypt(JSON.stringify(tokenSimple));

                var context = {
                    email: user.email,
                    urlWeb: `${process.env.CLIENT_CORS_URL}`,
                    logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
                    logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
                    url: `${process.env.CLIENT_CORS_URL}/auth/validate?token=${tokenSimple}`,
                    app: `${process.env.APP_NAME}`
                }
                sendMail('Validación de correo electrónico', user.email, 'emailValidation', context);
                return res.status(409).send({
                    ok: false,
                    message: `Su correo no está verificado, le hemos enviado un correo electrónico`,
                    token: tokenSimple
                });
            }

            const last = moment(user.passwordUpdate).format('YYYY-MM-DD');
            const today = moment(new Date()).format('YYYY-MM-DD');
            if (moment(today).diff(moment(last), 'days') > 60) // verificar vencimiento de contraseña de usuario
                user.dataValues['passwordExpired'] = 1;

            let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
            user.lastLoginAt = new Date();
            user.token = token;
            user.sessionId = req.sessionID;
            token = encrypt(JSON.stringify(token));
            await user.save();
            saveLog(req, "login", "User", user.id, user.id);

            if (user.googleAuthenticator === 1)
                return successMsg(res, 200, `Correcto, es necesario autenticación de doble factor`, { token, user });
            else
                return successMsg(res, 200, `Inicio de sesión correcto`, { token, user });
        }
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

// ====================================================
//      SignIn Admin
// ====================================================
async function signInAdmin(req, res) {
    try {
        let body = req.body;

        if (!req.sessionID) //Verificar cookies
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        let user = await User.findOne({
            where: { email: body.email, roleId: 1 },
            include: [{
                model: models.Role,
                required: false,
            }]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `Usuario o clave incorrecta`,
        });

        if (!compareHash(body.password, user.password)) //verificar contraseña
            return res.status(404).json({
            ok: true,
            message: `Usuario o clave incorrecta`,
        });

        if (user.status != 1) // verificar estatus de usuario
            return res.status(409).json({
            ok: true,
            message: `Usuario bloqueado, por favor comuníquese con la organización`,
        });

        if (user.token != null && user.token != "") { // verificar sesiones de usuario
            let existToken = user.token;
            let expired = false;
            user.token = "";
            user.sessionId = "";
            user.cookie = "";
            await user.save();

            jwt.verify(existToken, process.env.SEED, (error, data) => {
                if (error) {
                    if (error.name == 'TokenExpiredError')
                        expired = true;
                }
            });

            if (!expired)
                return res.status(409).send({
                    ok: true,
                    message: `Tiene otra sesión abierta, por su seguridad será cerrada. Intente nuevamente en unos segundos`,
                });
        }

        if (user.verified != 1) { // verificar correo o cuenta de usuario

            let access = { userId: user.id, email: user.email };
            let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_EMAIL });
            user.token = tokenSimple;
            await user.save();
            tokenSimple = encrypt(JSON.stringify(tokenSimple));

            var context = {
                email: user.email,
                urlWeb: `${process.env.CLIENT_CORS_URL}`,
                logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
                logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
                url: `${process.env.CLIENT_CORS_URL}/auth/validate?token=${tokenSimple}`,
                app: `${process.env.APP_NAME}`
            }
            sendMail('Validación de correo electrónico', user.email, 'emailValidation', context);
            return res.status(409).send({
                ok: false,
                message: `Su correo no está verificado, le hemos enviado un correo electrónico`,
                token: tokenSimple
            });
        }

        const last = moment(user.passwordUpdate).format('YYYY-MM-DD');
        const today = moment(new Date()).format('YYYY-MM-DD');
        if (moment(today).diff(moment(last), 'days') > 60) // verificar vencimiento de contraseña de usuario
            user.dataValues['passwordExpired'] = 1;

        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.lastLoginAt = new Date();
        user.token = token;
        user.sessionId = req.sessionID;
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "login", "User", user.id, user.id);

        if (user.googleAuthenticator === 1)
            return successMsg(res, 200, `Correcto, es necesario autenticación de doble factor`, { token, user });
        else
            return successMsg(res, 200, `Inicio de sesión correcto`, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//================================
//       Verificar usuario
//================================
async function verifiedUser(req, res) {
    try {
        const id = req.userId;
        const email = req.email;

        const user = await User.findOne({
            where: { id, email },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico: ${body.email} o contraseña`,
        });

        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.lastLoginAt = new Date();
        user.verified = 1;
        user.token = "";
        user.sessionId = "";
        user.cookie = "";
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "verified user", "User", user.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Cuenta verificada', user.email, 'accountVerified', context);

        successMsg(res, 200, `Cuenta verificada`, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//================================
//  Actualizar contraseña vencida
//================================
async function updatePasswordUser(req, res) {
    try {
        const id = req.userId;
        const email = req.email;
        let body = req.body;

        if (!req.sessionID) //Verificar cookies
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        const user = await User.findOne({
            where: { id, email },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico: ${body.email} o contraseña`,
        });

        if (!compareHash(body.password, user.password)) //verificar contraseña
            return res.status(409).send({
            ok: false,
            message: `Contraseña incorrecta`,
        });

        if (!req.body.newPassword || req.body.newPassword.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (body.newPassword !== body.newPasswordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseña nueva y confirmación no coinciden',
            });

        if (compareHash(body.newPassword, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Debe ingresar una contraseña diferente a la actual',
            });

        if (!validatePassword(body.newPassword))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        user.set({ password: createHas(body.newPassword), passwordUpdate: new Date(), lastLoginAt: new Date() })
        await user.save();

        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = token;
        user.sessionId = req.sessionID;
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "update password expired", "User", user.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Actualización de contraseña', user.email, 'passwordChange', context);

        const msg = user.email ?
            `se actualizo la contraseña de ${user.email}` :
            'actualización exitosa'

        successMsg(res, 200, msg, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==============================================
//       Actualizar contraseña nuevo usuario
//==============================================
async function newPasswordUser(req, res) {
    try {
        const id = req.userId;
        const email = req.email;
        let body = req.body;

        if (!req.sessionID) //Verificar cookies
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        const user = await User.findOne({
            where: { id, email },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico: ${body.email} o contraseña`,
        });

        if (!compareHash(body.password, user.password)) //verificar contraseña
            return res.status(409).send({
            ok: false,
            message: `Contraseña incorrecta`,
        });

        if (!req.body.newPassword || req.body.newPassword.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (body.newPassword !== body.newPasswordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseña nueva y confirmación no coinciden',
            });

        if (compareHash(body.newPassword, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Debe ingresar una contraseña diferente a la actual',
            });

        if (!validatePassword(body.newPassword))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        user.set({ password: createHas(body.newPassword), passwordUpdate: new Date(), lastLoginAt: new Date(), passwordConfirm: 1 })
        await user.save();

        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = token;
        user.sessionId = req.sessionID;
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "update password new user", "User", user.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Actualización de contraseña', user.email, 'passwordChange', context);

        const msg = user.email ?
            `se actualizo la contraseña de ${user.email}` :
            'actualización exitosa'

        successMsg(res, 200, msg, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//================================
// Correo Recuperar contraseña
//================================
async function emailRecoverPassword(req, res) {
    let body = req.body;

    //revisar si el email esta asociado a un usuario
    const user = await User.findOne({ where: { email: body.email } })
    if (!user)
        return res.status(404).json({
            ok: false,
            message: 'No existe un usuario asociado a ese correo.'
        });

    let access = { userId: user.id, email: user.email };
    let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_EMAIL });
    user.token = tokenSimple;
    await user.save();
    tokenSimple = encrypt(JSON.stringify(tokenSimple));

    var context = {
        email: user.email,
        urlWeb: `${process.env.CLIENT_CORS_URL}`,
        logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
        logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
        url: `${process.env.CLIENT_CORS_URL}/auth/recoverpwd?token=${tokenSimple}`,
        app: `${process.env.APP_NAME}`
    }

    sendMail('Recuperación de contraseña', user.email, 'recoverPassword', context);
    return res.status(200).send({
        ok: true,
        message: `Le hemos enviado un correo electrónico para recuperar su contraseña`
    });
}

//==============================================
//     Recuperar contraseña usuario
//==============================================
async function recoverPassword(req, res) {
    try {
        const id = req.userId;
        const email = req.email;
        let body = req.body;

        if (!req.sessionID) //Verificar cookies
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        const user = await User.findOne({
            where: { id, email },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico contraseña`,
        });

        if (!req.body.newPassword || req.body.newPassword.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (body.newPassword !== body.newPasswordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseña nueva y confirmación no coinciden',
            });

        if (compareHash(body.newPassword, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Debe ingresar una contraseña diferente a la actual',
            });

        if (!validatePassword(body.newPassword))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        user.set({ password: createHas(body.newPassword), passwordUpdate: new Date(), lastLoginAt: new Date(), passwordConfirm: 1 })
        await user.save();
        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.token = token;
        user.sessionId = req.sessionID;
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "recover password", "User", user.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Actualización de contraseña', user.email, 'passwordChange', context);

        const msg = user.email ?
            `se actualizo la contraseña de ${user.email}` :
            'actualización exitosa'

        successMsg(res, 200, msg, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//================================
//       Cambiar contraseña
//================================
async function changePassword(req, res) {
    try {
        let body = req.body;

        if (!req.body.newPassword || req.body.newPassword.length < 20)
            return res.status(400).json({
                ok: false,
                message: "Contraseña debe tener mínimo 20 caracteres"
            });

        if (body.newPassword !== body.newPasswordConfirm)
            return res.status(400).json({
                ok: false,
                message: 'Contraseñas no coinciden',
            });

        const id = req.user.id;
        const user = await User.findOne({ where: { id } });
        if (!compareHash(body.password, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña incorrecta'
            });

        if (compareHash(body.newPassword, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Debe ingresar una contraseña diferente a la actual',
            });

        if (!validatePassword(body.newPassword))
            return res.status(400).json({
                ok: false,
                message: 'Contraseña insegura (sugerencia: 2 mayúsculas, 2 mínusculas, 2 dígitos, 2 símbolos',
            });

        user.set({ password: createHas(body.newPassword), passwordConfirm: 1, passwordUpdate: new Date() })
        await user.save();
        saveLog(req, "change password", "User", user.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Actualización de contraseña', user.email, 'passwordChange', context);

        const msg = user.email ?
            `se actualizo la contraseña de ${user.email}` :
            'actualización exitosa'

        successMsg(res, 200, msg, user);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error)
    }
}

//================================
//  Login Google Authenticator
//================================
async function signInGoogleAuthenticator(req, res) {
    try {
        const id = req.user.id;
        const email = req.user.email;

        if (!req.sessionID) //Verificar cookies
            return res.status(400).send({
            ok: false,
            message: `Error del cliente`,
        });

        const user = await User.findOne({
            where: { id, email },
            include: [{
                    model: models.Role,
                    required: false,
                },
                {
                    model: models.Hacker,
                    required: false,
                },
                {
                    model: models.Business,
                    required: false,
                }
            ]
        });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico: ${body.email} o contraseña`,
        });

        const verified = await verifySecret(user, req.body.token, req.body.code) //verifica two factor token o refactor code
        if (!verified)
            return res.status(409).send({
                ok: false,
                message: `Verificación fallida`
            });

        let token = jwt.sign({ access: user }, process.env.SEED, { expiresIn: process.env.EXPIRATION_DATE });
        user.lastLoginAt = new Date();
        user.token = token;
        user.sessionId = req.sessionID;
        token = encrypt(JSON.stringify(token));
        await user.save();
        saveLog(req, "login google", "User", user.id, user.id);

        successMsg(res, 200, `Inicio de sesión correcto`, { token, user });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//================================
//  Log Out of app
//================================
async function logout(req, res) {
    try {
        const email = req.body.email;
        const token = req.body.token

        if (!email || email === '' || !token || token === '')
            return res.status(422).send({
                ok: false,
                message: `Ingrese token y email del usuario.`,
            });

        const user = await User.findOne({
            where: { email }
        });

        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `El usuario no existe o no tiene una sesión activa.`,
        });

        // This if 'cause the session has been expired (no another active session)
        // If user.token !== decoded then it means there is multiple sessions, so token must be not deleted for db
        const decoded = JSON.parse(decrypt(token))
        if (user.token === decoded) {
            user.token = '';
            user.sessionId = "";
            user.cookie = "";
            await user.save();
        } else
            return res.status(404).send({
                ok: false,
                message: `El usuario no existe o no tiene una sesión activa.`,
            });
        req.session.destroy();
        saveLog(req, "log out", "User", user.id, user.id);

        successMsg(res, 200, `Sesión cerrada.`);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

module.exports = {
    signIn,
    signInAdmin,
    verifiedUser,
    updatePasswordUser,
    newPasswordUser,
    emailRecoverPassword,
    recoverPassword,
    changePassword,
    signInGoogleAuthenticator,
    logout
}