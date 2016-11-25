var assert = require('assert');
describe('Array', function() {
  describe.only('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });

  describe.only('#concat()', function () {
    it('should return a new String', function () {
      assert.equal("tobi1", "tobi".concat("1"));
    });
  });

  describe.only('#concat()', function () {
    it('should return a new Array', function () {
      assert.deepEqual([1, 2, 3, 4, 5, 6], [1, 2, 3].concat([4, 5, 6]));
    });
  });

});
