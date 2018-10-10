window.onload = function () {
  preventDefaults();
  setup('word');
  setup('excel');
}

function setup(id) {
  var dropzone = document.getElementById(id);

  dropzone.ondragover = function () {
    this.className = 'drop dragover';
    setOpacity(this, 'icon', 0.4);
    setOpacity(this, 'upload', 0.7);
  }
  dropzone.ondragleave = function () {
    this.className = 'drop';
    setOpacity(this, 'icon', 1);
    setOpacity(this, 'upload', 0);
  }
  dropzone.ondrop = function (e) {
    e.preventDefault();
    upload(e.dataTransfer.files, id);
  }
}

function setOpacity(el, name, opacity) {
  let query = el.getElementsByClassName(name);
  if (opacity == 0 || opacity == '0') {
    [].forEach.call(query, function (e) {
      e.style.visibility = 'hidden';
    });
  } else {
    [].forEach.call(query, function (e) {
      e.style.visibility = 'visible';
    });
  }
  [].forEach.call(query, function (e) {
    e.style.opacity = opacity;
  });
}

function preventDefaults() {
  window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
  }, false);
  window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
  }, false);
}

function upload(files, name) {
  let formData = new FormData();
  if (files.length !== 1) {
    throw new Error('Please use only one file at a time.');
  }
  formData.append('file[]', files[0]);
  try {
    JSZipUtils.getBinaryContent(name, function (err, data) {
        if (err) {
          throw err;
        };
        saveAs(new Blob([new Uint8Array(data)]), 'linkword.zip');
      },
      formData);
  } catch (err) {
    handleError(err);
  }
}

function handleError(err){
  console.log('hi');
}
