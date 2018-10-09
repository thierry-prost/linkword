window.onload = function () {
    preventDefaults();
    setup('word');
    setup('excel');
}

function excel() {
    setup('excel');
}

function word() {
    setup('word');
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
    let formData = new FormData(),
        xhr = new XMLHttpRequest();
    if (files.length !== 1) {
        throw new Error('Please use only one file at a time.');
    }
    formData.append('file[]', files[0]);

    xhr.onload = function () {
        if (this.getResponseHeader('content-type') == 'application/zip') {
            saveData(blob = new Blob([str2bytes(this.response)], {
                type: "octet/stream"
            }));
        }
    }
    xhr.open('post', name);
    xhr.send(formData);
}

function saveData(blob) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'linkword.zip';
    a.click();
    window.URL.revokeObjectURL(url);
}

function str2bytes(str) {
    var bytes = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}
