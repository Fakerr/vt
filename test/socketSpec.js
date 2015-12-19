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

  describe('Test searchForRoom function', function(){
    var rooms = [{full: true}, {full: false}];
    // Test searchForRoom function.(Probleme !!!)
    it('should return an object with false value for \'full\' property', function(){
      assert.equal(JSON.stringify(socketCtrl.searchForRoom(rooms)), JSON.stringify({full: false}));
    });
  });
});
