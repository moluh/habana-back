const express = require('express');
const app = express();
const {
    pedidosDAO
} = require('../server');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.post('/api/v1/pedidos', function (req, res) {
    let pedido = req.body;

    pedidosDAO.post(pedido, function (err, pedido) {
        if (err) {
            res.send({
                'error': true,
                'err': err
            });
        } else {
            res.json(pedido);
        }
    });
});

app.get('/api/v1/pedidos', function (req, res) {
    pedidosDAO.getAll(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.get('/api/v1/pedido/:id', function (req, res) {
    let id = req.params.id;

    pedidosDAO.getById(id, function (err, pedido) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedido);
    });
});

app.get('/api/v1/pedidos/PendAndEnt', function (req, res) {
    pedidosDAO.getPendAndEnt(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.get('/api/v1/pedidos/pendientes', function (req, res) {
    pedidosDAO.getPendientes(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.get('/api/v1/pedidos/entregados', function (req, res) {
    pedidosDAO.getEntregados(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.get('/api/v1/pedidos/listos', function (req, res) {
    pedidosDAO.getListos(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.get('/api/v1/pedidos/mozo/:id', function (req, res) {
    let id = req.params.id;
    pedidosDAO.getPedidoMozo(id, function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.put('/api/v1/pedidos', function (req, res) {
    let pedido = req.body;
    pedidosDAO.put(pedido, function (err, pedidos) {

        if (err) 
            return res.status(400).json(err)
        
        res.json(pedidos);
    });
});

app.delete('/api/v1/pedido/:id', function (req, res) {
    let id = req.params.id;

    pedidosDAO.deleteOne(id, function (err, pedido) {
        if (err) 
            return res.status(400).json(err)
        
        res.json(pedido);
    });
});

app.delete('/api/v1/pedidos/deleteAll', function (req, res) {
    pedidosDAO.deleteAll(function (err, pedidos) {
        if (err) 
            return res.status(400).json(err)
                
        res.json(pedidos.deletedCount);
    });
});

module.exports = app;