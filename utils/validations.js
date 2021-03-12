// ====================================================
//      Validations
// ====================================================

const moment = require('moment');
const passwordValidator = require('password-validator');
const axios = require('axios');

function isHexColor(str) {
    var pattern = new RegExp("^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$");
    return !!pattern.test(str)
}

function validatePassword(password) {
    const validator = new passwordValidator();
    validator
        .is().min(20) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().uppercase(2) // Must have uppercase letters
        .has().lowercase(2) // Must have lowercase letters
        .has().digits(2) // Must have at least 2 digits
        .has().symbols(2)
        .has().not().spaces() // Should not have spaces

    return validator.validate(password)
}

function validateExpirationDate(date) {
    const expiration = moment(date).format('YYYY-MM-DD');
    const today = moment(new Date()).format('YYYY-MM-DD');
    const day = moment(expiration).diff(moment(today), 'days');
    return day;
}

function validateJobExpirationDate(date) {
    const expiration = moment(date, "YYYY-MM-DD").add(1, 'days');
    const today = moment(new Date()).format('YYYY-MM-DD');
    const day = moment(expiration).diff(moment(today), 'days');
    return day;
}

function validateInvitationAccess(req, invitation) {
    let check = true;
    if (req.user.businessId != undefined && req.user.businessId != null) {
        if (invitation.Program.businessId != req.user.businessId)
            check = false;
    }
    if (req.user.roleId === 2) {
        if (invitation.Hacker.userId != req.user.id)
            check = false;
    }
    return check;
}

async function validateCaptcha(req) {
    let check = true;
    if (req.body.tokenCaptcha === undefined || req.body.tokenCaptcha === '' || req.body.tokenCaptcha === null)
        check = false;

    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.GOOGLE_RECAPTCHA + "&response=" + req.body.tokenCaptcha + "&remoteip=" + req.connection.remoteAddress;

    const response = await axios.post(verificationURL);

    if (response.data.success === undefined || response.data.success === null || !response.data.success)
        check = false;

    return check;
}

module.exports = {
    isHexColor,
    validatePassword,
    validateExpirationDate,
    validateJobExpirationDate,
    validateInvitationAccess,
    validateCaptcha
}