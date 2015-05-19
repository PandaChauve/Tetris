/**
 * Created by panda on 8/05/2015.
 */
function GameStats(){
    "use strict";
    this.score = 0;
    this.time = 0;
    this.blockDestroyed = 0;
    this.multilines = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //not sure of the required size
    this.lineSizes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//... FIXME
    this.gameCount = 0;
    this.swapCount = 0;
}

GameStats.prototype.AddLines = function(series, score){ //no score logic here
    "use strict";
    this.score += score;
    var ml = series.length - 2;
    this.multilines[ml] += 1;
    for(var i = 0; i < series.length; i+= 1){ //for a given serie, remove duplicates
        var serie = [];
        $.each(series[i], function(j, el){
            if($.inArray(el, serie) === -1)
            {
                serie.push(el);
            }
        });
        this.lineSizes[serie.length -3] += 1;
        this.blockDestroyed += serie.length;
    }
};

GameStats.prototype.SetTime = function(tics){
    "use strict";
    this.time = tics;
};

GameStats.prototype.SetSwaps = function(swp){
    "use strict";
    this.swapCount = swp;
};

GameStats.Append = function(base, otherGameStat){
    "use strict";
    base.gameCount += otherGameStat.gameCount;
    base.score += otherGameStat.score;
    base.time += otherGameStat.time;
    base.blockDestroyed += otherGameStat.blockDestroyed;
    base.swapCount += otherGameStat.swapCount;

    for(var i = 0; i < base.multilines.length; i+= 1){
        base.multilines[i] += otherGameStat.multilines[i];
    }
    for(i = 0; i < base.lineSizes.length; i+= 1){
        base.lineSizes[i] += otherGameStat.lineSizes[i];
    }
};

GameStats.KeepBest = function(base, otherGameStat){
    "use strict";
    base.gameCount += otherGameStat.gameCount;
    base.score = (base.score > otherGameStat.score)?base.score : otherGameStat.score;
    base.time = (base.time > otherGameStat.time)?base.time : otherGameStat.time;
    base.blockDestroyed = (base.blockDestroyed > otherGameStat.blockDestroyed)?base.blockDestroyed : otherGameStat.blockDestroyed;
    base.swapCount = (base.swapCount > otherGameStat.swapCount)?base.swapCount : otherGameStat.swapCount;

    for(var i = 0; i < base.multilines.length; i+= 1){
        base.multilines[i] = (base.multilines[i] > otherGameStat.multilines[i])?base.multilines[i]:otherGameStat.multilines[i];
    }
    for(i = 0; i < base.lineSizes.length; i+= 1){
        base.lineSizes[i] = (base.lineSizes[i] > otherGameStat.lineSizes[i])?base.lineSizes[i]:otherGameStat.lineSizes[i];
    }
};