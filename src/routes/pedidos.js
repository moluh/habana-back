const express = require("express");
const app = express();
const { pedidosDAO } = require("../server");
const bodyParser = require("body-parser");
const mw = require("../middlewares/isAllowed");
const { ADMIN, COCINERO, MOZO } = require("../constants/roles");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());

app.post(
    "/api/v1/pedidos",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        let pedido = req.body;

        pedidosDAO.post(pedido, function (err, pedido) {
            if (err) {
                res.send({
                    error: true,
                    err: err,
                });
            } else {
                res.json(pedido);
            }
        });
    }
);

app.get("/api/v1/pedidos", mw.isAllowed([COCINERO, MOZO]), function (req, res) {
    pedidosDAO.getAll(function (err, pedidos) {
        if (err) return res.status(400).json(err);

        res.json(pedidos);
    });
});

app.get(
    "/api/v1/pedido/:id",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        let id = req.params.id;

        pedidosDAO.getById(id, function (err, pedido) {
            if (err) return res.status(400).json(err);

            res.json(pedido);
        });
    }
);

app.get(
    "/api/v1/pedidos/PendAndEnt",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        pedidosDAO.getPendAndEnt(function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos);
        });
    }
);

app.get(
    "/api/v1/pedidos/pendientes",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        pedidosDAO.getPendientes(function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos);
        });
    }
);

app.get(
    "/api/v1/pedidos/entregados",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        pedidosDAO.getEntregados(function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos);
        });
    }
);

app.get(
    "/api/v1/pedidos/listos",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        pedidosDAO.getListos(function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos);
        });
    }
);

app.get(
    "/api/v1/pedidos/mozo/:id",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        let id = req.params.id;
        pedidosDAO.getPedidoMozo(id, function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos);
        });
    }
);

app.put("/api/v1/pedidos", mw.isAllowed([COCINERO, MOZO]), function (req, res) {
    let pedido = req.body;
    pedidosDAO.put(pedido, function (err, pedidos) {
        if (err) return res.status(400).json(err);

        res.json(pedidos);
    });
});

app.delete(
    "/api/v1/pedido/:id",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        let id = req.params.id;

        pedidosDAO.deleteOne(id, function (err, pedido) {
            if (err) return res.status(400).json(err);

            res.json(pedido);
        });
    }
);

app.delete(
    "/api/v1/pedidos/deleteAll",
    mw.isAllowed([ADMIN]),
    function (req, res) {
        pedidosDAO.deleteAll(function (err, pedidos) {
            if (err) return res.status(400).json(err);

            res.json(pedidos.deletedCount);
        });
    }
);

module.exports = app;
