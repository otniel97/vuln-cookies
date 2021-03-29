// ====================================================
//      Cookie Sessions
// ====================================================


// ====================================================
//      Objeto de configuración para cookie sessions
// ====================================================
function getSessionCredentials(app) {
    const sessionCookie = {
        secret: process.env.COOKIE_SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            path: '/',
            maxAge: parseInt(process.env.COOKIE_SESSION_EXPIRATION)
        }
    };


    return sessionCookie;
}


module.exports = {
    getSessionCredentials
}