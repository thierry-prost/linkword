var JSZip = require('jszip');
var cache = require('memory-cache');
var Docxtemplater = require('docxtemplater');
var fs = require('fs');

module.exports.downloadZip = function (req, res) {
  try {
    var headers = cache.get('headers');
    var values = cache.get('values');
  } catch (error) {
    throw new Error('Please upload an Excel file first.');
  }
  if (!headers || !values) {
    throw new Error('Please upload an Excel file first.');
  }
  var fileNames = {};
  setFileNames();
  var newZip = new JSZip();
  values.forEach(function (row, index) {
    let zip = new JSZip(req.files[0].buffer);
    let doc = new Docxtemplater().loadZip(zip);
    let data = {};
    headers.forEach((header, i) => data[header] = row[i]);
    doc.setData(data);
    try {
      doc.render()
    } catch (error) {
      throw new Error(error.message);
    };
    let file = doc.getZip().generate({
      type: 'nodebuffer'
    })
    newZip.file(fileNames[index], file);
  });
  let folderDir = appData() + '/linkword';
  let fileDir = folderDir + '/linkword.zip';
  var content = newZip.generate({
    type: "nodebuffer"
  });
  fs.writeFile(fileDir, content, 'utf8', (err, data) => {
    if (err) {
    } else {
      res.sendFile(fileDir);
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
}

function appData() {
  return process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + 'Library/Preferences' : '/var/local');
}
