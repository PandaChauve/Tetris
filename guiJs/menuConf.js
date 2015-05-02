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
for(var arc = 1; arc < 4; arc += 1){
    var arcade1 = new MenuElement("Arcade "+arc, arcade);
    arcade1.link = "game.html?game=campaign/arcade/arcade_"+arc;
}

var tetrisAttack = new MenuElement("Tetris Attack", campaign);
for(var world = 1; world <= 6; world += 1){
    var worldi = new MenuElement("World "+ world, tetrisAttack);
    for(var map = 1; map <= 10; map+= 1){
        var w1m1 = new MenuElement("Map "+map, worldi);
        w1m1.link = "game.html?game=campaign/tetrisAttack/"+world +"/ta_"+world +"_"+map;
    }
}


var multi = new MenuElement("Multi Player", mainMenu);
var split = new MenuElement("Split Screen", multi);
split.link = "splitscreen.html?game=classicSplitScreen";

var todo = new MenuElement("Timeline", mainMenu);
todo.link = "todo.txt";
