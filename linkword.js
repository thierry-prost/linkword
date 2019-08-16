var express = require('express');
var app = express();
var Server = require('http').Server;
var server = new Server(app);
server.listen(3000);

require('./backend/routes')(app);
