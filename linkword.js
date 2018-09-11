const express = require('express');
var app = express();

require('./backend/routes')(app);

app.listen(3000);