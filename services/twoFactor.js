// ====================================================
//      TWO FACTOR SERVICE
// ====================================================
const TwoFactor = require('../models').TwoFactor;
const RefactorCode = require('../models').RefactorCode;
const User = require('../models').User;
const db = require('../models/index');
const speakeasy = require('speakeasy');
const qrCode = require('qrcode');
const { successMsg, errorMsg } = require('../utils/responses');
const { compareHash, encrypt } = require('../utils/hash');
const { sendMail } = require('./email');
const jwt = require('jsonwebtoken');
const { saveLog } = require('./log');

//======================================
// Generar secret key para two factor
//======================================
async function generateSecret(req, res) {
    try {
        const user = await User.findOne({ where: { id: req.user.id } })
        const secret = speakeasy.generateSecret({
            name: `${process.env.APP_NAME} (${user.email})`,
        });
        qrCode.toDataURL(secret.otpauth_url, function(err, image_data) {
            if (err)
                return res.status(409).send({
                    ok: false,
                    message: `Fallo al generar qrCode`
                });
            const key = {
                secret: secret.ascii,
                qrCode: image_data,
                refactorCodes: generateCodes()
            }
            successMsg(res, 200, `Llave secreta para Two Factor`, key);
        });
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }

}

//============================================
// Verificar nueva secret key para two factor
//============================================
async function verifyNewSecret(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!compareHash(req.body.password, user.password)) //verificar contraseña
            return res.status(400).send({
            ok: false,
            message: `Contraseña incorrecta`
        });

        const code = req.body.refactorCodes.filter(code => {
            return code === req.body.code;
        })
        if (code.length == 0)
            return res.status(409).send({
                ok: false,
                message: `Código de recuperación fallido`
            });

        const verified = speakeasy.totp.verify({
            secret: req.body.secret,
            encoding: 'ascii',
            token: req.body.token,
            window: 240
        });
        if (!verified)
            return res.status(409).send({
                ok: false,
                message: `Verificación fallida`
            });

        let newTwoFactor = {
            secret: req.body.secret,
            qrUrl: req.body.qrUrl,
            userId: user.id,
            status: 1
        }
        const twoFactor = await TwoFactor.create(newTwoFactor, { transaction });
        for (const item of req.body.refactorCodes) {
            let refactorCode = {
                code: item,
                status: 1,
                twoFactorId: twoFactor.id
            }
            await RefactorCode.create(refactorCode, { transaction });
        }

        await transaction.commit();

        user.googleAuthenticator = 1;
        await user.save();
        saveLog(req, "two factor enabled", "TwoFactor", twoFactor.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Autenticación de doble factor habilitada', user.email, 'twoFactorEnabled', context);

        successMsg(res, 200, `Llave secreta para Two Factor verificada`, user);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//==============================================
// Regenerar códigos secretos de recuperación
//==============================================
async function regenerateCodes(req, res) {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user.googleAuthenticator != 1) //verificar 2FA enabled
            return res.status(409).send({
            ok: false,
            message: `No posee habilitado los servicios de 2FA Google Authenticator`
        });
        codes = generateCodes();
        if (!codes)
            return res.status(409).send({
                ok: false,
                message: `Fallo al generar nuevos códigos`
            });
        successMsg(res, 200, `Códigos de recuperación nuevos`, codes);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//============================================
// Verificar nuevos códigos de recuperación
//============================================
async function verifyRegenerateCodes(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{
                model: TwoFactor,
                require: true,
                include: [RefactorCode]
            }]
        });
        if (!user) //verificar 2FA enabled
            return res.status(409).send({
            ok: false,
            message: `No posee habilitado los servicios de 2FA Google Authenticator`
        });

        if (!compareHash(req.body.password, user.password)) //verificar contraseña
            return res.status(400).send({
            ok: false,
            message: `Contraseña incorrecta`
        });

        const code = req.body.refactorCodes.filter(code => {
            return code === req.body.code;
        })
        if (code.length == 0)
            return res.status(409).send({
                ok: false,
                message: `Código de recuperación fallido`
            });

        const verified = speakeasy.totp.verify({
            secret: user.TwoFactor.secret,
            encoding: 'ascii',
            token: req.body.token,
            window: 240
        });
        if (!verified)
            return res.status(409).send({
                ok: false,
                message: `Verificación fallida`
            });

        await RefactorCode.destroy({ where: { twoFactorId: user.TwoFactor.id }, transaction })
        for (const item of req.body.refactorCodes) {
            let refactorCode = {
                code: item,
                status: 1,
                twoFactorId: user.TwoFactor.id
            }
            await RefactorCode.create(refactorCode, { transaction });
        }

        await transaction.commit();
        saveLog(req, "two factor refactor", "TwoFactor", user.TwoFactor.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Códigos de Autenticación de doble factor regenerados', user.email, 'twoFactorRegenerate', context);

        successMsg(res, 200, `Códigos de recuperación actualizados`, user);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//======================================
// Deshabilitar two factor authenticator
//======================================
async function twoFactorDisabled(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        let check = false;
        const user = await User.findOne({
            where: { id: req.user.id },
            include: [{
                model: TwoFactor,
                require: true,
                include: [RefactorCode]
            }]
        });

        if (!user) //verificar 2FA enabled
            return res.status(409).send({
            ok: false,
            message: `No posee habilitado los servicios de 2FA Google Authenticator`
        });

        if (!compareHash(req.body.password, user.password)) //verificar contraseña
            return res.status(400).send({
            ok: false,
            message: `Contraseña incorrecta`
        });

        const code = user.TwoFactor.RefactorCodes.filter(item => {
            return item.code === req.body.code;
        })
        if (code.length > 0)
            check = true

        const verified = speakeasy.totp.verify({
            secret: user.TwoFactor.secret,
            encoding: 'ascii',
            token: req.body.token,
            window: 240
        });
        if (verified)
            check = true

        if (check) {
            user.googleAuthenticator = 0;
            await RefactorCode.destroy({ where: { twoFactorId: user.TwoFactor.id }, transaction })
            await TwoFactor.destroy({ where: { userId: user.id }, transaction });
            await user.save();

            await transaction.commit();
            saveLog(req, "two factor disabled", "TwoFactor", user.TwoFactor.id, user.id);

            var context = {
                email: user.email,
                urlWeb: `${process.env.CLIENT_CORS_URL}`,
                logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
                logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
                app: `${process.env.APP_NAME}`
            }
            sendMail('Autenticación de doble factor deshabilitada', user.email, 'twoFactorDisabled', context);

            successMsg(res, 200, `Autenticación de doble factor inhabilitada`, check);
        } else
            return res.status(409).send({
                ok: false,
                message: `No se ha podido deshabilitar la autenticación de doble factor, Credenciales incorrectas`
            });
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//======================================
// Verificar secret key para two factor
//======================================
async function verifySecret(user, token, refactorCode) {
    try {
        let verified = false;

        const twoFactor = await TwoFactor.findOne({
            where: { userId: user.id },
            include: [{
                model: RefactorCode,
                require: true
            }]
        })

        if (token) { //verifica token google authenticator
            verified = speakeasy.totp.verify({
                secret: twoFactor.secret,
                encoding: 'ascii',
                token: token,
                window: 240
            });
        }

        if (refactorCode) { //verifica código de backup
            const code = twoFactor.RefactorCodes.filter(code => {
                return code.code === refactorCode;
            })
            if (code.length > 0)
                verified = true
        }

        if (verified)
            return true;
        else
            return false
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//======================================
// Email para Resetear two factor
//======================================
async function emailResetTwoFactor(req, res) {
    try {
        const id = req.user.id;
        const email = req.user.email;

        const user = await User.findOne({ where: { id, email } });
        if (!user) //Verificar el usuario
            return res.status(404).send({
            ok: false,
            message: `No existe un usuario con este correo electrónico: ${body.email} o contraseña`,
        });
        if (user.googleAuthenticator !== 1) //Verificar el two factor
            return res.status(409).send({
            ok: false,
            message: `No tiene la habilitada la autenticación de doble factor`,
        });

        let access = { userId: user.id, email: user.email };
        let tokenSimple = jwt.sign({ access: access }, process.env.SEED, { expiresIn: process.env.EXPIRATION_EMAIL });
        tokenSimple = encrypt(JSON.stringify(tokenSimple));

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            url: `${process.env.CLIENT_CORS_URL}/twoFactor/reset?token=${tokenSimple}`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Resetear Autenticación de doble factor', user.email, 'resetTwoFactor', context);

        successMsg(res, 200, `Se ha enviado un mensaje a su correo electrónico para confirmar`, tokenSimple);
    } catch (error) {
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

//======================================
// Resetear two factor authenticator
//======================================
async function resetTwoFactor(req, res) {
    let transaction = await db.sequelize.transaction();
    try {
        const user = await User.findOne({
            where: { id: req.userId },
            include: [{
                model: TwoFactor,
                require: true,
                include: [RefactorCode]
            }]
        });

        if (!user.TwoFactor) //verificar 2FA enabled
            return res.status(409).send({
            ok: false,
            message: `No posee habilitado los servicios de 2FA Google Authenticator`
        });

        user.googleAuthenticator = 0;
        await RefactorCode.destroy({ where: { twoFactorId: user.TwoFactor.id }, transaction })
        await TwoFactor.destroy({ where: { userId: user.id }, transaction });
        await user.save();

        await transaction.commit();
        saveLog(req, "two factor reset", "TwoFactor", user.TwoFactor.id, user.id);

        var context = {
            email: user.email,
            urlWeb: `${process.env.CLIENT_CORS_URL}`,
            logoVulnhunting: `${process.env.BACKEND_URL}file/logo/logo1.png`,
            logoEmail: `${process.env.BACKEND_URL}file/logo/email.png`,
            app: `${process.env.APP_NAME}`
        }
        sendMail('Autenticación de doble factor deshabilitada', user.email, 'twoFactorDisabled', context);

        successMsg(res, 200, `Autenticación de doble factor inhabilitada`, true);
    } catch (error) {
        await transaction.rollback();
        errorMsg(res, 500, `lo sentimos hemos cometido un error!`, error);
    }
}

let generateCodes = () => {
    const codes = [];
    for (var i = 1; i <= 5; i++) {
        codes.push(speakeasy.generateSecret().ascii)
    }
    return codes
}

module.exports = {
    generateSecret,
    verifyNewSecret,
    verifySecret,
    regenerateCodes,
    verifyRegenerateCodes,
    twoFactorDisabled,
    emailResetTwoFactor,
    resetTwoFactor
}