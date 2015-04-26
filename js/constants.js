/**
 * Created by panda on 10/04/2015.
 */

function DefaultConfig(){
    "use strict";
    this.columnCount = 6;
    this.displayedRowCount = 10;
    this.hiddenRowCount = 4;//MIN 1 !
    this.pixelPerBox = 50;
    this.fallSpeedPerTic = 5;
    this.groundSpeedPerTic = 0.1;
    this.groundUpSpeedPerTic = 3;
    this.fallPeriod = 1000;
    this.lostThreshold =  ((this.displayedRowCount + this.hiddenRowCount) * this.pixelPerBox);
    this.startRows = this.displayedRowCount-4;
}

function GetConfig(mode){
    "use strict";
    var conf = new DefaultConfig();
    if(mode === "sandbox"){
        conf.groundSpeedPerTic = 0;
        conf.fallPeriod = 0;
        conf.startRows = conf.displayedRowCount + conf.hiddenRowCount; //FIXME move it to grid loading ?
    }
    else if(mode === "fixed"){
        conf.groundUpSpeedPerTic = 0;
        conf.groundSpeedPerTic = 0;
        conf.fallPeriod = 0;
    }
    return conf;
}

var CONFIG = {};
