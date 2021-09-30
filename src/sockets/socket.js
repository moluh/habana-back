const {
    io
} = require('../server');
const {
    pedidosDAO
} = require('../server');

io.on('connection', function (socket) {

    console.log('Nuevo socket');

    socket.on('post-pedidos', function (pedido) {
        console.log('POST PEDIDOS SOCKET');
        pedidosDAO.post(pedido, function (err, peds) {
            io.emit('post-pedidos', peds);
        });
    });

    socket.on('get-pedidos', function () {
        console.log('GET PENDIENTES SOCKET');
        pedidosDAO.getPendientes(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');
            io.emit('get-pedidos', peds);
        });
    });

    socket.on('get-pedidos-all', function () {
        console.log('GET PEDIDOS ALL SOCKET');
        pedidosDAO.getAll(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');
            io.emit('get-pedidos-all', peds);
        });
    });

    socket.on('get-pedidos-listos', function () {
        console.log('GET LISTOS SOCKET');
        pedidosDAO.getEntregados(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');
            io.emit('get-pedidos-listos', peds);
        });
    });

    socket.on('update-pedido', function (pedido) {
        console.log('UPDATE PEDIDO SOCKET');
        pedidosDAO.put(pedido, function (err, peds) {
            io.emit('update-pedido', peds);
        });
    });

    socket.on('disconnect', function () {
        console.log('Socket desconectado');
    });


});