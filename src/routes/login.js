const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { usersDAO } = require('../server');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/v1/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    usersDAO.validateLogin(username, password, function (err, user) {
        if (err) {
            res.send({ 'error': true, 'err': err });
        }
        else {
        
            res.send({ 'error': false, 'user': user });
        }
    });
});

module.exports = app;