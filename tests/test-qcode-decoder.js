'use strict';

var assert = require('assert');
var QCodeDecoder = require('../src/qcode-decoder');

describe('QCodeDecoder', function() {
  global.mocha.checkLeaks = false;
  this.timeout(180000);

  it('be defined', function () {
    assert(!!QCodeDecoder);
  });

  var qr;

  beforeEach(function () {
    qr = new QCodeDecoder();
  });

  describe('decodeFromImage', function () {
    function assertResult (done, err, result) {
      if (err)
        return done(err);

      assert.equal(result, '192.168.1.13:3000');
      done();
    }

    it('decode image from src', function (done) {
      qr.decodeFromImage('tests/assets/qrcode.png',
                         assertResult.bind(null, done));
    });

    it('not decode image from src w/ non-qrcode img', function (done) {
      qr.decodeFromImage('tests/assets/duck.jpg', function (err, result) {
        assert(err);
        done();
      });
    });

    it('decode image from img element', function (done) {
      var img = document.createElement('img');
      img.setAttribute('src', 'tests/assets/qrcode.png');

      qr.decodeFromImage(img, assertResult.bind(null, done));
    });

    it('throw if no src in image element', function() {
      var img = document.createElement('img');

      assert.throws(function () {
        qr.decodeFromImage(img);
      });
    });
  });

  describe('decodeFromCamera', function () {
    it('decode from a video with qrcode', function (done) {
      var video = document.createElement('video');
      video.setAttribute('autoplay', true);
      video.setAttribute('src', 'tests/assets/qrcode-video.mp4');

      qr.decodeFromVideo(video, function (err, result) {
        if (err) done(err);

        assert.equal(result, '192.168.1.13:3000');
        done();
      }, true);
    });
  });
});
