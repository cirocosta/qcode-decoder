'use strict';

var qr = new QCodeDecoder();

if (!(qr.isCanvasSupported() && qr.hasGetUserMedia())) {
  alert('Your browser doesn\'t match the required specs.');
  throw new Error('Canvas and getUserMedia are required');
}

var elems = [
  {
    target: document.querySelector('#image img'),
    activator: document.querySelector('#image button'),
    decoder: qr.decodeFromImage
  },
  {
    target: document.querySelector('#video video'),
    activator: document.querySelector('#video button'),
    decoder: qr.decodeFromVideo
  },
  {
    target: document.querySelector('#camera video'),
    activator: document.querySelector('#camera button'),
    decoder: qr.decodeFromCamera
  }
];

elems.forEach(function (elem) {
  elem.activator.onclick = function (ev) {
    ev && ev.preventDefault();

    elem.decoder.call(qr, elem.target, function (err, result) {
      if (err) throw err;

      alert('Just decoded: ' + result);
    }, true);
  };
});
