const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { usersDAO } = require('../server');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/v1/login', function (req, res) {
    const { username, password } = { ...req.body };
    
    usersDAO.validateLogin(username, password, function (err, user) {
        if (err) {
            return res.send({
                'error': true,
                'msg': err
            });
        } else {
            res.send({ 'error': false, 'user': user });
        }
    });
});

module.exports = app;