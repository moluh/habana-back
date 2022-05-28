const express = require("express");
const app = express();
const { mesasDAO } = require("../server");
const bodyParser = require("body-parser");
const mw = require("../middlewares/isAllowed");
const { ADMIN, COCINERO, MOZO } = require("../constants/roles");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/v1/mesas", mw.isAllowed([ADMIN]), function (req, res) {
    let mesa = req.body;

    mesasDAO.post(mesa, function (err, mesa) {
        if (err) {
            res.send({
                error: true,
                err: err,
            });
        } else {
            res.json(mesa);
        }
    });
});

app.get("/api/v1/mesas", mw.isAllowed([COCINERO, MOZO]), function (req, res) {
    mesasDAO.getAll(function (err, mesa) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(mesa);
    });
});

app.get(
    "/api/v1/mesa/:id",
    mw.isAllowed([COCINERO, MOZO]),
    function (req, res) {
        let id = req.params.id;

        mesasDAO.getById(id, function (err, mesa) {
            if (err) {
                return res.status(400).json(err);
            }
            res.json(mesa);
        });
    }
);

app.put("/api/v1/mesas", mw.isAllowed([ADMIN]), function (req, res) {
    let mesa = req.body;

    mesasDAO.put(mesa, function (err, mesa) {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(mesa);
    });
});

app.delete("/api/v1/mesas/:id", mw.isAllowed([ADMIN]), function (req, res) {
    let id = req.params.id;

    mesasDAO.delete(id, function (err, mesa) {
        if (err) {
            return res.status(400).json(err);
        }
        console.log(`Mesa: "${mesa.numero}" eliminada!`);
        res.json(mesa);
    });
});

module.exports = app;
