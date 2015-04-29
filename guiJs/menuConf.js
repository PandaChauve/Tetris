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
puzzle1.link = "game.html?game=puzzle_1";
var puzzle2 = new MenuElement("Puzzle 2", puzzle);
puzzle2.link = "game.html?game=puzzle_2";

var arcade = new MenuElement("Arcade", campaign);
var arcade1 = new MenuElement("Arcade 1", arcade);
arcade1.link = "game.html?game=arcade_1";
var arcade2 = new MenuElement("Arcade 2", arcade);
arcade2.link = "game.html?game=arcade_2";
var arcade3 = new MenuElement("Arcade 3", arcade);
arcade3.link = "game.html?game=arcade_3";

var tetrisAttack = new MenuElement("Tetris Attack", campaign);
var world1 = new MenuElement("World 1", tetrisAttack);
var w1m1 = new MenuElement("Map 1", world1);
w1m1.link = "game.html?game=ta_1_1";
var w1m2 = new MenuElement("Map 2", world1);
w1m2.link = "game.html?game=ta_1_2";
var w1m3 = new MenuElement("Map 3", world1);
w1m3.link = "game.html?game=ta_1_3";
var w1m4 = new MenuElement("Map 4", world1);
w1m4.link = "game.html?game=ta_1_4";
var w1m5 = new MenuElement("Map 5", world1);
w1m5.link = "game.html?game=ta_1_5";
var w1m6 = new MenuElement("Map 6", world1);
w1m6.link = "game.html?game=ta_1_6";
var w1m7 = new MenuElement("Map 7", world1);
w1m7.link = "game.html?game=ta_1_7";
var w1m8 = new MenuElement("Map 8", world1);
w1m8.link = "game.html?game=ta_1_8";
var w1m9 = new MenuElement("Map 9", world1);
w1m9.link = "game.html?game=ta_1_9";
var w1m10 = new MenuElement("Map 10", world1);
w1m10.link = "game.html?game=ta_1_10";

var multi = new MenuElement("Multi Player", mainMenu);
var split = new MenuElement("Split Screen", multi);
split.link = "splitscreen.html?game=classicSplitScreen";

new MenuElement("Configure", mainMenu);
