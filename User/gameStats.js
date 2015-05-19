/**
 * Created by panda on 8/05/2015.
 */
function GameStats(){
    "use strict";
    this.score = 0;
    this.time = 0;
    this.minTime = 111111111111111111111111; //... FIXME
    this.blockDestroyed = 0;
    this.multilines = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //not sure of the required size
    this.lineSizes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//... FIXME
    this.gameCount = 1;
    this.swapCount = 0;
    this.minSwapCount = 111111111111111111111111;//... FIXME
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
    this.minTime = tics;
};

GameStats.prototype.SetSwaps = function(swp){
    "use strict";
    this.swapCount = swp;
    this.minSwapCount = swp;
};

GameStats.Append = function(base, otherGameStat){
    "use strict";
    base.gameCount += otherGameStat.gameCount;
    base.score += otherGameStat.score;
    base.time += otherGameStat.time;
    base.minTime += otherGameStat.minTime;
    base.blockDestroyed += otherGameStat.blockDestroyed;
    base.score += otherGameStat.score;
    for(var i = 0; i < base.multilines.length; i+= 1){
        base.multilines[i] += otherGameStat.multilines[i];
    }
    for(i = 0; i < base.lineSizes.length; i+= 1){
        base.lineSizes[i] += otherGameStat.lineSizes[i];
    }
    base.swapCount += otherGameStat.swapCount;
};

GameStats.KeepBest = function(base, otherGameStat){
    "use strict";
    base.gameCount += otherGameStat.gameCount;
    base.score = (base.score > otherGameStat.score)?base.score : otherGameStat.score;
    base.time = (base.time > otherGameStat.time)?base.time : otherGameStat.time;
    base.minTime = (base.minTime < otherGameStat.minTime)?base.minTime : otherGameStat.minTime;
    base.blockDestroyed = (base.blockDestroyed > otherGameStat.blockDestroyed)?base.blockDestroyed : otherGameStat.blockDestroyed;
    base.score = (base.score > otherGameStat.score)?base.score : otherGameStat.score;

    for(var i = 0; i < base.multilines.length; i+= 1){
        base.multilines[i] = (base.multilines[i] > otherGameStat.multilines[i])?base.multilines[i]:otherGameStat.multilines[i];
    }
    for(i = 0; i < base.lineSizes.length; i+= 1){
        base.lineSizes[i] = (base.lineSizes[i] > otherGameStat.lineSizes[i])?base.lineSizes[i]:otherGameStat.lineSizes[i];
    }
    base.swapCount = (base.swapCount > otherGameStat.swapCount)?base.swapCount : otherGameStat.swapCount;
    base.minSwapCount = (base.minSwapCount < otherGameStat.minSwapCount)?base.minSwapCount : otherGameStat.minSwapCount;
};