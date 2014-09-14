'use strict';

var assert = require('assert');
var QCodeDecoder = require('../src/qcode-decoder');

describe('QCodeDecoder', function() {
  global.mocha.checkLeaks = false;
  global.mocha.timeout = 20000;

  it('be defined', function() {
    assert(!!QCodeDecoder);
  });

  var qr;

  beforeEach(function () {
    qr = new QCodeDecoder();
  });

  it('decode image from src', function(done) {
    qr.decodeImage('tests/assets/qrcode.png', function (err, result) {
      if (err)
        return done(err);

      assert.equal(result, '192.168.1.13:3000');
      done();
    });
  });
});
