const static = require('./controllers/static');
const excel = require('../backend/controllers/excel');
const word = require('../backend/controllers/word');
const multer = require('multer');
var upload = multer({
  storage: multer.memoryStorage()
});

module.exports = function (app) {
  app.post('/excel', upload.any(), excel.cache);
  app.post('/word', upload.any(), word.downloadZip)
  app.get('/', static.loadIndex);
  app.get(/([a-zA-Z0-9\s_\\.\-\(\):])+(.css|.js|.html)$/, static.loadStatic);
}
