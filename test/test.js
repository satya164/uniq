/* eslint-env mocha */

require("babel/register");

var assert = require("assert"),
    uniq = require("../src/uniq.es6");

describe("uniq test", function() {
    it("should return array with unique strings", function() {
        var arr = [ "a", "b", "c", "a", "d", "b", "e" ];

        assert.deepEqual(uniq(arr), [ "a", "b", "c", "d", "e" ]);
    });

    it("should return array with equality function", function() {
        var arr = [ 1, 3, 5, 7, "5", "1", 9 ];

        assert.deepEqual(uniq(arr, function(a, b) {
            return parseInt(a) === parseInt(b);
        }), [ 1, 3, 5, 7, 9 ]);
    });
});
