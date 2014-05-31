/**
 * Basic interface for dealing with the qrCode
 */

'use strict';

var qr = new QRCodeDecoder();

if (qr.isCanvasSupported() || qr.hasGetUserMedia()) {
  qr.prepareCanvas(document.querySelector('canvas'), 800,600);
  qr.setDecoderCallback(function (a) {
    console.log(a);
  });
}

qr.prepareVideo(document.querySelector('video'));

document.querySelector('button').onclick = function () {
  qr.prepareVideo(document.querySelector('video'));
}
