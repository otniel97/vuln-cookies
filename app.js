// ====================================================
//      Configuración del servidor
// ====================================================

require('./.env')

require('dotenv').config();

const express = require('express');

const session = require('express-session');

const cookieParser = require('cookie-parser');

const json = require('express');

const morgan = require('morgan');

const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

const cors = require('cors');

const requestIp = require('request-ip');

const db = require('./models');

const app = express();

const path = require('path');

const { getSessionCredentials } = require('./utils/sessions');

//ver peticiones por consola
app.use(morgan('dev'));

//obtener resultados de peticiones en formato json
app.use(json());

//Ip request
app.use(requestIp.mw());
app.set('trust proxy', 1)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Habilitar carpeta publica
app.use(express.static(path.resolve(__dirname, './public')));

// carga de archivos
app.use(fileUpload());

app.disable('x-powered-by');

// express cookie session
app.use(session(getSessionCredentials(app)));

app.use(cookieParser());

//Habilitar cors
const corsOptions = {
    origin: [process.env.CLIENT_CORS_URL, 'http://localhost:3001'],
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

//configuración global de rutas
app.use(require('./routes/index'));

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Jobs invitaciones
const job = require('./jobs/hackerInvitation');

db.sequelize.authenticate().then(() => {
        console.log('Conectado a base de datos')
        app.listen(process.env.PORT, () => {
            console.log('Escuchando el puerto:', 3000);
        });
    })
    .catch(err => {
        console.log('Error de conexión a base de datos: ', err);
    })

module.exports = app;