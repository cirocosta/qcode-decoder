function QRCodeDecoder () {
  this.tmrCapture = null;
  this.canvasElem = null;
}

QRCodeDecoder.prototype.prepareCanvas = function (canvasElem, width, height) {
  canvasElem.style.width = width + "px";
  canvasElem.style.height = height + "px";
  canvasElem.width = width;
  canvasElem.height = height;

  this.canvasElem = canvasElem;

  return canvasElem;
};

QRCodeDecoder.prototype.captureToCanvas = function () {
  var scope = this;

  if (this.tmrCapture) {
    clearTimeout(this.tmrCapture);
  }

  var gCtx = this.canvasElem.getContext("2d");
  gCtx.clearRect(0, 0, this.canvasElem.width, this.canvasElem.height);

  try{
    gCtx.drawImage(this.videoElem,0,0);
    try{
      qrcode.decode();
    }
    catch(e){
      console.log(e);
      this.tmrCapture = setTimeout(function () {
        scope.captureToCanvas.apply(scope, null);
      }, 500);
    }
  }
  catch(e){
      console.log(e);
      this.tmrCapture = setTimeout(function () {
        scope.captureToCanvas.apply(scope, null);
      }, 500);
  }
};

QRCodeDecoder.prototype.hasGetUserMedia = function () {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

QRCodeDecoder.prototype.isCanvasSupported = function () {
  var elem = document.createElement('canvas');

  return !!(elem.getContext && elem.getContext('2d'));
};

QRCodeDecoder.prototype.prepareVideo = function(videoElem) {
  var scope = this;

  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video:true, audio:false}, function (stream) {
      videoElem.src = window.URL.createObjectURL(stream);
      scope.videoElem = videoElem;
      setTimeout(function () {
        scope.captureToCanvas.apply(scope, null);
      }, 500);
    }, function (err) {
      console.log("An error occurred while getting video stream: ", err);
    });
  } else {
    console.log('Couldn\'t get video from camera');
  }

  setTimeout(function () {
    scope.captureToCanvas.apply(scope, null);
  }, 500);
};

QRCodeDecoder.prototype.setDecoderCallback = function (cb) {
  qrcode.callback = cb;
};
