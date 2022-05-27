/* Librerias necesarias para la aplicación */
const config = require('./config/config');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"]
  }
});

const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
/* Mongodb config */
const mdbconf = config.mdbconf;

// IMPORTACION DE LOS DAO´S
const userDAO = require('./DAO/UsersDAO').UserDAO;
const mesaDAO = require('./DAO/MesasDAO').MesasDAO;
const prodDAO = require('./DAO/ProductosDAO').ProductosDAO;
const pedidoDAO = require('./DAO/PedidosDAO').PedidosDAO;

app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': true }));

/* Get a mongodb connection and start application */
MongoClient.connect('mongodb://' + mdbconf.host + ':' + mdbconf.port + '/' + mdbconf.db, {
  useUnifiedTopology: true
}, function (err, db) {

  if (err) return new Error('Se ha producido un error al conectar la Base de Datos', err);

  console.log('Conectado a la Base de Datos');

  const usersDAO = new userDAO(db); // Initialize userDAO
  const mesasDAO = new mesaDAO(db);
  const prodsDAO = new prodDAO(db);
  const pedidosDAO = new pedidoDAO(db);

  module.exports = {
    usersDAO,
    mesasDAO,
    prodsDAO,
    pedidosDAO
  }

  app.use(require('../src/routes/index'));

  io.on('connection', (socket) => {

    socket.on('disconnect', function () {
      console.log('Socket desconectado');
    });

    socket.on('getAll', function () {
      console.log('--> getAll socket <--');
      pedidosDAO.getAll(function (err, peds) {
        if (err) return console.log('Error al obtener los pedidos');

        io.emit('getAll', peds);
      });
    });

  });

  http.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto:', process.env.PORT);
  });

});