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

    if (app.get('env') === 'production') {
        sessionCookie.cookie.domain = process.env.COOKIE_SESSION_DOMAIN;
        sessionCookie.cookie.secure = true;
        sessionCookie.cookie.httpOnly = false;
        sessionCookie.cookie.sameSite = 'none';
    }

    console.log(sessionCookie)

    return sessionCookie;
}


module.exports = {
    getSessionCredentials
}