/**
 * Constructor for QRCodeDecoder
 */
function QRCodeDecoder () {
  this.tmrCapture = null;
  this.canvasElem = null;
}

/**
 * Prepares the canvas element (which will receive the image from the
 * camera and provide what the algorithm needs for checking for a
 * QRCode and then decoding it.)
 * @param  {DOMElement} canvasElem the canvas element
 * @param  {number} width      The width that the canvas element
 * should have
 * @param  {number} height     The height that the canvas element
 * should have
 * @return {DOMElement}            the canvas after the resize if
 * width and height provided.
 */
QRCodeDecoder.prototype.prepareCanvas = function (canvasElem, width, height) {
  if (width && height) {
    canvasElem.style.width = width + "px";
    canvasElem.style.height = height + "px";
    canvasElem.width = width;
    canvasElem.height = height;
  }

  qrcode.setCanvasElement(canvasElem);
  this.canvasElem = canvasElem;

  return canvasElem;
};

QRCodeDecoder.prototype._captureToCanvas = function () {
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
      // console.log(e);
      this.tmrCapture = setTimeout(function () {
        scope._captureToCanvas.apply(scope, null);
      }, 500);
    }
  }
  catch(e){
      // console.log(e);
      this.tmrCapture = setTimeout(function () {
        scope._captureToCanvas.apply(scope, null);
      }, 500);
  }
};

/**
 * Verifies if the user has getUserMedia enabled in the browser.
 */
QRCodeDecoder.prototype.hasGetUserMedia = function () {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
};

/**
 * Verifies if canvas element is supported.
 */
QRCodeDecoder.prototype.isCanvasSupported = function () {
  var elem = document.createElement('canvas');

  return !!(elem.getContext && elem.getContext('2d'));
};

/**
 * Prepares the video element for receiving camera's input.
 * @param  {DOMElement} videoElem <video> dom element
 * @param {facing} string which camera to use (optional).
 * @param  {Function} errcb     callback function to be called in case
 *                              of error
 */
QRCodeDecoder.prototype.prepareVideo = function(videoElem, facing, errcb) {
  var scope = this;
  var constraints = {
    video: true,
    audio: false
  };

  console.log("jiadsojioads");

  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    if (!facing) {
      scope.callGUM(videoElem, constraints, scope, errcb);
      return;
    }

    this.getSources(function (sources) {
      for (var i in sources) {
        console.log(sources);
        var source = sources[i];
        if (source.facing === facing) {
          constraints.video = {
            optional: [{sourceId: source.id}]
          }
        }
      }
      scope.callGUM(videoElem, constraints, scope, errcb);
    });
  } else {
    console.log('Couldn\'t get video from camera');
    return;
  }

  setTimeout(function () {
    scope._captureToCanvas.apply(scope, null);
  }, 500);
};

QRCodeDecoder.prototype.callGUM = function (videoElem, constraints, scope, errcb) {

  console.log(errcb);

  navigator.getUserMedia(constraints, function (stream) {
    videoElem.src = window.URL.createObjectURL(stream);

    scope.videoElem = videoElem;
    setTimeout(function () {
      scope._captureToCanvas.apply(scope, null);
    }, 500);
  }, errcb || function(){});
};

QRCodeDecoder.prototype.getSources = function (cb) {
  var constraints = {};
  var videoSources = [];

  MediaStreamTrack.getSources(function (sourceInfos) {
    for (var i = 0; i !== sourceInfos.length; ++i) {
      var sourceInfo = sourceInfos[i];

      if (sourceInfo.kind === 'video') {
        videoSources.push(sourceInfo);
      }
    }

    cb(videoSources);
  });
};

/**
 * Sets the callback for the decode event
 */
QRCodeDecoder.prototype.setDecoderCallback = function (cb) {
  qrcode.callback = cb;
};

QRCodeDecoder.prototype.decodeFromSrc = function(src) {
  qrcode.decode(src);
};
