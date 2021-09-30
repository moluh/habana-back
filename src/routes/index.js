const express = require('express');
const app = express();

app.use(require('./mesas'));
app.use(require('./pedidos'));
app.use(require('./productos'));
app.use(require('./usuarios'));
app.use(require('./login'));

module.exports = app;
