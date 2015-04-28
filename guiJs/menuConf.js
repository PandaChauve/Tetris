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


var multi = new MenuElement("Multi Player", mainMenu);
var split = new MenuElement("Split Screen", multi);
split.link = "splitscreen.html?game=classicSplitScreen";

new MenuElement("Configure", mainMenu);
