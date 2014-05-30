function QRCodeDecoder () {
  this.tmrCapture = null;
}

QRCode.prototype.prepareCanvas = function (canvasElem, width, height) {
  canvasElem.style.width = width + "px";
  canvasElem.style.height = height + "px";
  canvasElem.width = width;
  canvasElem.height = height;

  return canvasElem;
};

QRCode.prototype.captureToCanvas = function (canvasElem) {
  if (this.tmrCapture)
    clearTimeout(this.tmrCapture);

  var gCtx = canvasElem.getContext("2d");
  gCtx.clearRect(0, 0, w, h);

  try{
    gCtx.drawImage(v,0,0);
    try{
      qrcode.decode();
    }
    catch(e){
      console.log(e);
      this.tmrCapture = setTimeout(this.captureToCanvas, 500);
    }
  }
  catch(e){
      console.log(e);
      this.tmrCapture = setTimeout(this.captureToCanvas, 500);
  }
};

QRCode.prototype.hasGetUserMedia = function () {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

QRCode.prototype.isCanvasSupported = function () {
  var elem = document.createElement('canvas');

  return !!(elem.getContext && elem.getContext('2d'));
};

QRCode.prototype.setWebcam = function(videoElem) {
  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video:true, audio:false}, function (stream) {
      videoElem.src = window.URL.createObjectURL(stream);
      setTimeout(this.captureToCanvas, 500);
    }, function (err) {
      console.log("An error occurred while getting video stream: ", err);
    });
  } else {
    alert('Couldn\'t get video from camera :(');
  }

  setTimeout(this.captureToCanvas, 500);
};
