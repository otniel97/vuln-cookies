// ====================================================
//      EMAIL SERVICE
// ====================================================

const nodemailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');

//config mail
var smtpTrans = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: 1484314697598
    },
    tls: {
        rejectUnauthorized: false
    }
});

smtpTrans.use('compile', handlebars({
    viewEngine: {
        partialsDir: '../templates',
        layoutsDir: '../templates',
        defaultLayout: false
    },
    viewPath: './templates'
}))

async function sendMail(subject, email, template, context) {
    var mailOptions = {
        to: email,
        from: `${process.env.APP_NAME} <process.env.EMAIL_USER>`, //change this
        subject: subject,
        template: template,
        context: context
    };

    smtpTrans.sendMail(mailOptions, function(error) {
        if (error) {
            return false;
        } else
            return true;
    });
}

async function sendContactToAdminMails(users, subject, template, data) {
    if (users.length !== 0) {
        users.forEach((item) => {

            var context = {
                contactEmail: data.contact.email,
                contactName: data.contact.name,
                contactCompany: data.contact.company,
                contactReason: data.contact.reason,
                contactPhone: data.contact.phone,
                email: item.email,
                urlWeb: data.urlWeb,
                url: data.url,
                app: data.app,
                logoVulnhunting: data.logoVulnhunting,
                logoEmail: data.logoEmail
            }

            var mailOptions = {
                to: item.email,
                from: `${process.env.APP_NAME} <process.env.EMAIL_USER>`, //change this
                subject: subject,
                template: template,
                context: context
            };

            smtpTrans.sendMail(mailOptions, function(error) {
                if (error) {
                    return false;
                }
            });
        })
        return true;
    } else
        return true
}

async function sendHackerToAdminMails(users, subject, template, data) {
    if (users.length !== 0) {
        users.forEach((item) => {

            var context = {
                hackerEmail: data.email,
                hackerName: data.hacker.name,
                hackerNickname: data.hacker.nickname,
                hackerPhone: data.hacker.phone,
                email: item.email,
                urlWeb: data.urlWeb,
                url: data.url,
                app: data.app,
                logoVulnhunting: data.logoVulnhunting,
                logoEmail: data.logoEmail
            }

            var mailOptions = {
                to: item.email,
                from: `${process.env.APP_NAME} <process.env.EMAIL_USER>`, //change this
                subject: subject,
                template: template,
                context: context
            };

            smtpTrans.sendMail(mailOptions, function(error) {
                if (error) {
                    return false;
                }
            });
        })
        return true;
    } else
        return true
}

async function sendProgramToAdminMails(users, subject, template, data) {
    if (users.length !== 0) {
        users.forEach((item) => {

            var context = {
                businessName: data.businessName,
                programName: data.programName,
                urlWeb: data.urlWeb,
                app: data.app,
                logoVulnhunting: data.logoVulnhunting,
                logoEmail: data.logoEmail
            }

            var mailOptions = {
                to: item.email,
                from: `${process.env.APP_NAME} <process.env.EMAIL_USER>`, //change this
                subject: subject,
                template: template,
                context: context
            };

            smtpTrans.sendMail(mailOptions, function(error) {
                if (error) {
                    return false;
                }
            });
        })
        return true;
    } else
        return true
}

async function sendReportToAdminMails(users, subject, template, data) {
    if (users.length !== 0) {
        users.forEach((item) => {

            var context = {
                hackerName: data.hackerName,
                programName: data.programName,
                reportTitle: data.reportTitle,
                urlWeb: data.urlWeb,
                app: data.app,
                logoVulnhunting: data.logoVulnhunting,
                logoEmail: data.logoEmail
            }

            var mailOptions = {
                to: item.email,
                from: `${process.env.APP_NAME} <process.env.EMAIL_USER>`, //change this
                subject: subject,
                template: template,
                context: context
            };

            smtpTrans.sendMail(mailOptions, function(error) {
                if (error) {
                    return false;
                }
            });
        })
        return true;
    } else
        return true
}

module.exports = {
    sendMail,
    sendContactToAdminMails,
    sendHackerToAdminMails,
    sendProgramToAdminMails,
    sendReportToAdminMails
}