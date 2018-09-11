const fs = require('fs');

exports.loadStatic = function (req, res) {
  var response = fs.createReadStream(__dirname + '/../../frontend' + req.url, 'utf8');
  response.pipe(res);
}

exports.loadIndex = function (req, res) {
  if(!req.url || req.url !='/') {
    throw new Error('Invalid routing.');
  }
  var response = fs.createReadStream(__dirname + '/../../frontend/index.html', 'utf8');
  response.pipe(res);
}