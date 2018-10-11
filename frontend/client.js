window.onload = function () {
  console.log('a');
  preventDefaults();
  setup('word');
  setup('excel');
  addClicks();
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
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
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
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }, false);
  window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }, false);
}

function upload(files, name) {
  setVisibility('error', 'none');
  let formData = new FormData();
  if (files.length !== 1) {
    throw new Error('Please use only one file at a time.');
  }
  formData.append('file[]', files[0]);
  JSZipUtils.getBinaryContent(name, function (err, data) {
      if (err) {
        handleError(err);
      };
      if (data) {
        saveAs(new Blob([new Uint8Array(data)]), 'linkword.zip');
      }
    },
    formData);
}

function handleError(err) {
  setVisibility('error', 'block');
  document.getElementById('errormessage').innerHTML = err;
  reset();
}

function setVisibility(id, display) {
  let block = document.getElementById(id);
  block.style.display = display;
}

function reset() {
  setOpacity(document.getElementById('word'), 'icon', 1);
  setOpacity(document.getElementById('word'), 'upload', 0);
  setOpacity(document.getElementById('excel'), 'icon', 1);
  setOpacity(document.getElementById('excel'), 'upload', 0);
}

function hardReset() {
  let xhr = new XMLHttpRequest();
  xhr.open('get', 'reset');
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      reset();
      setVisibility('error', 'none');
      setVisibility('copyright', 'none');
    }
  };
  xhr.send(null);
}

function addClicks() {
  document.getElementById('copyright-icon').addEventListener('click', function () {
    toggle();
  });
  document.getElementById('refresh').addEventListener('click', function () {
    hardReset();
  });
  document.getElementById('contact').addEventListener('click', function () {
    window.location.href = "mailto:thierry.prost@quantech.eu";
  });
}

function toggle() {
  let copyRight = document.getElementById('copyright');
  console.log(copyright.style.display);
  if (copyRight.style.display == 'none' || copyRight.style.display == '') {
    copyRight.style.display = 'block';
  } else {
    copyright.style.display = 'none';
  }
}