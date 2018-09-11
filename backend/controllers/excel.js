var xlsx = require('xlsx');
var mcache = require('memory-cache');

module.exports.cache = function (req, res) {
  let workbook = readWorkbook(req);
  let worksheet = verifyWorkbook(workbook);
  let data = readWorksheet(worksheet);
  mcache.put('headers', data.headers);
  mcache.put('values', data.values);
  res.sendStatus(200);
};

function readWorkbook(req) {
  try {
    return xlsx.read(req.files[0].buffer);
  } catch (error) {
    throw new Error('This Excel format is invalid.');
  }
}

function verifyWorkbook(workbook) {
  if (Object.keys(workbook.Sheets).length > 1) {
    throw new Error('There are multiple worksheets in your Excel file.');
  }
  if (Object.keys(workbook.Sheets).length < 1) {
    throw new Error('No worksheet found in your Excel file.');
  }
  return workbook.Sheets[workbook.SheetNames[0]];
}

function readWorksheet(sheet) {
  let values = [];
  let headers = [];
  let range = xlsx.utils.decode_range(sheet['!ref']);

  let validColumns = [];
  for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
    let cell = sheet[xlsx.utils.encode_cell({
      r: 0,
      c: colNum
    })];
    if (typeof cell !== 'undefined') {
      validColumns.push(colNum);
      headers.push(cell.w);
    }
  }
  for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
    let row = [];
    validColumns.forEach(function (colNum) {
      let nextCell = sheet[
        xlsx.utils.encode_cell({
          r: rowNum,
          c: colNum
        })
      ];
      if (typeof nextCell === 'undefined') {
        return;
      } else {
        if (nextCell.t == 'b') {
          row.push(nextCell.v);
        } else {
          row.push(nextCell.w);
        }
      }
    })
    values.push(row);
  }
  return {
    headers: headers,
    values: values
  };
}
