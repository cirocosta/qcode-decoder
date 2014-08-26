/**
 * Constructor for QRCodeDecoder
 */
function QRCodeDecoder () {
  this.tmrCapture = null;
  this.canvasElem = null;
  this.videoConstraints = {video: true, audio: false};
}

/**
 * Prepares the canvas element (which will
 * receive the image from the camera and provide
 * what the algorithm needs for checking for a
 * QRCode and then decoding it.)
 * @param  {DOMElement} canvasElem the canvas
 * element
 * @param  {number} width      The width that
 * the canvas element should have
 * @param  {number} height     The height that
 * the canvas element should have
 * @return {DOMElement}            the canvas
 * after the resize if width and height
 * provided.
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

  if (!this.videoDimensions &&
      this.videoElem.videoWidth &&
      this.videoElem.videoHeight) {

    this.videoDimensions = {
      w: this.videoElem.videoWidth,
      h: this.videoElem.videoHeight
    };

    this.prepareCanvas(this.canvasElem,
                       this.videoDimensions.w,
                       this.videoDimensions.h);
  }

  if (this.videoDimensions) {
    var gCtx = this.canvasElem.getContext("2d");
    gCtx.clearRect(0, 0, this.videoElem.videoWidth,
                         this.videoElem.videoHeight);

    try{
      gCtx.drawImage(this.videoElem, 0, 0,
                     this.videoDimensions.w,
                     this.videoDimensions.h);
      qrcode.decode();
      return;
    }
    catch(e){
        console.log(e);
    }
  }
  this.tmrCapture = setTimeout(function () {
    scope._captureToCanvas.apply(scope, null);
  }, 500);
};

/**
 * Verifies if the user has getUserMedia enabled
 * in the browser.
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
 * Prepares the video element for receiving
 * camera's input.
 * @param  {DOMElement} videoElem <video> dom
 * element
 * @param  {Function} errcb     callback
 * function to be called in case of error
 */
QRCodeDecoder.prototype.prepareVideo = function(videoElem, errcb) {
  var scope = this;

  this.stop();

  navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia(this.videoConstraints, function (stream) {
      videoElem.src = window.URL.createObjectURL(stream);
      scope.videoElem = videoElem;
      scope.stream = stream;
      scope.videoDimensions = false;
      setTimeout(function () {
        scope._captureToCanvas.apply(scope, null);
      }, 500);
    }, errcb);
  } else {
    console.log('Couldn\'t get video from camera');
  }
};

/**
 * Releases a video stream that was being
 * captured by prepareToVideo
 */
QRCodeDecoder.prototype.stop = function() {
  if (this.stream) {
    this.stream.stop();
    delete this.stream;
  }
  if (this.tmrCapture) {
    clearTimeout(this.tmrCapture);
    delete this.tmrCapture;
  }
};


/**
 * Sets the sourceId for the camera to use.
 *
 * The sourceId can be found using the
 * getVideoSources function on a browser that
 * supports it (currently only Chrome).
 *
 * @param {String} sourceId     The id of the
 * video source you want to use (or false to use
 * the current default)
 */
QRCodeDecoder.prototype.setSourceId = function (sourceId) {
  if (sourceId) {
    this.videoConstraints.video = {
      optional: [{
        sourceId: sourceId
      }]
    };
  } else {
    this.videoConstraints.video = true;
  }
};


/**
 * Sets the callback for the decode event
 */
QRCodeDecoder.prototype.setDecoderCallback = function (cb) {
  qrcode.callback = cb;
};

/**
 * Gets a list of all available video sources on
 * the device
 */
QRCodeDecoder.prototype.getVideoSources = function(cb) {
  var sources = [];
  if (MediaStreamTrack && MediaStreamTrack.getSources) {
    MediaStreamTrack.getSources(function (sourceInfos) {
      sourceInfos.forEach(function(sourceInfo) {
        if (sourceInfo.kind === 'video') {
          sources.push(sourceInfo);
        }
      });
      cb(sources);
    });
  } else {
    console.log('Your browser doesn\'t support MediaStreamTrack.getSources');
    cb(sources);
  }
};

QRCodeDecoder.prototype.decodeFromSrc = function(src) {
  qrcode.decode(src);
};
