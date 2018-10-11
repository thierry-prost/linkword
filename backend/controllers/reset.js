var mcache = require('memory-cache');

module.exports.resetCache = function (req, res) {
    mcache.del('headers');
    mcache.del('values');
    res.sendStatus(200);

}