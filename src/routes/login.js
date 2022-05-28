const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { usersDAO } = require("../server");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/v1/login", async function (req, res) {
    const { username, password } = { ...req.body };
    usersDAO.validateLogin(username, password, function (err, usuario) {
        if (err) {
            return res.send(err);
        } else {
            res.send(usuario);
        }
    });
});

module.exports = app;
