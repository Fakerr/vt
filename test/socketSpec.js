var socketCtrl = require('../socketCtrl');
var assert = require('assert');


describe('Test on socketCtrl function', function(){

  // Test numberValidity function.
  it('should return true', function(){
    assert.equal(socketCtrl.numberValidity('1234'), true);
    assert.equal(socketCtrl.numberValidity('124'), false);
    assert.equal(socketCtrl.numberValidity('1233'), false);
    assert.equal(socketCtrl.numberValidity('123f4'), false);
  });

});
