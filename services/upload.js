// ====================================================
//      Service: Upload and get files
// ====================================================

const validType = ['users', 'businesses', 'programs', 'logo', 'reports', 'comments', 'steps'];

let validExtentionImage = ['jpg', 'jpeg', 'png'];

let validExtentionProgram = ['jpg', 'jpeg', 'png', 'docx', 'csv', 'odt', 'pdf', 'apk', 'ipa', 'zip', 'txt'];

const models = require('../models');

const { successMsg, errorMsg } = require('../utils/responses');

const fs = require('fs');

const path = require('path');

let noImagePath = path.resolve(__dirname, '../public/files/no-image.jpg');

let noImageUser = path.resolve(__dirname, '../public/files/user.png');

//=========================================
//Guardar archivos
//=========================================
async function uploadFile(req, res) {

    let type = req.params.type;

    let id = req.params.id;

    let format = req.params.format;

    let fileUploaded = req.files.file; // El input de tener el name file

    if (validType.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Carga de ' + type + ' no permitida.',
                type: type
            }
        });
    }

    let nameTokenFile = fileUploaded.name.split('.');

    let extention = nameTokenFile[nameTokenFile.length - 1].toLowerCase();

    if (format === 'image')
        validExtention = validExtentionImage;
    if (format === 'file')
        validExtention = validExtentionProgram;

    if (validExtention.indexOf(extention) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones válidas son: ' + validExtention.join(', '),
                ext: extention
            }
        });
    }

    let fileName = `${id}-${nameTokenFile[0]}-${ new Date().getMilliseconds() }.${ extention }`

    fileUploaded.mv(`public/files/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    });
    return fileName
}

//=========================================
//Eliminar archivo
//=========================================
let deleteFile = (type, fileName) => {

    let pathImg = path.resolve(__dirname, `../public/files/${ type }/${ fileName }`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

//=========================================
//Obtener archivos
//=========================================
let getFile = (req, res) => {

    let type = req.params.type;
    let file = req.params.fileName;

    let pathImg = path.resolve(__dirname, `../public/files/${ type }/${ file }`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        if (type == 'users') {
            res.sendFile(noImageUser);
        } else {
            res.sendFile(noImagePath);
        }

    }
}

//=========================================
//Descargar archivos
//=========================================
let downloadFile = (req, res) => {
    let file = req.params.fileName;
    let folder = req.params.model;
    let pathFile = path.resolve(__dirname, `../public/files/${folder}/${file}`);

    if (fs.existsSync(pathFile)) {
        res.download(pathFile, file, (err) => {
            if (err)
                errorMsg(res, 500, 'Ha ocurrido un error', error);
        })
    } else
        return res.status(404).json({
            ok: false,
            message: "Archivo no encontrado"
        });
}

module.exports = {
    uploadFile,
    deleteFile,
    getFile,
    downloadFile
}