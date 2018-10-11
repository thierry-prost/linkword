var JSZip = require('jszip');
var cache = require('memory-cache');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');

module.exports.downloadZip = function (req, res, next) {
  try {
    try {
      var headers = cache.get('headers');
      var values = cache.get('values');
    } catch (error) {
      throw new Error('Please upload an Excel file first.');
    }
    if (!headers || !values) {
      throw new Error('Please upload an Excel file first.');
    }
    let fileNames = {};
    setFileNames();
    let newZip = new JSZip();
    let doc;
    values.forEach(function (row, index) {
      try {
        let zip = new JSZip(req.files[0].buffer);
        doc = new Docxtemplater().loadZip(zip);
      } catch (e) {
        throw new Error('Word document format is invalid.');
      }
      let data = {};
      headers.forEach((header, i) => data[header] = row[i]);
      doc.setData(data);
      try {
        doc.render()
      } catch (error) {
        throw new Error("Error rendering the doc template.");
      };
      let file = doc.getZip().generate({
        type: 'nodebuffer'
      })
      newZip.file(fileNames[index], file);
    });
    let folderDir = appData() + '/linkword';
    if (!fs.existsSync(folderDir)) {
      fs.mkdirSync(folderDir);
    }
    let fileDir = folderDir + '/linkword.zip';
    let content = newZip.generate({
      type: 'nodebuffer'
    });
    fs.writeFile(fileDir, content, 'utf8', (err, data) => {
      if (err) {
        throw new Error('Looks like the access to your files is restricted.')
      } else {
        res.download(fileDir);
      }
    });

    function setFileNames() {
      let index = -1;
      headers.forEach(function (h, i) {
        if (['file', 'filename', 'file name'].includes(h.toLowerCase())) {
          index = i;
        }
      });
      if (index == -1) {
        values.forEach((row, i) => fileNames[i] = `File${i}.docx`);
      } else {
        values.forEach((row, i) => fileNames[i] = `${row[index]}.docx`);
      }
    }
  } catch (err) {
    return next(err);
  }
}

function appData() {
  return process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
}
