(function (root, factory) {
  if (typeof define === 'function' && define.amd)
    define(['qrcode'], factory);
  else if (typeof exports === 'object')
    module.exports = factory(require('../build/qrcode'));
  else root.QCodeDecoder = factory(qrcode);
}(this, function (qrcode) {

'use strict';

/**
 * Constructor for QCodeDecoder
 */
function QCodeDecoder () {
  this.timerCapture = null;
  this.canvasElem = null;
  this.stream = null;
  this.videoConstraints = {video: true, audio: false};
}

/**
 * Verifies if canvas element is supported.
 */
QCodeDecoder.prototype.isCanvasSupported = function () {
  var elem = document.createElement('canvas');

  return !!(elem.getContext && elem.getContext('2d'));
};


/**
 * Normalizes and Verifies if the user has
 * getUserMedia enabled in the browser.
 */
QCodeDecoder.prototype.hasGetUserMedia = function () {
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia;

  return !!(navigator.getUserMedia);
};

/**
 * Prepares the canvas element (which will
 * receive the image from the camera and provide
 * what the algorithm needs for checking for a
 * QRCode and then decoding it.)
 *
 *
 * @param  {DOMElement} canvasElem the canvas
 *                                 element
 * @param  {number} width      The width that
 *                             the canvas element
 *                             should have
 * @param  {number} height     The height that
 *                             the canvas element
 *                             should have
 * @return {DOMElement}            the canvas
 * after the resize if width and height
 * provided.
 */
QCodeDecoder.prototype.prepareCanvas = function (canvasElem, width, height) {
  if (width && height) {
    canvasElem.style.width = width + "px";
    canvasElem.style.height = height + "px";
    canvasElem.width = width;
    canvasElem.height = height;
  }

  qrcode.setCanvasElement(canvasElem);
  this.canvasElem = canvasElem;

  return this;
};

/**
 * Based on the video dimensions and the canvas
 * that was previously generated captures the
 * video/image source and then paints into the
 * canvas so that the decoder is able to work as
 * it expects.
 * @param  {Function} cb
 * @return {Object}      this
 */
QCodeDecoder.prototype._captureToCanvas = function (cb, once) {
  if (this.timerCapture)
    clearTimeout(this.timerCapture);

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
    gCtx.drawImage(this.videoElem, 0, 0,
                   this.videoDimensions.w,
                   this.videoDimensions.h);

    try {
      cb(null, qrcode.decode());

      if (once) return;
    } catch (err){
      if (err !== "Couldn't find enough finder patterns")
        cb(new Error(err));
    }
  }

  this.timerCapture = setTimeout(function () {
    this._captureToCanvas.call(this, cb, once);
  }.bind(this), 500);
};

/**
 * Decodes an image from its src.
 * @param  {DOMNode}   imageElem
 * @param  {Function} cb        callback
 * @return {Object}             this
 */
QCodeDecoder.prototype.decodeImage = function (img, cb) {
  img = img.src ? img.src : img;

  return (qrcode.decode(img, cb), this);
};

/**
 * Prepares the video element for receiving
 * camera's input. Releases a stream if there
 * was any (resets).
 *
 * @param  {DOMElement} videoElem <video> dom
 *                                element
 * @param  {Function} errcb     callback
 *                              function to be
 *                              called in case of
 *                              error
 */
QCodeDecoder.prototype.prepareVideo = function (videoElem, cb, once) {
  var scope = this;

  this.stop();

  if (!this.hasGetUserMedia())
    cb(new Error('Couldn\'t get video from camera'));

  navigator.getUserMedia(this.videoConstraints, function (stream) {
    videoElem.src = window.URL.createObjectURL(stream);
    scope.videoElem = videoElem;
    scope.stream = stream;
    scope.videoDimensions = false;

    setTimeout(function () {
      scope._captureToCanvas.call(scope, cb, once);
    }, 500);
  }, cb);

  return this;
};

/**
 * Releases a video stream that was being
 * captured by prepareToVideo
 */
QCodeDecoder.prototype.stop = function() {
  if (this.stream) {
    this.stream.stop();
    this.stream = undefined;
  }

  if (this.timerCapture) {
    clearTimeout(this.timerCapture);
    this.timerCapture = undefined;
  }

  return this;
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
QCodeDecoder.prototype.setSourceId = function (sourceId) {
  if (sourceId)
    this.videoConstraints.video = { optional: [{ sourceId: sourceId }]};
  else
    this.videoConstraints.video = true;

  return this;
};


/**
 * Gets a list of all available video sources on
 * the device
 */
QCodeDecoder.prototype.getVideoSources = function (cb) {
  var sources = [];

  if (MediaStreamTrack && MediaStreamTrack.getSources) {
    MediaStreamTrack.getSources(function (sourceInfos) {
      sourceInfos.forEach(function(sourceInfo) {
        if (sourceInfo.kind === 'video')
          sources.push(sourceInfo);
      });
      cb(null, sources);
    });
  } else {
    cb(new Error('Current browser doest not support MediaStreamTrack.getSources'));
  }

  return this;
};


return QCodeDecoder; }));
