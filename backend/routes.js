const static = require('./controllers/static');
const excel = require('../backend/controllers/excel');
const word = require('../backend/controllers/word');
const reset = require('../backend/controllers/reset');
const multer = require('multer');
var upload = multer({
  storage: multer.memoryStorage()
});

module.exports = function (app) {
  app.post('/excel', upload.any(), excel.cache, errorHandler);
  app.post('/word', upload.any(), word.downloadZip, errorHandler);
  app.get('/reset', reset.resetCache);
  app.get('/', static.loadIndex);
  app.get(/([a-zA-Z0-9\s_\\.\-\(\):])+(.css|.js|.html)$/, static.loadStatic);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500).send(JSON.stringify({
    error: err.message
  }));
}
