/**
 * Basic interface for dealing with the qrCode
 */

function initializeQrCapture () {
	'use strict';


	var qr = new QRCodeDecoder();

	if (qr.isCanvasSupported() || qr.hasGetUserMedia()) {
		qr.prepareCanvas(800,600);
		qrcode.callback = function(a) {
			console.log(a);
		};
	}

	qr.setWebcam(document.querySelector('video'));

	document.querySelector('button').onclick = function () {
		qr.setWebcam(document.querySelector('video'));
	}
}

initializeQrCapture();
