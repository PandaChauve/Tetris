/**
 * Created by panda on 27/04/2015.
 */

function MenuElement(name, parent) {
    "use strict";
    this.name = name;
    this.parent = parent;
    this.childs = [];
    this.link = "";
    if (parent !== null) {
        parent.AddChild(this);
    }

    this.AddChild = function (node) {
        this.childs.push(node);
    };
}

var mainMenu = new MenuElement("Index", null);

var single = new MenuElement("Single Player", mainMenu);

var classic = new MenuElement("Classic", single);
classic.link = "#!/game?name=classic";
var Wide = new MenuElement("Wide", single);
Wide.link = "#!/game?name=ultralarge";
var sandbox = new MenuElement("Sandbox", single);
sandbox.link = "#!/game?name=sandbox";
var campaign = new MenuElement("Campaign", single);

var puzzle = new MenuElement("Puzzle", campaign);
var puzzle1 = new MenuElement("Puzzle 1", puzzle);
puzzle1.link = "#!/game?name=campaign/puzzle/puzzle_1";
var puzzle2 = new MenuElement("Puzzle 2", puzzle);
puzzle2.link = "#!/game?name=campaign/puzzle/puzzle_2";

var arcade = new MenuElement("Arcade", campaign);
for (var arc = 1; arc < 4; arc += 1) {
    var arcade1 = new MenuElement("Arcade " + arc, arcade);
    arcade1.link = "#!/game?name=campaign/arcade/arcade_" + arc;
}

var tl = new MenuElement("TimeLimit", campaign);
for (var tlc = 1; tlc <= 4; tlc += 1) {
    var obj = new MenuElement("TimeLimit " + tlc, tl);
    obj.link = "#!/game?name=campaign/timeLimit/timelimit_" + tlc;
}

var tetrisAttack = new MenuElement("Tetris Attack", campaign);
for (var world = 1; world <= 6; world += 1) {
    var worldi = new MenuElement("World " + world, tetrisAttack);
    for (var map = 1; map <= 10; map += 1) {
        var w1m1 = new MenuElement("Map " + map, worldi);
        w1m1.link = "#!/game?name=campaign/tetrisAttack/" + world + "/ta_" + world + "_" + map;
    }
}


var multi = new MenuElement("Multi Player", mainMenu);
var split = new MenuElement("Split Screen", multi);
split.link = "#!/game?name=classicSplitScreen";
var coop = new MenuElement("Coop", multi);
coop.link = "#!/game?name=ultralargecoop";

//var todo = new MenuElement("Timeline", mainMenu);
//todo.link = "todo.txt";

var rules = new MenuElement("Rules", mainMenu);
rules.link = "#!/rules";
var stats = new MenuElement("Stats", mainMenu);
stats.link = "#!/scores";
var achievements = new MenuElement("Achievements", mainMenu);
achievements.link = "#!/achievements";
