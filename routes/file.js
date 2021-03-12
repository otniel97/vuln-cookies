// ======================================================
//      Routes API: Files (images, apk and others files)
// ======================================================

const express = require('express');
const uploadService = require('../services/upload');
const { authenticate } = require('../middlewares/auth.js');
const api = express.Router();

// ===========================================================
// Obtener archivos type: modelo, fileName: nombre de archivo
// ===========================================================
api.get('/:type/:fileName', uploadService.getFile);

// ===========================================================
// Descargar archivos type: modelo, fileName: nombre
// ===========================================================
api.get('/download/:model/:fileName', authenticate, uploadService.downloadFile);

module.exports = api;