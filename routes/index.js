// ====================================================
//      Rutas API
// ====================================================

const express = require('express');
const app = express();

//archivo de rutas de modelo role
app.use('/role', require('./role'));

//archivo de rutas de modelo user
app.use('/user', require('./user'));

//archivo de rutas de authentication
app.use('/auth', require('./auth'));

//archivo de rutas de files
app.use('/file', require('./file'));

//archivo de rutas de hackers
app.use('/hacker', require('./hacker'));

//archivo de rutas de business
app.use('/business', require('./business'));

//archivo de rutas de contact
app.use('/contact', require('./contact'));

//archivo de rutas de contact
app.use('/twofactor', require('./twoFactor'));

//archivo de rutas de asset type
app.use('/assettype', require('./assetType'));

//archivo de rutas de program
app.use('/program', require('./program'));

//archivo de rutas de vulnerabilitytype
app.use('/vulnerabilitytype', require('./vulnerabilityType'));

//archivo de rutas de log
app.use('/log', require('./log'));

//archivo de rutas de log
app.use('/paymentparameter', require('./paymentParameter'));

//archivo de rutas de ranking
app.use('/ranking', require('./ranking'));

//archivo de rutas de hackerInvitation
app.use('/hackerInvitation', require('./hackerInvitation'));

//archivo de rutas de vulnerabilityReport
app.use('/vulnerabilityReport', require('./vulnerabilityReport'));

//archivo de rutas de vulnConfiguration
app.use('/vulnConfiguration', require('./vulnConfiguration'));

//archivo de rutas de notification
app.use('/notification', require('./notification'));

//archivo de rutas de moneyFlow
app.use('/moneyFlow', require('./moneyFlow'));

module.exports = app;