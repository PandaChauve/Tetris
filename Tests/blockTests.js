/**
 * Created by panda on 19/04/2015.
 */
QUnit.module( "Block" );
QUnit.test( "Block_GetHexColor", function( assert ) {
    var tested = new Block();
    for(var i = 1; i < Block.EType.PlaceHolder; i += 1)    {
        tested.type = i;
        assert.notEqual(tested.GetHexColor(), 0x000000, "Default block is black");
    }
    tested.type = Block.EType.PlaceHolder;
    assert.equal(tested.GetHexColor(), 0x000000, "PlaceHolder block is not black");

});

QUnit.test( "Block_Random", function( assert ) {
    var tested = Block.EType.Random();
    var badSum = 10*tested;
    var realSum = tested;
    for(var i = 1; i < 10; i += 1)    {
        tested = Block.EType.Random();
        realSum += tested;
        assert.notEqual(tested, Block.EType.PlaceHolder, "PlaceHolder used in random");
    }
    assert.notEqual(realSum, badSum, "Unexpected sum, this test is not well made");

});