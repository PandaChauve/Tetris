/**
 * Created by panda on 27/04/2015.
 */

function MenuElement(name, parent) {
    "use strict";
    this.name = name;
    this.parent = parent;
    this.childs = [];
    this.link = "";
    if(parent !== null){
        parent.AddChild(this);
    }

    this.AddChild = function(node){
        this.childs.push(node);
    };
}

var mainMenu = new MenuElement("Index", null);

var single = new MenuElement("Single Player", mainMenu);
var classic = new MenuElement("Classic", single);
classic.link = "game.html?game=classic";
var sandbox = new MenuElement("Sandbox", single);
sandbox.link = "game.html?game=sandbox";
var campaign = new MenuElement("Campaign", single);

var puzzle = new MenuElement("Puzzle", campaign);
var puzzle1 = new MenuElement("Puzzle 1", puzzle);
puzzle1.link = "game.html?game=campaign/puzzle/puzzle_1";
var puzzle2 = new MenuElement("Puzzle 2", puzzle);
puzzle2.link = "game.html?game=campaign/puzzle/puzzle_2";

var arcade = new MenuElement("Arcade", campaign);
var arcade1 = new MenuElement("Arcade 1", arcade);
arcade1.link = "game.html?game=campaign/arcade/arcade_1";
var arcade2 = new MenuElement("Arcade 2", arcade);
arcade2.link = "game.html?game=campaign/arcade/arcade_2";
var arcade3 = new MenuElement("Arcade 3", arcade);
arcade3.link = "game.html?game=campaign/arcade/arcade_3";

var tetrisAttack = new MenuElement("Tetris Attack", campaign);
var world1 = new MenuElement("World 1", tetrisAttack);
var w1m1 = new MenuElement("Map 1", world1);
w1m1.link = "game.html?game=campaign/tetrisAttack/1/ta_1_1";
var w1m2 = new MenuElement("Map 2", world1);
w1m2.link = "game.html?game=campaign/tetrisAttack/1/ta_1_2";
var w1m3 = new MenuElement("Map 3", world1);
w1m3.link = "game.html?game=campaign/tetrisAttack/1/ta_1_3";
var w1m4 = new MenuElement("Map 4", world1);
w1m4.link = "game.html?game=campaign/tetrisAttack/1/ta_1_4";
var w1m5 = new MenuElement("Map 5", world1);
w1m5.link = "game.html?game=campaign/tetrisAttack/1/ta_1_5";
var w1m6 = new MenuElement("Map 6", world1);
w1m6.link = "game.html?game=campaign/tetrisAttack/1/ta_1_6";
var w1m7 = new MenuElement("Map 7", world1);
w1m7.link = "game.html?game=campaign/tetrisAttack/1/ta_1_7";
var w1m8 = new MenuElement("Map 8", world1);
w1m8.link = "game.html?game=campaign/tetrisAttack/1/ta_1_8";
var w1m9 = new MenuElement("Map 9", world1);
w1m9.link = "game.html?game=campaign/tetrisAttack/1/ta_1_9";
var w1m10 = new MenuElement("Map 10", world1);
w1m10.link = "game.html?game=campaign/tetrisAttack/1/ta_1_10";

var world2 = new MenuElement("World 2", tetrisAttack);
var w2m1 = new MenuElement("Map 1", world2);
w2m1.link = "game.html?game=campaign/tetrisAttack/2/ta_2_1";
var w2m2 = new MenuElement("Map 2", world2);
w2m2.link = "game.html?game=campaign/tetrisAttack/2/ta_2_2";
var w2m3 = new MenuElement("Map 3", world2);
w2m3.link = "game.html?game=campaign/tetrisAttack/2/ta_2_3";
var w2m4 = new MenuElement("Map 4", world2);
w2m4.link = "game.html?game=campaign/tetrisAttack/2/ta_2_4";
var w2m5 = new MenuElement("Map 5", world2);
w2m5.link = "game.html?game=campaign/tetrisAttack/2/ta_2_5";
var w2m6 = new MenuElement("Map 6", world2);
w2m6.link = "game.html?game=campaign/tetrisAttack/2/ta_2_6";
var w2m7 = new MenuElement("Map 7", world2);
w2m7.link = "game.html?game=campaign/tetrisAttack/2/ta_2_7";
var w2m8 = new MenuElement("Map 8", world2);
w2m8.link = "game.html?game=campaign/tetrisAttack/2/ta_2_8";
var w2m9 = new MenuElement("Map 9", world2);
w2m9.link = "game.html?game=campaign/tetrisAttack/2/ta_2_9";
var w2m10 = new MenuElement("Map 10", world2);
w2m10.link = "game.html?game=campaign/tetrisAttack/2/ta_2_10";


var world3 = new MenuElement("World 3", tetrisAttack);
var w3m1 = new MenuElement("Map 1", world3);
w3m1.link = "game.html?game=campaign/tetrisAttack/3/ta_3_1";
var w3m2 = new MenuElement("Map 2", world3);
w3m2.link = "game.html?game=campaign/tetrisAttack/3/ta_3_2";
var w3m3 = new MenuElement("Map 3", world3);
w3m3.link = "game.html?game=campaign/tetrisAttack/3/ta_3_3";
var w3m4 = new MenuElement("Map 4", world3);
w3m4.link = "game.html?game=campaign/tetrisAttack/3/ta_3_4";
var w3m5 = new MenuElement("Map 5", world3);
w3m5.link = "game.html?game=campaign/tetrisAttack/3/ta_3_5";
var w3m6 = new MenuElement("Map 6", world3);
w3m6.link = "game.html?game=campaign/tetrisAttack/3/ta_3_6";
var w3m7 = new MenuElement("Map 7", world3);
w3m7.link = "game.html?game=campaign/tetrisAttack/3/ta_3_7";
var w3m8 = new MenuElement("Map 8", world3);
w3m8.link = "game.html?game=campaign/tetrisAttack/3/ta_3_8";
var w3m9 = new MenuElement("Map 9", world3);
w3m9.link = "game.html?game=campaign/tetrisAttack/3/ta_3_9";
var w3m10 = new MenuElement("Map 10", world3);
w3m10.link = "game.html?game=campaign/tetrisAttack/3/ta_3_10";

var multi = new MenuElement("Multi Player", mainMenu);
var split = new MenuElement("Split Screen", multi);
split.link = "splitscreen.html?game=classicSplitScreen";

new MenuElement("Configure", mainMenu);
