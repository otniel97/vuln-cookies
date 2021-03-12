// ====================================================
//       Job Hacker Invitation
// ====================================================

const cron = require('node-cron');
const { validateJobExpirationDate } = require('../utils/validations');
const HackerInvitation = require('../models').HackerInvitation;


//================================================
// Validar expiración de invitaciones a programas
//================================================
const expirationInvitations = cron.schedule('1 0 * * *', async function() {

    const invitations = await HackerInvitation.findAll({ where: { status: 1 } })

    const expiredInvitations = invitations.filter(invitation =>
        validateJobExpirationDate(invitation.expirationDate) <= 0);

    if (expiredInvitations.length > 0)
        expiredInvitations.forEach((invitation) => {
            HackerInvitation.update({ status: 0 }, { where: { id: invitation.id } });
        });
}, {
    scheduled: true,
    timezone: "America/Bogota"
});

module.exports = {
    expirationInvitations
}