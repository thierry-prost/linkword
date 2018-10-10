! function (e) {
  "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : "undefined" != typeof window ? window.JSZipUtils = e() : "undefined" != typeof global ? global.JSZipUtils = e() : "undefined" != typeof self && (self.JSZipUtils = e())
}(function () {
  var define, module, exports;
  return (function e(t, n, r) {
      function s(o, u) {
        if (!n[o]) {
          if (!t[o]) {
            var a = typeof require == "function" && require;
            if (!u && a) return a(o, !0);
            if (i) return i(o, !0);
            throw new Error("Cannot find module '" + o + "'")
          }
          var f = n[o] = {
            exports: {}
          };
          t[o][0].call(f.exports, function (e) {
            var n = t[o][1][e];
            return s(n ? n : e)
          }, f, f.exports, e, t, n, r)
        }
        return n[o].exports
      }
      var i = typeof require == "function" && require;
      for (var o = 0; o < r.length; o++) s(r[o]);
      return s
    })({
      1: [function (require, module, exports) {
        'use strict';

        var JSZipUtils = {};
        JSZipUtils._getBinaryFromXHR = function (xhr) {
          return xhr.response || xhr.responseText;
        };

        function createStandardXHR() {
          try {
            return new window.XMLHttpRequest();
          } catch (e) {}
        }

        function createActiveXHR() {
          try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {}
        }

        var createXHR = window.ActiveXObject ?
          function () {
            return createStandardXHR() || createActiveXHR();
          } :
          createStandardXHR;

        JSZipUtils.getBinaryContent = function (path, callback, data) {
          try {

            var xhr = createXHR();

            xhr.open('POST', path, true);

            if ("responseType" in xhr) {
              xhr.responseType = "arraybuffer";
            }

            if (xhr.overrideMimeType) {
              xhr.overrideMimeType("text/plain; charset=x-user-defined");
            }

            xhr.onreadystatechange = function (evt) {
              var file, err;
              // use `xhr` and not `this`... thanks IE
              if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                  if (xhr.getResponseHeader('content-type') == 'application/zip') {
                    file = null;
                    err = null;
                    try {
                      file = JSZipUtils._getBinaryFromXHR(xhr);
                    } catch (e) {
                      err = new Error("Looks like you closed the terminal (that black window)...?");
                    }
                    callback(err, file);
                  }
                } else {
                  callback(new Error("Looks like you closed the terminal (that black window)...?"), null);
                }
              }
            };

            xhr.onerror = function (err) {
              callback(new Error("Looks like you closed the terminal (that black window)...?"), null);
            }

            xhr.send(data);
          } catch (e) {
            callback(new Error(e), null);
          }
        };
        module.exports = JSZipUtils;
      }, {}]
    }, {}, [1])
    (1)
});;