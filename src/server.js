/* Librerias necesarias para la aplicación */
const config = require('./config/config');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io');
// const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
/* Mongodb config */
var mdbconf = config.mdbconf;

// IMPORTACION DE LOS DAO´S
const userDAO = require('./DAO/UsersDAO').UserDAO;
const mesaDAO = require('./DAO/MesasDAO').MesasDAO;
const prodDAO = require('./DAO/ProductosDAO').ProductosDAO;
const pedidoDAO = require('./DAO/PedidosDAO').PedidosDAO;

// Para acceder a los parametros de las peticiones POST
// app.use(bodyParser());
app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser.json({  type: 'application/json'}));
app.use(bodyParser.urlencoded({  'extended': true}));


/* Get a mongodb connection and start application */
MongoClient.connect('mongodb://' + mdbconf.host + ':' + mdbconf.port + '/' + mdbconf.db, {
  useUnifiedTopology: true
}, function (err, db) {

  if (err) return new Error('Se ha producido un error al conectar la Base de Datos', err);

  console.log('Conectado a la Base de Datos');

  var usersDAO = new userDAO(db); // Initialize userDAO
  var mesasDAO = new mesaDAO(db);
  var prodsDAO = new prodDAO(db);
  var pedidosDAO = new pedidoDAO(db);

  module.exports = {
    usersDAO,
    mesasDAO,
    prodsDAO,
    pedidosDAO
  }

  app.use(require('../src/routes/index'));
  module.exports.io = io(http);
  require('../src/sockets/socket');

  http.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
  });

});