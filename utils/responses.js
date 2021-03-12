// ====================================================
//      Messages Response
// ====================================================

const successMsg = (res, code, message, data) => {
    return res.status(code).json({
        ok: true,
        message,
        data
    });
}

const errorMsg = (res, code, message, error) => {
    return res.status(code).json({
        ok: false,
        message,
        err: { message: error.errors[0].message || error.message }
    });
}

const exceptionMsg = (res, id, entity) => {
    return res.status(404).json({
        ok: false,
        message: `Registro de ${entity} con id: ${id} no encontrado`
    });
}

const unauthhorized = (res) => {
    return res.status(403).send({
        ok: false,
        message: 'Búsqueda no encontrada'
    });
}

module.exports = {
    successMsg,
    errorMsg,
    exceptionMsg,
    unauthhorized
}