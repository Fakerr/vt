var socketCtrl = require('../socketCtrl');
var assert = require('assert');


describe('Test on socketCtrl function', function(){

  describe('Test numberValidity function', function() {

    // Test numberValidity function.
    it('should return true', function(){
      assert.equal(socketCtrl.numberValidity('1234'), true);
      assert.equal(socketCtrl.numberValidity('124'), false);
      assert.equal(socketCtrl.numberValidity('1233'), false);
      assert.equal(socketCtrl.numberValidity('123f4'), false);
    });
  });

  describe('Test vt function', function(){

    // Test vt function.
    it('should return specific object', function(){
      assert.equal(socketCtrl.vt(1234, 9876).toString(), {T:0, V:0}.toString());
      assert.equal(socketCtrl.vt(1234, 1234).toString(), {T:4, V:0}.toString());
      assert.equal(socketCtrl.vt(1234, 1243).toString(), {T:2, V:2}.toString());
      assert.equal(socketCtrl.vt(1234, 4321).toString(), {T:0, V:4}.toString());
    });
  });
});
