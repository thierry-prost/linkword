var express = require('express');
var app = express();
var Server = require('http').Server;
var server = new Server(app);
console.log('You can now use this tool in any browser at http://localhost:3000');

server.listen(3000);

require('./backend/routes')(app);