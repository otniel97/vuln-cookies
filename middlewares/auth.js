// ====================================================
//      Middleware Auth
// ====================================================

const jwt = require('jsonwebtoken');
const { decrypt } = require('../utils/hash');
const User = require('../models').User;

//======================================
//Middleware para usuario autenticado
//======================================
async function authenticate(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            ok: false,
            message: "No se ha encontrado header de autorización"
        });
    }
    console.log("headers1", req.headers)
    const cookies = req.cookies['connect.sid'];
    req.headers.sessionId = req.headers.sessionid;
    console.log("headers2", req.headers)
    console.log(req.cookies)

    if (!req.headers.sessionId || !cookies) //Verificar cookies ---- cookies || req.headers.cookies
        return res.status(400).send({
        ok: false,
        message: `Error del cliente`,
    });

    var token = req.headers.authorization.split(" ")[1];
    token = JSON.parse(decrypt(token));

    jwt.verify(token, process.env.SEED, (error, data) => {
        if (error) {
            if (error.name == 'TokenExpiredError')
                return res.status(401).json({
                    ok: false,
                    message: "Su sesión ha expirado"
                });
            else
                return res.status(500).json({
                    ok: false,
                    message: "Ha ocurrido un error",
                    error: 'token manipulado'
                });
        }
        req.user = data.access;
    });
    const user = await User.findOne({ where: { id: req.user.id, token, sessionId: req.headers.sessionId } });
    if (!user)
        return res.status(401).json({
            ok: false,
            message: "Su sesión ha expirado, ingrese nuevamente"
        });
    if (user.cookie === null || user.cookie === "") {
        user.cookie = cookies || req.headers.cookie;
        await user.save();
    } else {
        if (user.cookie != (cookies || req.headers.cookie))
            return res.status(401).json({
                ok: false,
                message: "Su sesión ha expirado, ingrese nuevamente"
            });
    }
    next();
}

//======================================
//Middleware para verificar usuario
//======================================
async function verified(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({
            ok: false,
            message: "No se ha encontrado header de autorización"
        });
    }

    var token = req.headers.authorization.split(" ")[1];
    token = JSON.parse(decrypt(token));

    jwt.verify(token, process.env.SEED, (error, data) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                message: "Ha ocurrido un error",
                error: 'token manipulado'
            });
        }
        let access = data.access;
        req.userId = access.userId;
        req.email = access.email;
    });
    const user = await User.findOne({ where: { id: req.userId, email: req.email, token } });
    if (!user)
        return res.status(401).json({
            ok: false,
            message: "Token para recuperación de contraseña expirado"
        });
    next();
}

//======================================
// Verificar ADMIN_ROLE
//======================================
let verifiedAdminRol = (req, res, next) => {
    if (req.user.roleId == 1) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'No tiene permisos para realizar esta operación'
        });
    }
};

//======================================
// Verificar Hacker_ROLE
//======================================
let verifiedHackerRol = (req, res, next) => {
    if (req.user.roleId == 2) {
        let id = req.params.id || req.params.hackerId;
        if (id != null && id != undefined && req.user.Hacker.id != id) {
            return res.status(403).json({
                ok: false,
                message: 'No tiene permisos para realizar esta operación'
            });
        }
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'No tiene permisos para realizar esta operación'
        });
    }
};

//======================================
// Verificar Business_ROLE
//======================================
let verifiedBusinessRol = (req, res, next) => {
    if (req.user.roleId == 3) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'No tiene permisos para realizar esta operación'
        });
    }
};

//=========================================
// Verificar Autenticación de doble factor
//=========================================
let verifiedTwoFactor = (req, res, next) => {
    if (req.user.googleAuthenticator == 1) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Para acceder a estos servicios, debe activar la autenticación de doble factor'
        });
    }
};

//=========================================
// Verificar permisos para program
//=========================================
let verifiedProgramPermission = (req, res, next) => {
    if (req.user.roleId == 1 || req.user.roleId == 3) {
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'No tiene permisos para realizar esta operación'
        });
    }
};

//=========================================
// Verificar permisos para admin y hacker
//=========================================
let verifiedAdminHacker = (req, res, next) => {
    if (req.user.roleId == 1 || req.user.roleId == 2) {
        if (req.user.roleId == 2) {
            let id = req.params.id || req.params.hackerId;
            if (id != null && id != undefined && req.user.Hacker.id != id) {
                if (req.user.Hacker.id != id) {
                    return res.status(403).json({
                        ok: false,
                        message: 'No tiene permisos para realizar esta operación'
                    });
                }
            }
        }
        next();
    } else {
        return res.status(403).json({
            ok: false,
            message: 'No tiene permisos para realizar esta operación'
        });
    }
};

module.exports = {
    authenticate,
    verified,
    verifiedAdminRol,
    verifiedHackerRol,
    verifiedBusinessRol,
    verifiedTwoFactor,
    verifiedProgramPermission,
    verifiedAdminHacker
}