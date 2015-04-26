QUnit.module( "StartingGrid", {
    beforeEach: function() {
        this.grid = new Grid();
    }
});

QUnit.test( "GridGetScore", function( assert ) {
    var ret = this.grid.Evaluate();
    assert.ok(Number.isInteger(ret));
});