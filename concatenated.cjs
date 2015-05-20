angular.module("angularApp.controllers",["ui.bootstrap"]);var angularApp=angular.module("angularApp",["ngRoute","angularApp.controllers"]);angularApp.config(["$compileProvider",function(a){a.debugInfoEnabled(!1)}]);angularApp.controller("HeaderCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]);angularApp.filter("ticToTime",function(){return TimeFromTics});
angularApp.directive("ngEnter",function(a){return{scope:{ngEnter:"&"},link:function(b,e,f){var c=function(d){13===d.which&&(b.ngEnter(),a.unbind("keydown keypress",c))};a.bind("keydown keypress",c)}}});
angularApp.config(["$routeProvider","$locationProvider",function(a,b){a.when("/scores",{templateUrl:"templates/scores.html",controller:"ScoresCtrl"}).when("/achievements",{templateUrl:"templates/achievements.html",controller:"AchievementsCtrl"}).when("/rules",{templateUrl:"templates/rules.html"}).when("/game",{templateUrl:"templates/game.html",controller:"GameCtrl"}).when("/campaign",{templateUrl:"templates/campaign.html",controller:"CampaignCtrl"}).when("/stats",{templateUrl:"templates/stats.html",
controller:"StatCtrl"}).when("/",{templateUrl:"templates/scores.html",controller:"ScoresCtrl"});b.html5Mode(!1);b.hashPrefix("!")}]);
var campaignControllers=angular.module("angularApp.controllers");
campaignControllers.controller("CampaignCtrl",["$scope","$routeParams",function(b,d){var a,c;b.campaign=d.name||"arcade";b.maps=[];switch(b.campaign){case "puzzle":for(a=1;3>a;a+=1)b.maps.push("campaign/puzzle/puzzle_"+a);break;case "timelimit":for(a=1;3>a;a+=1)b.maps.push("campaign/timeLimit/timelimit_"+a);break;case "tetris":for(a=1;7>a;a+=1)for(c=1;11>c;c+=1)b.maps.push("campaign/tetrisAttack/"+a+"/ta_"+a+"_"+c);break;default:for(a=1;4>a;a+=1)b.maps.push("campaign/arcade/arcade_"+a)}}]);
var gameControllers=angular.module("angularApp.controllers");
gameControllers.controller("GameCtrl",["$scope","$http","$route","$routeParams","$modal","$window",function(a,f,h,g,k,c){a.gameName=g.name||"classic";a.confi={};a.game=null;a.confi.splitScreen="classicSplitScreen"===a.gameName;a.load=function(){f.get("games/"+a.gameName+".json",{cache:!1}).success(function(b){a.useGameConfig(b)}).error(function(a){console.log(a)})};a.load();a.pause={toggle:function(){a.pause.active=a.game.TogglePause()},active:!1};a.$on("$routeChangeStart",function(){a.game&&(a.game.Stop(),
a.game=null)});a.reset=function(){a.game.Stop();a.game=new Game(a.game.config,a.game.grid,a.endCallBack);a.game.Start()};angular.element(c).bind("blur",function(){return function(){a.game&&(a.pause.active=!0,a.game.TogglePause(!0),a.$apply())}}());a.useGameConfig=function(b){CONFIG=GetConfig(b.config);""==b.grid?(a.game=new Game(b,"",a.endCallBack),a.game.Start()):f.get("grids/"+b.grid+".json",{cache:!1}).success(function(d){a.game=new Game(b,d,a.endCallBack);a.game.Start()}).error(function(a){console.log(a)})};
a.endCallBack=function(b){b.stats.SetTime(b.tics);b.stats.SetSwaps(b.tetris[0].swapCount);var c=UserStats.GetUserStats();c.AddGame(b.stats,a.gameName);(new AchievementsState).check(b.stats,c,a.gameName);a.open(b.stateChecker.lastSuccessCheck,b.stats)};a.open=function(b,c){k.open({animation:!0,templateUrl:"templates/modal.html",controller:"ModalInstanceCtrl",size:300,resolve:{won:function(){return b},gameName:function(){return a.gameName},statistics:function(){return c}}}).result.then(function(){b&&
a.game.config.next?(a.gameName=a.game.config.next,h.updateParams({name:a.gameName}),a.load()):a.reset()},function(){})}}]);
gameControllers.controller("ModalInstanceCtrl",["$scope","$modalInstance","won","gameName","statistics",function(a,f,h,g,k){a.won=h;a.published=!1;a.publish=function(){if(!a.published){a.published=!0;var c=UserStorage.GetStorage(),b=c.Get("UserName")||"";(b=prompt("Who are you ?",b))?(c.Set("UserName",b),c=stringToHex(des("wireshar","yop"+stats.score,1,0)),$.get("http://sylvain.luthana.be/api.php?add&name="+b+"&value="+c+"&map="+g)):a.published=!1}};a.nextGame=function(){f.close()};a.stop=function(){f.dismiss("cancel")};
a.stats=function(){function a(b,c,d){void 0===d&&(d=Math.floor);return d(b/c)}var b=UserStats.GetUserStats(),d=b.GetBestGameStats(g),b=b.GetTotalGameStats(g),e=[];e.push({name:"Score",value:stats.score,best:d.score,sum:b.score,mean:a(b.score,b.gameCount)});e.push({name:"Time",value:TimeFromTics(stats.time),best:TimeFromTics(d.time),sum:TimeFromTics(b.time),mean:a(b.time,b.gameCount,TimeFromTics)});e.push({name:"Blocks",value:stats.blockDestroyed,best:d.blockDestroyed,sum:b.blockDestroyed,mean:a(b.blockDestroyed,
b.gameCount)});e.push({name:"Swaps",value:stats.swapCount,best:d.swapCount,sum:b.swapCount,mean:a(b.swapCount,b.gameCount)});e.push({name:"Efficiency",value:(stats.score/stats.swapCount).toFixed(2),best:"/",sum:"/",mean:(b.score/b.swapCount).toFixed(2)});return e}()}]);
var statsControllers=angular.module("angularApp.controllers");
statsControllers.controller("ScoresCtrl",["$scope","$http",function(a,d){a.isActive=function(c){return c===a.type};a.activate=function(c){a.type=name;a.getScores(c)};a.getScores=function(c){d.get("http://sylvain.luthana.be/api.php?get&map="+c).success(function(b){a.scoreGridData=b})};a.activate("classic");a.scoreTypes=[{type:"classic",name:"Classic"},{type:"ultralarge",name:"Wide"},{type:"sandbox",name:"Sandbox"},{type:"ultralargecoop",name:"Coop"}]}]);
statsControllers.controller("AchievementsCtrl",["$scope",function(a){var d=new AchievementsState,c=0;a.achievementsGridData=[];for(var b=0;b<AchievementsState.List.enumSize;b+=1)a.achievementsGridData.push({Picture:"./Resources/imgs/placeholder.png",Name:AchievementsState.List.GetName(b),Success:d.IsWon(b),Description:AchievementsState.List.GetDescription(b)}),d.IsWon(b)&&(c+=1);a.percentComplete=c/AchievementsState.List.enumSize*100}]);
statsControllers.controller("StatCtrl",["$scope",function(a){var d=UserStats.GetUserStats();a.isPositive=function(a){return 0<a};a.isActive=function(b){return b===a.data.active};a.activate=function(b){$("#"+a.data.active).hide();$("#"+b).show();a.data.active=b};var c=function(a){a.best=d.GetBestGameStats(a.link);a.sum=d.GetTotalGameStats(a.link);return a};a.data={active:"Classic"};a.data.maps=[];a.data.maps.push(c({name:"Classic",link:"classic"}));a.data.maps.push(c({name:"Wide",link:"ultralarge"}));
a.data.maps.push(c({name:"SandBox",link:"sandbox"}));a.data.maps.push(c({name:"Coop",link:"ultralargecoop"}));a.data.maps.push(function(){var b,c={name:"Overall",link:""};c.best=new GameStats;c.sum=new GameStats;for(b=0;b<a.data.maps.length;b+=1)GameStats.KeepBest(c.best,a.data.maps[b].best),GameStats.Append(c.sum,a.data.maps[b].sum);return c}())}]);
function Block(){this.type=Block.EType.Random();this.group=-1;this.state=Block.EState.Blocked;this.animationState=this.verticalPosition=0;this.id=-1}Block.prototype.GetCopy=function(){var a=new Block;a.type=this.type;a.group=this.group;a.state=this.state;a.verticalPosition=this.verticalPosition;a.animationState=this.animationState;a.id=this.id;return a};
Block.prototype.LoadFrom=function(a){this.type=a.type;this.group=a.group;this.state=a.state;this.verticalPosition=a.verticalPosition;this.animationState=a.animationState;this.id=a.id};Block.prototype.SetState=function(a){this.state=a;this.animationState=0};Block.EState={Blocked:1,Falling:2,Disappearing:3,SwappedLeft:4,SwappedRight:5};Block.EType={Purple:0,Red:1,Green:2,Blue:3,Grey:4,Orange:5,PlaceHolder:6,Random:function(){return Math.floor(Math.random()*Block.EType.PlaceHolder)}};
Block.prototype.GetHexColor=function(){switch(this.type){case Block.EType.Blue:return 144;case Block.EType.Green:return 36864;case Block.EType.Grey:return 5263440;case Block.EType.Red:return 9437184;case Block.EType.Orange:return 14446099;case Block.EType.Purple:return 5778034}return 0};
function DefaultConfig(){this.columnCount=6;this.displayedRowCount=10;this.hiddenRowCount=4;this.pixelPerBox=50;this.fallSpeedPerTic=7;this.disapearSpeedPerTic=2;this.groundSpeedPerTic=.07;this.groundUpSpeedPerTic=3;this.groundAccelerationPerTic=.02/60/60;this.fallPeriod=500;this.lostThreshold=(this.displayedRowCount+this.hiddenRowCount)*this.pixelPerBox;this.startRows=this.displayedRowCount-4}
function GetConfig(b){var a=new DefaultConfig;"sandbox"===b?(a.groundSpeedPerTic=0,a.fallPeriod=0,a.startRows=a.displayedRowCount+a.hiddenRowCount,a.groundAccelerationPerTic=0):"fixed"===b?(a.groundUpSpeedPerTic=0,a.groundSpeedPerTic=0,a.fallPeriod=0,a.groundAccelerationPerTic=0):"raining"===b?(a.groundSpeedPerTic=0,a.fallPeriod=300,a.groundAccelerationPerTic=0):"large"===b&&(a.columnCount=10);return a}var CONFIG={};
function Game(a,b,c){this.config=a;this.grid=b;this.tetris=[];this.visual=[];this.kb=new UserInput;this.stateChecker=new StateChecker(a.victory);this.tobefixed=[2,2];this.stop=!1;this.id=-1;this.start=null;this.pause=!1;this.tics=0;this.stats=new GameStats;this.stats.gameCount+=1;this.callback=void 0===c?null:c;this.Init()}Game.prototype.Stop=function(){window.cancelAnimationFrame(this.id);this.stop=!0;for(var a=0;a<this.visual.length;a+=1)this.visual[a].clear(),this.visual[a]=null};
Game.CreateRenderingFct=function(a){return function(b){a.render(b)}};Game.prototype.Start=function(){this.id=requestAnimationFrame(Game.CreateRenderingFct(this))};
Game.prototype.Init=function(){for(var a=0;a<this.config.tetris.length;a+=1){this.tetris.push(new Tetris(this.grid,this.config.tetris[a].cursors,this.stats));for(var b=0;b<this.config.tetris[a].mappings.length;b+=1)this.tetris[a].keyBoardMappings.push(UserInput[this.config.tetris[a].mappings[b]]);this.visual.push(new ThreeRenderer(this.config.tetris[a].cursors));this.visual[a].LinkDom(this.config.tetris[a].gameBox);this.visual[a].RenderTetris(this.tetris[a])}};
Game.prototype.SplitScreenQuickFix=function(){if(2===this.tetris.length){for(;this.tobefixed[0]<this.tetris[1].GetScore()/3;)this.tobefixed[0]+=1,this.tetris[0].RandomFall();for(;this.tobefixed[1]<this.tetris[0].GetScore()/3;)this.tobefixed[1]+=1,this.tetris[1].RandomFall()}};
Game.prototype.TogglePause=function(a){if(this.stop)return!1;(this.pause=void 0===a?!this.pause:a)?window.cancelAnimationFrame(this.id):(this.id=requestAnimationFrame(Game.CreateRenderingFct(this)),this.start=null);this.kb.clear();return this.pause};
Game.prototype.render=function(a){null===this.start&&(this.start=a-this.tics/60*1E3);var b=a-this.start;$(".timeBox").html(TimeFromTics(this.tics));for(var c=!0,d=0;this.tics<60*b/1E3&&c&&10>d;){d+=1;this.tics+=1;for(a=0;a<this.tetris.length;a+=1)this.tetris[a].OneTick(this.kb),$("#"+this.config.tetris[a].scoreBox).html(this.tetris[a].GetScore()),this.stateChecker.Check(this.tetris[a]),this.stateChecker.Defeat()||this.stateChecker.Victory()?(c=!1,this.visual[a].Freeze()):void 0!==this.config.victory&&
void 0!==this.config.victory.swaps?$("#"+this.config.tetris[a].swapBox).html(this.config.victory.swaps-this.tetris[a].GetSwaps()):$("#"+this.config.tetris[a].swapBox).html(this.tetris[a].GetSwaps());this.kb.clear()}if(c&&!this.stop){for(a=0;a<this.tetris.length;a+=1)this.visual[a].RenderTetris(this.tetris[a]);this.SplitScreenQuickFix();this.id=requestAnimationFrame(Game.CreateRenderingFct(this))}else c||null!==this.callback&&this.callback(this)};
function Grid(c){var a,b,d=0!==CONFIG.groundUpSpeedPerTic||0!==CONFIG.groundSpeedPerTic;this.container=Array(CONFIG.columnCount);for(a=0;a<CONFIG.columnCount;a+=1)for(this.container[a]=Array(CONFIG.hiddenRowCount),b=0;b<this.container[a].length;b+=1)this.container[a][b]=new Block,this.container[a][b].verticalPosition=b*CONFIG.pixelPerBox,d||(this.container[a][b].type=Block.EType.PlaceHolder,this.container[a][b].state=Block.EState.Blocked);if(void 0===c||""===c)for(a=0;a<CONFIG.columnCount;a+=1)for(b=
this.container[a].length;b<CONFIG.startRows;b+=1)this.container[a].push(new Block),this.container[a][b].verticalPosition=b*CONFIG.pixelPerBox;else this.Load(c)}Grid.prototype.AddNewLine=function(){var c,a;for(c=0;c<CONFIG.columnCount;c+=1){for(a=0;a<this.container[c].length;a+=1)this.container[c][a].verticalPosition+=CONFIG.pixelPerBox;this.container[c].unshift(new Block)}};
Grid.prototype.RemoveBlockFixed=function(c,a){var b=this.container[c][a];this.container[c].splice(a,1);this.MakeTopBlockFall(c,a);return b};Grid.prototype.RemoveBlock=function(c,a){var b=this.FindBlockIndex(c,a);if(-1===b)throw"Not my day";return this.RemoveBlockFixed(c,b)};Grid.prototype.InsertBlock=function(c,a){for(var b=0;b<this.container[a].length;b+=1)if(this.container[a][b].verticalPosition>c.verticalPosition){this.container[a].splice(b,0,c);return}this.container[a].push(c)};
Grid.prototype.FindBlock=function(c,a){var b=this.FindBlockIndex(c,a);return-1===b?null:this.container[c][b]};Grid.prototype.FindBlockIndex=function(c,a){for(var b in this.container[c])if(this.container[c].hasOwnProperty(b)&&this.container[c][b].verticalPosition===CONFIG.pixelPerBox*a)return parseInt(b);return-1};
Grid.prototype.IsBlockIndexFree=function(c,a){for(var b in this.container[c])if(this.container[c].hasOwnProperty(b)&&this.container[c][b].verticalPosition>=CONFIG.pixelPerBox*a&&this.container[c][b].verticalPosition<CONFIG.pixelPerBox*(a+1))return!1;return!0};Grid.prototype.MakeTopBlockFall=function(c,a){if(0>a)throw"Not my day";for(var b=a;b<this.container[c].length&&this.container[c][b].state===Block.EState.Blocked;b+=1)this.container[c][b].SetState(Block.EState.Falling)};
Grid.prototype.AnimateBlockFall=function(c,a,b,d){b.verticalPosition-=CONFIG.fallSpeedPerTic;b.verticalPosition<d&&(b.verticalPosition=d,this.container[c][a-1].state!==Block.EState.Falling&&b.SetState(Block.EState.Blocked));return{min:b.verticalPosition+CONFIG.pixelPerBox,deltaY:0}};
Grid.prototype.AnimateBlockDisappear=function(c,a,b,d){b.animationState+=CONFIG.disapearSpeedPerTic;return 100<b.animationState&&-1===b.id?(this.container[c].splice(a,1),this.MakeTopBlockFall(c,a),{min:d,deltaY:-1}):{min:b.verticalPosition+CONFIG.pixelPerBox,deltaY:0}};
Grid.prototype.AnimateSwapped=function(c,a,b,d){b.animationState+=15;if(100<b.animationState){if(b.type===Block.EType.PlaceHolder)return this.RemoveBlockFixed(c,a),{min:d,deltaY:-1};this.container[c][a-1].state===Block.EState.Falling||this.container[c][a-1].verticalPosition<b.verticalPosition-CONFIG.pixelPerBox?(b.SetState(Block.EState.Falling),this.MakeTopBlockFall(c,a+1)):b.SetState(Block.EState.Blocked)}return{min:b.verticalPosition+CONFIG.pixelPerBox,deltaY:0}};
Grid.prototype.AnimateBlock=function(c,a,b){var d=this.container[c][a];switch(d.state){case Block.EState.Blocked:return{min:d.verticalPosition+CONFIG.pixelPerBox,deltaY:0};case Block.EState.Disappearing:return this.AnimateBlockDisappear(c,a,d,b);case Block.EState.Falling:return this.AnimateBlockFall(c,a,d,b);case Block.EState.SwappedRight:case Block.EState.SwappedLeft:return this.AnimateSwapped(c,a,d,b)}throw"Unsupported animation";};
Grid.prototype.AnimateColumn=function(c){var a,b,d;b=CONFIG.hiddenRowCount*CONFIG.pixelPerBox;for(a=CONFIG.hiddenRowCount;a<this.container[c].length;a+=1)d=this.AnimateBlock(c,a,b),b=d.min,a+=d.deltaY};Grid.prototype.Animate=function(){for(var c=0;c<CONFIG.columnCount;c+=1)this.AnimateColumn(c)};
Grid.prototype.GetMaxFixed=function(){var c,a,b=0;for(c=0;c<CONFIG.columnCount;c+=1)for(a=CONFIG.hiddenRowCount;a<this.container[c].length&&this.container[c][a].state===Block.EState.Blocked;a+=1)this.container[c][a].verticalPosition>b&&(b=this.container[c][a].verticalPosition);return b};Grid.prototype.NewBlockFall=function(c){var a=new Block;a.SetState(Block.EState.Falling);a.verticalPosition=(CONFIG.hiddenRowCount+CONFIG.displayedRowCount+1)*CONFIG.pixelPerBox;this.container[c].push(a)};
Grid.prototype.Swap=function(c,a){var b=this.FindBlock(c,a),d=this.FindBlock(c+1,a);if(null!==b&&null!==d){if(b.state===Block.EState.Blocked&&d.state===Block.EState.Blocked)return this.SwapBlocks(b,d),!0}else{if(null!==b&&this.IsBlockIndexFree(c+1,a)&&b.state===Block.EState.Blocked)return d=new Block,d.type=Block.EType.PlaceHolder,d.state=Block.EState.SwappedLeft,d.verticalPosition=b.verticalPosition,this.InsertBlock(d,c+1),this.SwapBlocks(b,d),!0;if(null!==d&&this.IsBlockIndexFree(c,a)&&d.state===
Block.EState.Blocked)return b=new Block,b.type=Block.EType.PlaceHolder,b.state=Block.EState.SwappedRight,b.verticalPosition=d.verticalPosition,this.InsertBlock(b,c),this.SwapBlocks(b,d),!0}return!1};Grid.prototype.SwapBlocks=function(c,a){var b=c.GetCopy();c.LoadFrom(a);a.LoadFrom(b);c.SetState(Block.EState.SwappedLeft);a.SetState(Block.EState.SwappedRight)};
Grid.prototype.Load=function(c){var a,b;for(a=0;a<c.grid.length;a+=1)for(b=0;b<c.grid[a].length;b+=1){var d=new Block;d.state=c.grid[a][b].state;d.type=c.grid[a][b].type;d.verticalPosition=this.container[a].length*CONFIG.pixelPerBox;this.container[a].push(d)}};Grid.prototype.Evaluate=function(c){return(new GridEvaluator(c)).Evaluate(this.container)};Grid.prototype.BlockCount=function(){for(var c=0,a=0;a<this.container.length;a+=1)c+=this.container[a].length-CONFIG.hiddenRowCount;return c};
GridEvaluator=function(a){this.series=[];this.stats=a};
GridEvaluator.prototype.EvaluateColumn=function(a,b){for(var c=0,e=null,f=-1,d=CONFIG.hiddenRowCount;d<a[b].length;d+=1)a[b][d].state!==Block.EState.Blocked?(c=0,e=null):a[b][d].type!==e?(e=a[b][d].type,c=1):(c+=1,3===c?(a[b][d].SetState(Block.EState.Disappearing),a[b][d-1].SetState(Block.EState.Disappearing),a[b][d-2].SetState(Block.EState.Disappearing),this.series.push([]),f=this.series.length-1,this.series[f].push(a[b][d].id),this.series[f].push(a[b][d-1].id),this.series[f].push(a[b][d-2].id)):
3<c&&(a[b][d].SetState(Block.EState.Disappearing),this.series[f].push(a[b][d].id)))};GridEvaluator.prototype.EvaluateVertical=function(a){for(var b=0;b<CONFIG.columnCount;b+=1)this.EvaluateColumn(a,b)};GridEvaluator.prototype.FindBlockIndex=function(a,b,c){for(var e in a[b])if(a[b].hasOwnProperty(e)&&a[b][e].verticalPosition===CONFIG.pixelPerBox*c)return parseInt(e);return-1};
GridEvaluator.prototype.EvaluateLine=function(a,b){var c,e,f,d=-1,h=-1,l=-1;f=0;e=null;var g=-1;for(c=0;c<CONFIG.columnCount;c+=1)if(l=h,h=d,d=this.FindBlockIndex(a,c,b),-1===d)f=0;else{var k=a[c][d];k.state===Block.EState.Blocked||k.state===Block.EState.Disappearing&&0===k.animationState?(k.type!==e&&(e=a[c][d].type,f=0),f+=1,3===f?(a[c][d].SetState(Block.EState.Disappearing),a[c-1][h].SetState(Block.EState.Disappearing),a[c-2][l].SetState(Block.EState.Disappearing),this.series.push([]),g=this.series.length-
1,this.series[g].push(a[c][d].id),this.series[g].push(a[c-1][h].id),this.series[g].push(a[c-2][l].id)):3<f&&(a[c][d].SetState(Block.EState.Disappearing),this.series[g].push(a[c][d].id))):f=0}};GridEvaluator.prototype.EvaluateHorizontal=function(a){for(var b=CONFIG.hiddenRowCount;b<CONFIG.displayedRowCount+CONFIG.hiddenRowCount;b+=1)this.EvaluateLine(a,b)};
GridEvaluator.prototype.GetScore=function(){for(var a=this.series.length,b=0,c=0;c<a;c+=1)b+=(this.series[c].length-2)*a;this.stats.AddLines(this.series,b);return b};GridEvaluator.prototype.GetSerie=function(a,b){for(var c=b-1;0<=c;--c)for(var e=0;e<this.series[c].length;e+=1)if(this.series[c][e]===a)return c;return-1};
GridEvaluator.prototype.MergeSeries=function(){for(var a=this.series.length-1;0<=a;--a)for(var b=0;b<this.series[a].length;b+=1){var c=this.GetSerie(this.series[a][b],a);if(-1!==c){this.series[c]=this.series[c].concat(this.series[a]);this.series.splice(a,1);break}}};GridEvaluator.prototype.Evaluate=function(a){this.EvaluateVertical(a);this.EvaluateHorizontal(a);this.MergeSeries();return this.GetScore()};
function StateChecker(a){this.defeatComponents=[];this.succesComponents=[];this.MakeComponents(a);this.defeatComponents.push(new PillarSizeChecker);this.lastDefeatCheck=this.lastSuccessCheck=!1}StateChecker.prototype.Defeat=function(){return this.lastDefeatCheck};StateChecker.prototype.Victory=function(){return this.lastSuccessCheck};
StateChecker.prototype.Check=function(a){this.lastSuccessCheck=0!==this.succesComponents.length;this.lastDefeatCheck=!1;for(var b=0;b<this.succesComponents.length;b+=1)this.lastSuccessCheck=this.succesComponents[b].Check(a)&&this.lastSuccessCheck;for(b=0;b<this.defeatComponents.length;b+=1)this.lastDefeatCheck=this.defeatComponents[b].Check(a)||this.lastDefeatCheck};
StateChecker.prototype.MakeComponents=function(a){$("#rules").html("<ul />");null===a||void 0===a?$("#rules ul").append($("<li class='succesCond'>Try to stay alive !</li>")):(void 0!==a.blocksLeft&&this.succesComponents.push(new BlockChecker(a.blocksLeft)),void 0!==a.score&&this.succesComponents.push(new ScoreChecker(a.score)),void 0!==a.swaps&&this.defeatComponents.push(new SwapChecker(a.swaps)),void 0!==a.time&&this.defeatComponents.push(new TimeChecker(a.time)))};
function PillarSizeChecker(){$("#rules ul").append($("<li class='defeatCond'></li>"))}PillarSizeChecker.prototype.Check=function(a){return a.GetMaxFixed()>=CONFIG.lostThreshold};function ScoreChecker(a){$("#rules ul").append($("<li class='successCond'>Get "+a+" points</li>"));this.val=a}ScoreChecker.prototype.Check=function(a){return a.GetScore()>=this.val};
function BlockChecker(a){0===a?$("#rules ul").append($("<li class='successCond'>Destroy each block</li>")):$("#rules ul").append($("<li class='successCond'>Reduce the block count to "+a+"</li>"));this.val=a}BlockChecker.prototype.Check=function(a){return a.grid.BlockCount()<=this.val};function SwapChecker(a){$("#rules ul").append($("<li class='defeatCond'>Max "+a+" swaps</li>"));this.val=a}SwapChecker.prototype.Check=function(a){return a.swapCount>this.val};
function TimeChecker(a){$("#rules ul").append($("<li class='defeatCond'>Max "+a+" seconds</li>"));this.val=a}TimeChecker.prototype.Check=function(a){return a.tics/60>this.val};
function Tetris(a,b,c){this.grid=new Grid(a);this.stats=c;this.score=0;this.cursor=[];void 0===b&&(b=1);for(a=0;a<b;a+=1)this.cursor.push({x:2+2*a,y:CONFIG.hiddenRowCount});this.swapCount=0;this.baseGroundSpeed=this.groundSpeed=CONFIG.groundSpeedPerTic;this.groundPos=0;this.keyBoardMappings=[];this.tics=0}
Tetris.prototype.OneTick=function(a){this.score+=this.grid.Evaluate(this.stats);this.HandleUserInput(a);this.tics+=1;0!==CONFIG.fallPeriod&&0===this.tics%CONFIG.fallPeriod&&this.RandomFall();this.grid.Animate();this.groundPos+=this.groundSpeed;this.groundSpeed+=CONFIG.groundAccelerationPerTic;this.baseGroundSpeed+=CONFIG.groundAccelerationPerTic;if(this.groundPos>=CONFIG.pixelPerBox){this.groundPos-=CONFIG.pixelPerBox;this.grid.AddNewLine();for(a=0;a<this.cursor.length;a+=1)this.cursor[a].y+=1;this.groundSpeed=
this.baseGroundSpeed}};Tetris.prototype.GetMaxFixed=function(){return this.grid.GetMaxFixed()};Tetris.prototype.IsMoving=function(){return this.grid.IsMoving()};Tetris.prototype.GetScore=function(){return this.score};Tetris.prototype.GetSwaps=function(){return this.swapCount};function GetIntBetween(a,b){return Math.floor(Math.random()*(b-a+1))+a}Tetris.prototype.RandomFall=function(){for(var a=GetIntBetween(0,CONFIG.columnCount-3),b=a;b<a+3;b+=1)this.grid.NewBlockFall(b)};
Tetris.prototype.HandleUserInput=function(a){for(var b=0;b<this.keyBoardMappings.length;b+=1){var c=this.cursor[b%this.cursor.length];a.pressed(this.keyBoardMappings[b].swap)&&this.grid.Swap(c.x,c.y)&&(this.swapCount+=1);a.pressed(this.keyBoardMappings[b].down)&&(c.y=Math.max(CONFIG.hiddenRowCount,c.y-1));a.pressed(this.keyBoardMappings[b].up)&&(c.y=Math.min(CONFIG.hiddenRowCount+CONFIG.displayedRowCount,c.y+1));a.pressed(this.keyBoardMappings[b].left)&&(c.x=Math.max(0,c.x-1));a.pressed(this.keyBoardMappings[b].right)&&
(c.x=Math.min(CONFIG.columnCount-2,c.x+1));a.pressed(this.keyBoardMappings[b].speed)&&(this.groundSpeed=CONFIG.groundUpSpeedPerTic)}};
function ThreeRenderer(b){void 0===b&&(b=1);this.camera=this.CreateCamera();this.renderer=this.CreateRenderer();this.light=this.CreateLight();this.cursor=[this.CreateCursor(32896)];for(var a=1;a<b;a+=1)this.cursor.push(this.CreateCursor(8388736));this.scene=this.CreateScene();this.offset=0;this.id=String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now()}ThreeRenderer.prototype.clear=function(){this.renderer=this.cursor=this.camera=this.light=this.scene=null};
ThreeRenderer.prototype.CreateLight=function(){var b=new THREE.DirectionalLight(13421772);b.position.set(500,1E3,2E3);b.castShadow=!0;b.shadowCameraVisible=!1;b.shadowDarkness=.2;b.shadowMapWidth=b.shadowMapHeight=1E3;return b};
ThreeRenderer.prototype.CreateScene=function(){var b=new THREE.Scene;b.add(this.light);for(var a=0;a<this.cursor.length;a+=1)b.add(this.cursor[a]);var a=new THREE.PlaneGeometry(1E3,400),c=new THREE.MeshBasicMaterial({color:0,side:THREE.DoubleSide,transparent:!0,opacity:.5}),a=new THREE.Mesh(a,c);a.rotation.x+=1.62;a.position.setY(CONFIG.hiddenRowCount*CONFIG.pixelPerBox-CONFIG.pixelPerBox/2);a.renderDepth=1;b.add(a);a=new THREE.BoxGeometry(1E3,3,3);c=new THREE.MeshPhongMaterial({color:3342336,emissive:10027008});
a=new THREE.Mesh(a,c);a.position.set(0,(CONFIG.hiddenRowCount+CONFIG.displayedRowCount)*CONFIG.pixelPerBox,10);b.add(a);a=new THREE.BoxGeometry(1E3,3,3);c=new THREE.MeshPhongMaterial({color:13056,emissive:39168});a=new THREE.Mesh(a,c);a.position.set(0,CONFIG.hiddenRowCount*CONFIG.pixelPerBox-CONFIG.pixelPerBox/2+5,10);b.add(a);return b};ThreeRenderer.prototype.CreateCamera=function(){var b=new THREE.PerspectiveCamera(75,.7,.3,1E3);b.position.z=450;b.position.x=-27;b.position.y=410;return b};
ThreeRenderer.prototype.CreateRenderer=function(){var b=new THREE.WebGLRenderer({antialias:!0});b.setClearColor(0);b.setSize(420,600);b.shadowMapEnabled=!0;b.shadowMapSoft=!0;return b};ThreeRenderer.prototype.AddCube=function(b){var a=new THREE.BoxGeometry(.7*CONFIG.pixelPerBox,.7*CONFIG.pixelPerBox,CONFIG.pixelPerBox/4);b=new THREE.MeshPhongMaterial({color:b,emissive:1118481});a=new THREE.Mesh(a,b);this.scene.add(a);return a.id};
function CalculateX(b,a){return b.state===Block.EState.SwappedLeft?a+CONFIG.pixelPerBox/100*(100-b.animationState):b.state===Block.EState.SwappedRight?a-CONFIG.pixelPerBox/100*(100-b.animationState):a}
ThreeRenderer.prototype.UpdateCube=function(b,a){var c=this.scene.getObjectById(a.id);c.position.setY(a.verticalPosition+this.offset);c.position.setX(CalculateX(a,b));c.material.color=new THREE.Color(a.GetHexColor());a.state===Block.EState.Disappearing&&(c.material.opacity=Math.max(1-a.animationState/100,0),c.material.transparent=!0);0===c.material.opacity&&(this.scene.remove(c),a.id=-1)};
ThreeRenderer.prototype.Render=function(){this.light.position.setY(1E3+this.offset);this.renderer.render(this.scene,this.camera)};ThreeRenderer.prototype.LinkDom=function(b){this.renderer.domElement.setAttribute("id",this.id);var a=$("#"+b+" .gamePlaceHolder");if(0===a.length)throw b+"missing gameplaceHolder";a.empty();a.append($(this.renderer.domElement))};ThreeRenderer.prototype.UnlinkDom=function(){var b=document.getElementById(this.id);null!==b&&b.parentNode.removeChild(b)};
ThreeRenderer.prototype.CreateCursor=function(b){var a=new THREE.Shape;a.absarc(72,-13,10,-Math.PI/2,0,!0);a.lineTo(82,0);a.absarc(72,13,10,0,Math.PI/2,!0);a.lineTo(35,20);a.lineTo(35,0);a.absarc(-2,-13,10,3*Math.PI/2,Math.PI,!0);a.lineTo(-12,0);a.absarc(-2,13,10,Math.PI,Math.PI/2,!0);a.lineTo(35,-20);return new THREE.PointCloud(a.createPointsGeometry(),new THREE.PointCloudMaterial({color:b,size:4}))};
ThreeRenderer.prototype.DrawCursorOn=function(b,a,c){void 0===c&&(c=0);this.cursor[c].position.set((b-CONFIG.columnCount/2)*CONFIG.pixelPerBox-10,a*(CONFIG.pixelPerBox-.5)+this.offset+5,7)};ThreeRenderer.prototype.Freeze=function(){for(var b=0;b<this.cursor.length;b+=1)this.scene.remove(this.cursor[b]);this.Render()};
ThreeRenderer.prototype.RenderTetris=function(b){this.offset=b.groundPos;for(var a,c=0;c<CONFIG.columnCount;c+=1)for(var d=0;d<b.grid.container[c].length;d+=1)a=b.grid.container[c][d],a.type!==Block.EType.PlaceHolder&&(-1===a.id&&(a.id=this.AddCube(a.GetHexColor())),this.UpdateCube((c-CONFIG.columnCount/2)*CONFIG.pixelPerBox,a));for(c=0;c<b.cursor.length;c+=1)this.DrawCursorOn(b.cursor[c].x,b.cursor[c].y,c);this.Render()};
function uiOnClick(a){a.data.obj.keyCodes[a.data.key]=!0}
var UserInput=function(){this.keyCodes={};var a=this;this._onKeyDown=function(b){a._onKeyChange(b)};document.addEventListener("keydown",this._onKeyDown,!1);$("#moveUp").click({obj:this,key:UserInput.ALIAS.up},uiOnClick);$("#moveDown").click({obj:this,key:UserInput.ALIAS.down},uiOnClick);$("#moveLeft").click({obj:this,key:UserInput.ALIAS.left},uiOnClick);$("#moveRight").click({obj:this,key:UserInput.ALIAS.right},uiOnClick);$("#swapBtn").click({obj:this,key:UserInput.ALIAS.space},uiOnClick)};
UserInput.prototype.destroy=function(){document.removeEventListener("keydown",this._onKeyDown,!1)};UserInput.ALIAS={left:37,up:38,right:39,down:40,space:32,pageup:33,pagedown:34,tab:9,enter:13};UserInput.prototype.clear=function(){this.keyCodes={}};UserInput.prototype._onKeyChange=function(a){var b=a.keyCode;this.keyCodes[b]=!0;(b===UserInput.ALIAS.space||b>=UserInput.ALIAS.left&&b<=UserInput.ALIAS.down)&&a.preventDefault()};UserInput.prototype.pressed=function(a){return!0===this.keyCodes[a]};
UserInput.leftMapping={swap:UserInput.ALIAS.space,down:83,up:90,left:81,right:68,speed:65};UserInput.rightMapping={swap:96,down:UserInput.ALIAS.down,up:UserInput.ALIAS.up,left:UserInput.ALIAS.left,right:UserInput.ALIAS.right,speed:UserInput.ALIAS.enter};
function MenuElement(b,a){this.name=b;this.parent=a;this.childs=[];this.link="";null!==a&&a.AddChild(this);this.AddChild=function(a){this.childs.push(a)}}var mainMenu=new MenuElement("Index",null),single=new MenuElement("Single Player",mainMenu),classic=new MenuElement("Classic",single);classic.link="#!/game?name=classic";var Wide=new MenuElement("Wide",single);Wide.link="#!/game?name=ultralarge";var sandbox=new MenuElement("Sandbox",single);sandbox.link="#!/game?name=sandbox";
var campaign=new MenuElement("Campaign",single),puzzle=new MenuElement("Puzzle",campaign),puzzle1=new MenuElement("Puzzle 1",puzzle);puzzle1.link="#!/game?name=campaign/puzzle/puzzle_1";var puzzle2=new MenuElement("Puzzle 2",puzzle);puzzle2.link="#!/game?name=campaign/puzzle/puzzle_2";for(var arcade=new MenuElement("Arcade",campaign),arc=1;4>arc;arc+=1){var arcade1=new MenuElement("Arcade "+arc,arcade);arcade1.link="#!/game?name=campaign/arcade/arcade_"+arc}
for(var tl=new MenuElement("TimeLimit",campaign),tlc=1;4>=tlc;tlc+=1){var obj=new MenuElement("TimeLimit "+tlc,tl);obj.link="#!/game?name=campaign/timeLimit/timelimit_"+tlc}for(var tetrisAttack=new MenuElement("Tetris Attack",campaign),world=1;6>=world;world+=1)for(var worldi=new MenuElement("World "+world,tetrisAttack),map=1;10>=map;map+=1){var w1m1=new MenuElement("Map "+map,worldi);w1m1.link="#!/game?name=campaign/tetrisAttack/"+world+"/ta_"+world+"_"+map}
var multi=new MenuElement("Multi Player",mainMenu),split=new MenuElement("Split Screen",multi);split.link="#!/game?name=classicSplitScreen";var coop=new MenuElement("Coop",multi);coop.link="#!/game?name=ultralargecoop";var rules=new MenuElement("Rules",mainMenu);rules.link="#!/rules";var stats=new MenuElement("Stats",mainMenu);stats.link="#!/scores";var achievements=new MenuElement("Achievements",mainMenu);achievements.link="#!/achievements";
function Notifications(){this.notificationZone=$("#notificationZone");this.count=0}Notifications.prototype.notify=function(b){this.count+=1;var a=String.fromCharCode(65+Math.floor(26*Math.random()))+Date.now()+"_"+this.count;this.notificationZone.append($("<div class='notification' id='"+a+"'>"+b+"</div>"));$("#"+a).slideDown("slow");setTimeout(function(){$("#"+a).slideUp("slow",function(){$(this).remove()})},1E4)};
function des(f,e,k,l,g,b){var m=[16843776,0,65536,16843780,16842756,66564,4,65536,1024,16843776,16843780,1024,16778244,16842756,16777216,4,1028,16778240,16778240,66560,66560,16842752,16842752,16778244,65540,16777220,16777220,65540,0,1028,66564,16777216,65536,16843780,4,16842752,16843776,16777216,16777216,1024,16842756,65536,66560,16777220,1024,4,16778244,66564,16843780,65540,16842752,16778244,16777220,1028,66564,16843776,1028,16778240,16778240,0,65540,66560,0,16842756],v=[-2146402272,-2147450880,
32768,1081376,1048576,32,-2146435040,-2147450848,-2147483616,-2146402272,-2146402304,-2147483648,-2147450880,1048576,32,-2146435040,1081344,1048608,-2147450848,0,-2147483648,32768,1081376,-2146435072,1048608,-2147483616,0,1081344,32800,-2146402304,-2146435072,32800,0,1081376,-2146435040,1048576,-2147450848,-2146435072,-2146402304,32768,-2146435072,-2147450880,32,-2146402272,1081376,32,32768,-2147483648,32800,-2146402304,1048576,-2147483616,1048608,-2147450848,-2147483616,1048608,1081344,0,-2147450880,
32800,-2147483648,-2146435040,-2146402272,1081344],d=[520,134349312,0,134348808,134218240,0,131592,134218240,131080,134217736,134217736,131072,134349320,131080,134348800,520,134217728,8,134349312,512,131584,134348800,134348808,131592,134218248,131584,131072,134218248,8,134349320,512,134217728,134349312,134217728,131080,520,131072,134349312,134218240,0,512,131080,134349320,134218240,134217736,512,0,134348808,134218248,131072,134217728,134349320,8,131592,131584,134217736,134348800,134218248,520,134348800,
131592,8,134348808,131584],w=[8396801,8321,8321,128,8396928,8388737,8388609,8193,0,8396800,8396800,8396929,129,0,8388736,8388609,1,8192,8388608,8396801,128,8388608,8193,8320,8388737,1,8320,8388736,8192,8396928,8396929,129,8388736,8388609,8396800,8396929,129,0,0,8396800,8320,8388736,8388737,1,8396801,8321,8321,128,8396929,129,1,8192,8388609,8193,8396928,8388737,8193,8320,8388608,8396801,128,8388608,8192,8396928],p=[256,34078976,34078720,1107296512,524288,256,1073741824,34078720,1074266368,524288,33554688,
1074266368,1107296512,1107820544,524544,1073741824,33554432,1074266112,1074266112,0,1073742080,1107820800,1107820800,33554688,1107820544,1073742080,0,1107296256,34078976,33554432,1107296256,524544,524288,1107296512,256,33554432,1073741824,34078720,1107296512,1074266368,33554688,1073741824,1107820544,34078976,1074266368,256,33554432,1107820544,1107820800,524544,1107296256,1107820800,34078720,0,1074266112,1107296256,524544,33554688,1073742080,524288,0,1074266112,34078976,1073742080],F=[536870928,541065216,
16384,541081616,541065216,16,541081616,4194304,536887296,4210704,4194304,536870928,4194320,536887296,536870912,16400,0,4194320,536887312,16384,4210688,536887312,16,541065232,541065232,0,4210704,541081600,16400,4210688,541081600,536870912,536887296,16,541065232,4210688,541081616,4194304,16400,536870928,4194304,536887296,536870912,16400,536870928,541081616,4210688,541065216,4210704,541081600,0,541065232,16,16384,541065216,4210704,16384,4194320,536887312,0,541081600,536870912,4194320,536887312],G=[2097152,
69206018,67110914,0,2048,67110914,2099202,69208064,69208066,2097152,0,67108866,2,67108864,69206018,2050,67110912,2099202,2097154,67110912,67108866,69206016,69208064,2097154,69206016,2048,2050,69208066,2099200,2,67108864,2099200,67108864,2099200,2097152,67110914,67110914,69206018,69206018,2,2097154,67108864,67110912,2097152,69208064,2050,2099202,69208064,2050,67108866,69208066,69206016,2099200,0,2,69208066,0,2099202,69206016,2048,67108866,67110912,2048,2097154],H=[268439616,4096,262144,268701760,268435456,
268439616,64,268435456,262208,268697600,268701760,266240,268701696,266304,4096,64,268697600,268435520,268439552,4160,266240,262208,268697664,268701696,4160,0,0,268697664,268435520,268439552,266304,262144,266304,262144,268701696,4096,64,268697664,4096,266304,268439552,64,268435520,268697600,268697664,268435456,262144,268439616,0,268701760,262208,268435520,268697600,268439552,268439616,0,268701760,266240,266240,4160,4160,262208,268435456,268701696];f=des_createKeys(f);var h=0,n,q,r,c,a,x,t,A,u,B,C,
D,y=e.length,z=0,E=32==f.length?3:9;x=3==E?k?[0,32,2]:[30,-2,-2]:k?[0,32,2,62,30,-2,64,96,2]:[94,62,-2,32,64,2,30,-2,-2];2==b?e+="        ":1==b?(b=8-y%8,e+=String.fromCharCode(b,b,b,b,b,b,b,b),8==b&&(y+=8)):b||(e+="\x00\x00\x00\x00\x00\x00\x00\x00");tempresult=result="";1==l&&(t=g.charCodeAt(h++)<<24|g.charCodeAt(h++)<<16|g.charCodeAt(h++)<<8|g.charCodeAt(h++),u=g.charCodeAt(h++)<<24|g.charCodeAt(h++)<<16|g.charCodeAt(h++)<<8|g.charCodeAt(h++),h=0);for(;h<y;){c=e.charCodeAt(h++)<<24|e.charCodeAt(h++)<<
16|e.charCodeAt(h++)<<8|e.charCodeAt(h++);a=e.charCodeAt(h++)<<24|e.charCodeAt(h++)<<16|e.charCodeAt(h++)<<8|e.charCodeAt(h++);1==l&&(k?(c^=t,a^=u):(A=t,B=u,t=c,u=a));b=(c>>>4^a)&252645135;a^=b;c^=b<<4;b=(c>>>16^a)&65535;a^=b;c^=b<<16;b=(a>>>2^c)&858993459;c^=b;a^=b<<2;b=(a>>>8^c)&16711935;c^=b;a^=b<<8;b=(c>>>1^a)&1431655765;a^=b;c^=b<<1;c=c<<1|c>>>31;a=a<<1|a>>>31;for(n=0;n<E;n+=3){C=x[n+1];D=x[n+2];for(g=x[n];g!=C;g+=D)q=a^f[g],r=(a>>>4|a<<28)^f[g+1],b=c,c=a,a=b^(v[q>>>24&63]|w[q>>>16&63]|F[q>>>
8&63]|H[q&63]|m[r>>>24&63]|d[r>>>16&63]|p[r>>>8&63]|G[r&63]);b=c;c=a;a=b}c=c>>>1|c<<31;a=a>>>1|a<<31;b=(c>>>1^a)&1431655765;a^=b;c^=b<<1;b=(a>>>8^c)&16711935;c^=b;a^=b<<8;b=(a>>>2^c)&858993459;c^=b;a^=b<<2;b=(c>>>16^a)&65535;a^=b;c^=b<<16;b=(c>>>4^a)&252645135;a^=b;c^=b<<4;1==l&&(k?(t=c,u=a):(c^=A,a^=B));tempresult+=String.fromCharCode(c>>>24,c>>>16&255,c>>>8&255,c&255,a>>>24,a>>>16&255,a>>>8&255,a&255);z+=8;512==z&&(result+=tempresult,tempresult="",z=0)}return result+tempresult}
function des_createKeys(f){pc2bytes0=[0,4,536870912,536870916,65536,65540,536936448,536936452,512,516,536871424,536871428,66048,66052,536936960,536936964];pc2bytes1=[0,1,1048576,1048577,67108864,67108865,68157440,68157441,256,257,1048832,1048833,67109120,67109121,68157696,68157697];pc2bytes2=[0,8,2048,2056,16777216,16777224,16779264,16779272,0,8,2048,2056,16777216,16777224,16779264,16779272];pc2bytes3=[0,2097152,134217728,136314880,8192,2105344,134225920,136323072,131072,2228224,134348800,136445952,
139264,2236416,134356992,136454144];pc2bytes4=[0,262144,16,262160,0,262144,16,262160,4096,266240,4112,266256,4096,266240,4112,266256];pc2bytes5=[0,1024,32,1056,0,1024,32,1056,33554432,33555456,33554464,33555488,33554432,33555456,33554464,33555488];pc2bytes6=[0,268435456,524288,268959744,2,268435458,524290,268959746,0,268435456,524288,268959744,2,268435458,524290,268959746];pc2bytes7=[0,65536,2048,67584,536870912,536936448,536872960,536938496,131072,196608,133120,198656,537001984,537067520,537004032,
537069568];pc2bytes8=[0,262144,0,262144,2,262146,2,262146,33554432,33816576,33554432,33816576,33554434,33816578,33554434,33816578];pc2bytes9=[0,268435456,8,268435464,0,268435456,8,268435464,1024,268436480,1032,268436488,1024,268436480,1032,268436488];pc2bytes10=[0,32,0,32,1048576,1048608,1048576,1048608,8192,8224,8192,8224,1056768,1056800,1056768,1056800];pc2bytes11=[0,16777216,512,16777728,2097152,18874368,2097664,18874880,67108864,83886080,67109376,83886592,69206016,85983232,69206528,85983744];
pc2bytes12=[0,4096,134217728,134221824,524288,528384,134742016,134746112,16,4112,134217744,134221840,524304,528400,134742032,134746128];pc2bytes13=[0,4,256,260,0,4,256,260,1,5,257,261,1,5,257,261];for(var e=8<f.length?3:1,k=Array(32*e),l=[0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0],g,b,m=0,v=0,d,w=0;w<e;w++){left=f.charCodeAt(m++)<<24|f.charCodeAt(m++)<<16|f.charCodeAt(m++)<<8|f.charCodeAt(m++);right=f.charCodeAt(m++)<<24|f.charCodeAt(m++)<<16|f.charCodeAt(m++)<<8|f.charCodeAt(m++);d=(left>>>4^right)&252645135;
right^=d;left^=d<<4;d=(right>>>-16^left)&65535;left^=d;right^=d<<-16;d=(left>>>2^right)&858993459;right^=d;left^=d<<2;d=(right>>>-16^left)&65535;left^=d;right^=d<<-16;d=(left>>>1^right)&1431655765;right^=d;left^=d<<1;d=(right>>>8^left)&16711935;left^=d;right^=d<<8;d=(left>>>1^right)&1431655765;right^=d;left^=d<<1;d=left<<8|right>>>20&240;left=right<<24|right<<8&16711680|right>>>8&65280|right>>>24&240;right=d;for(var p=0;p<l.length;p++)l[p]?(left=left<<2|left>>>26,right=right<<2|right>>>26):(left=
left<<1|left>>>27,right=right<<1|right>>>27),left&=-15,right&=-15,g=pc2bytes0[left>>>28]|pc2bytes1[left>>>24&15]|pc2bytes2[left>>>20&15]|pc2bytes3[left>>>16&15]|pc2bytes4[left>>>12&15]|pc2bytes5[left>>>8&15]|pc2bytes6[left>>>4&15],b=pc2bytes7[right>>>28]|pc2bytes8[right>>>24&15]|pc2bytes9[right>>>20&15]|pc2bytes10[right>>>16&15]|pc2bytes11[right>>>12&15]|pc2bytes12[right>>>8&15]|pc2bytes13[right>>>4&15],d=(b>>>16^g)&65535,k[v++]=g^d,k[v++]=b^d<<16}return k}
function stringToHex(f){for(var e="0x",k="0123456789abcdef".split(""),l=0;l<f.length;l++)e+=k[f.charCodeAt(l)>>4]+k[f.charCodeAt(l)&15];return e}function hexToString(f){for(var e="",k="0x"==f.substr(0,2)?2:0;k<f.length;k+=2)e+=String.fromCharCode(parseInt(f.substr(k,2),16));return e};
function getQueryVariable(c){for(var a=window.location.search.substring(1).split("&"),b=0;b<a.length;b+=1){var d=a[b].split("=");if(d[0]==c)return d[1]}return""}function TimeFromTics(c){var a=Math.floor(c/60),b=Math.floor(a/60),a=a%60;return(10>b?"0"+b:b)+":"+(10>a?"0"+a:a)+"."+Math.floor(c%60/6)};
// stats.js - http://github.com/mrdoob/stats.js
var Stats = function () {
    var l = Date.now(), m = l, g = 0, n = Infinity, o = 0, h = 0, p = Infinity, q = 0, r = 0, s = 0, f = document.createElement("div");
    f.id = "stats";
    f.addEventListener("mousedown", function (b) {
        b.preventDefault();
        t(++s % 2)
    }, !1);
    f.style.cssText = "width:80px;opacity:0.9;cursor:pointer";
    var a = document.createElement("div");
    a.id = "fps";
    a.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#002";
    f.appendChild(a);
    var i = document.createElement("div");
    i.id = "fpsText";
    i.style.cssText = "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
    i.innerHTML = "FPS";
    a.appendChild(i);
    var c = document.createElement("div");
    c.id = "fpsGraph";
    c.style.cssText = "position:relative;width:74px;height:30px;background-color:#0ff";
    for (a.appendChild(c); 74 > c.children.length;) {
        var j = document.createElement("span");
        j.style.cssText = "width:1px;height:30px;float:left;background-color:#113";
        c.appendChild(j)
    }
    var d = document.createElement("div");
    d.id = "ms";
    d.style.cssText = "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";
    f.appendChild(d);
    var k = document.createElement("div");
    k.id = "msText";
    k.style.cssText = "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
    k.innerHTML = "MS";
    d.appendChild(k);
    var e = document.createElement("div");
    e.id = "msGraph";
    e.style.cssText = "position:relative;width:74px;height:30px;background-color:#0f0";
    for (d.appendChild(e); 74 > e.children.length;)j = document.createElement("span"), j.style.cssText = "width:1px;height:30px;float:left;background-color:#131", e.appendChild(j);
    var t = function (b) {
        s = b;
        switch (s) {
            case 0:
                a.style.display =
                    "block";
                d.style.display = "none";
                break;
            case 1:
                a.style.display = "none", d.style.display = "block"
        }
    };
    return {
        REVISION: 12, domElement: f, setMode: t, begin: function () {
            l = Date.now()
        }, end: function () {
            var b = Date.now();
            g = b - l;
            n = Math.min(n, g);
            o = Math.max(o, g);
            k.textContent = g + " MS (" + n + "-" + o + ")";
            var a = Math.min(30, 30 - 30 * (g / 200));
            e.appendChild(e.firstChild).style.height = a + "px";
            r++;
            b > m + 1E3 && (h = Math.round(1E3 * r / (b - m)), p = Math.min(p, h), q = Math.max(q, h), i.textContent = h + " FPS (" + p + "-" + q + ")", a = Math.min(30, 30 - 30 * (h / 100)), c.appendChild(c.firstChild).style.height =
                a + "px", m = b, r = 0);
            return b
        }, update: function () {
            l = this.end()
        }
    }
};
"object" === typeof module && (module.exports = Stats);
var Stats=function(){var n=Date.now(),p=n,g=0,q=Infinity,r=0,h=0,t=Infinity,u=0,v=0,w=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();x(++w%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var k=document.createElement("div");k.id="fpsText";k.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
k.innerHTML="FPS";a.appendChild(k);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var l=document.createElement("span");l.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(l)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var m=document.createElement("div");
m.id="msText";m.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";m.innerHTML="MS";d.appendChild(m);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)l=document.createElement("span"),l.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(l);var x=function(b){w=b;switch(w){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:x,begin:function(){n=Date.now()},end:function(){var b=Date.now();g=b-n;q=Math.min(q,g);r=Math.max(r,g);m.textContent=g+" MS ("+q+"-"+r+")";var a=Math.min(30,30-g/200*30);e.appendChild(e.firstChild).style.height=a+"px";v++;b>p+1E3&&(h=Math.round(1E3*v/(b-p)),t=Math.min(t,h),u=Math.max(u,h),k.textContent=h+" FPS ("+t+"-"+u+")",a=Math.min(30,30-h/100*30),c.appendChild(c.firstChild).style.height=
a+"px",p=b,v=0);return b},update:function(){n=this.end()}}};"object"===typeof module&&(module.exports=Stats);
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.transition", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.collapse", []).directive("collapse", ["$animate", function (a) {
    return {
        link: function (b, c, d) {
            function e() {
                c.removeClass("collapse").addClass("collapsing"), a.addClass(c, "in", {to: {height: c[0].scrollHeight + "px"}}).then(f)
            }

            function f() {
                c.removeClass("collapsing"), c.css({height: "auto"})
            }

            function g() {
                c.css({height: c[0].scrollHeight + "px"}).removeClass("collapse").addClass("collapsing"), a.removeClass(c, "in", {to: {height: "0"}}).then(h)
            }

            function h() {
                c.css({height: "0"}), c.removeClass("collapsing"), c.addClass("collapse")
            }

            b.$watch(d.collapse, function (a) {
                a ? g() : e()
            })
        }
    }
}]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("accordionConfig", {closeOthers: !0}).controller("AccordionController", ["$scope", "$attrs", "accordionConfig", function (a, b, c) {
    this.groups = [], this.closeOthers = function (d) {
        var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;
        e && angular.forEach(this.groups, function (a) {
            a !== d && (a.isOpen = !1)
        })
    }, this.addGroup = function (a) {
        var b = this;
        this.groups.push(a), a.$on("$destroy", function () {
            b.removeGroup(a)
        })
    }, this.removeGroup = function (a) {
        var b = this.groups.indexOf(a);
        -1 !== b && this.groups.splice(b, 1)
    }
}]).directive("accordion", function () {
    return {
        restrict: "EA",
        controller: "AccordionController",
        transclude: !0,
        replace: !1,
        templateUrl: "template/accordion/accordion.html"
    }
}).directive("accordionGroup", function () {
    return {
        require: "^accordion",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/accordion/accordion-group.html",
        scope: {heading: "@", isOpen: "=?", isDisabled: "=?"},
        controller: function () {
            this.setHeading = function (a) {
                this.heading = a
            }
        },
        link: function (a, b, c, d) {
            d.addGroup(a), a.$watch("isOpen", function (b) {
                b && d.closeOthers(a)
            }), a.toggleOpen = function () {
                a.isDisabled || (a.isOpen = !a.isOpen)
            }
        }
    }
}).directive("accordionHeading", function () {
    return {
        restrict: "EA",
        transclude: !0,
        template: "",
        replace: !0,
        require: "^accordionGroup",
        link: function (a, b, c, d, e) {
            d.setHeading(e(a, angular.noop))
        }
    }
}).directive("accordionTransclude", function () {
    return {
        require: "^accordionGroup", link: function (a, b, c, d) {
            a.$watch(function () {
                return d[c.accordionTransclude]
            }, function (a) {
                a && (b.html(""), b.append(a))
            })
        }
    }
}), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs", function (a, b) {
    a.closeable = "close"in b, this.close = a.close
}]).directive("alert", function () {
    return {
        restrict: "EA",
        controller: "AlertController",
        templateUrl: "template/alert/alert.html",
        transclude: !0,
        replace: !0,
        scope: {type: "@", close: "&"}
    }
}).directive("dismissOnTimeout", ["$timeout", function (a) {
    return {
        require: "alert", link: function (b, c, d, e) {
            a(function () {
                e.close()
            }, parseInt(d.dismissOnTimeout, 10))
        }
    }
}]), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function () {
    return function (a, b, c) {
        b.addClass("ng-binding").data("$binding", c.bindHtmlUnsafe), a.$watch(c.bindHtmlUnsafe, function (a) {
            b.html(a || "")
        })
    }
}), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
    activeClass: "active",
    toggleEvent: "click"
}).controller("ButtonsController", ["buttonConfig", function (a) {
    this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click"
}]).directive("btnRadio", function () {
    return {
        require: ["btnRadio", "ngModel"], controller: "ButtonsController", link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f.$render = function () {
                b.toggleClass(e.activeClass, angular.equals(f.$modelValue, a.$eval(c.btnRadio)))
            }, b.bind(e.toggleEvent, function () {
                var d = b.hasClass(e.activeClass);
                (!d || angular.isDefined(c.uncheckable)) && a.$apply(function () {
                    f.$setViewValue(d ? null : a.$eval(c.btnRadio)), f.$render()
                })
            })
        }
    }
}).directive("btnCheckbox", function () {
    return {
        require: ["btnCheckbox", "ngModel"], controller: "ButtonsController", link: function (a, b, c, d) {
            function e() {
                return g(c.btnCheckboxTrue, !0)
            }

            function f() {
                return g(c.btnCheckboxFalse, !1)
            }

            function g(b, c) {
                var d = a.$eval(b);
                return angular.isDefined(d) ? d : c
            }

            var h = d[0], i = d[1];
            i.$render = function () {
                b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()))
            }, b.bind(h.toggleEvent, function () {
                a.$apply(function () {
                    i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render()
                })
            })
        }
    }
}), angular.module("ui.bootstrap.carousel", []).controller("CarouselController", ["$scope", "$interval", "$animate", function (a, b, c) {
    function d(a) {
        if (angular.isUndefined(k[a].index))return k[a];
        {
            var b;
            k.length
        }
        for (b = 0; b < k.length; ++b)if (k[b].index == a)return k[b]
    }

    function e() {
        f();
        var c = +a.interval;
        !isNaN(c) && c > 0 && (h = b(g, c))
    }

    function f() {
        h && (b.cancel(h), h = null)
    }

    function g() {
        var b = +a.interval;
        i && !isNaN(b) && b > 0 ? a.next() : a.pause()
    }

    var h, i, j = this, k = j.slides = a.slides = [], l = -1;
    j.currentSlide = null;
    var m = !1;
    j.select = a.select = function (b, d) {
        function f() {
            m || (angular.extend(b, {direction: d, active: !0}), angular.extend(j.currentSlide || {}, {
                direction: d,
                active: !1
            }), c.enabled() && !a.noTransition && b.$element && (a.$currentTransition = !0, b.$element.one("$animate:close", function () {
                a.$currentTransition = null
            })), j.currentSlide = b, l = g, e())
        }

        var g = j.indexOfSlide(b);
        void 0 === d && (d = g > j.getCurrentIndex() ? "next" : "prev"), b && b !== j.currentSlide && f()
    }, a.$on("$destroy", function () {
        m = !0
    }), j.getCurrentIndex = function () {
        return j.currentSlide && angular.isDefined(j.currentSlide.index) ? +j.currentSlide.index : l
    }, j.indexOfSlide = function (a) {
        return angular.isDefined(a.index) ? +a.index : k.indexOf(a)
    }, a.next = function () {
        var b = (j.getCurrentIndex() + 1) % k.length;
        return a.$currentTransition ? void 0 : j.select(d(b), "next")
    }, a.prev = function () {
        var b = j.getCurrentIndex() - 1 < 0 ? k.length - 1 : j.getCurrentIndex() - 1;
        return a.$currentTransition ? void 0 : j.select(d(b), "prev")
    }, a.isActive = function (a) {
        return j.currentSlide === a
    }, a.$watch("interval", e), a.$on("$destroy", f), a.play = function () {
        i || (i = !0, e())
    }, a.pause = function () {
        a.noPause || (i = !1, f())
    }, j.addSlide = function (b, c) {
        b.$element = c, k.push(b), 1 === k.length || b.active ? (j.select(k[k.length - 1]), 1 == k.length && a.play()) : b.active = !1
    }, j.removeSlide = function (a) {
        angular.isDefined(a.index) && k.sort(function (a, b) {
            return +a.index > +b.index
        });
        var b = k.indexOf(a);
        k.splice(b, 1), k.length > 0 && a.active ? j.select(b >= k.length ? k[b - 1] : k[b]) : l > b && l--
    }
}]).directive("carousel", [function () {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        controller: "CarouselController",
        require: "carousel",
        templateUrl: "template/carousel/carousel.html",
        scope: {interval: "=", noTransition: "=", noPause: "="}
    }
}]).directive("slide", function () {
    return {
        require: "^carousel",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/carousel/slide.html",
        scope: {active: "=?", index: "=?"},
        link: function (a, b, c, d) {
            d.addSlide(a, b), a.$on("$destroy", function () {
                d.removeSlide(a)
            }), a.$watch("active", function (b) {
                b && d.select(a)
            })
        }
    }
}).animation(".item", ["$animate", function (a) {
    return {
        beforeAddClass: function (b, c, d) {
            if ("active" == c && b.parent() && !b.parent().scope().noTransition) {
                var e = !1, f = b.isolateScope().direction, g = "next" == f ? "left" : "right";
                return b.addClass(f), a.addClass(b, g).then(function () {
                    e || b.removeClass(g + " " + f), d()
                }), function () {
                    e = !0
                }
            }
            d()
        }, beforeRemoveClass: function (b, c, d) {
            if ("active" == c && b.parent() && !b.parent().scope().noTransition) {
                var e = !1, f = b.isolateScope().direction, g = "next" == f ? "left" : "right";
                return a.addClass(b, g).then(function () {
                    e || b.removeClass(g), d()
                }), function () {
                    e = !0
                }
            }
            d()
        }
    }
}]), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter", function (a, b) {
    function c(a) {
        var c = [], d = a.split("");
        return angular.forEach(f, function (b, e) {
            var f = a.indexOf(e);
            if (f > -1) {
                a = a.split(""), d[f] = "(" + b.regex + ")", a[f] = "$";
                for (var g = f + 1, h = f + e.length; h > g; g++)d[g] = "", a[g] = "$";
                a = a.join(""), c.push({index: f, apply: b.apply})
            }
        }), {regex: new RegExp("^" + d.join("") + "$"), map: b(c, "index")}
    }

    function d(a, b, c) {
        return 1 > c ? !1 : 1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 === b || 5 === b || 8 === b || 10 === b ? 31 > c : !0
    }

    var e = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
    this.parsers = {};
    var f = {
        yyyy: {
            regex: "\\d{4}", apply: function (a) {
                this.year = +a
            }
        },
        yy: {
            regex: "\\d{2}", apply: function (a) {
                this.year = +a + 2e3
            }
        },
        y: {
            regex: "\\d{1,4}", apply: function (a) {
                this.year = +a
            }
        },
        MMMM: {
            regex: a.DATETIME_FORMATS.MONTH.join("|"), apply: function (b) {
                this.month = a.DATETIME_FORMATS.MONTH.indexOf(b)
            }
        },
        MMM: {
            regex: a.DATETIME_FORMATS.SHORTMONTH.join("|"), apply: function (b) {
                this.month = a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)
            }
        },
        MM: {
            regex: "0[1-9]|1[0-2]", apply: function (a) {
                this.month = a - 1
            }
        },
        M: {
            regex: "[1-9]|1[0-2]", apply: function (a) {
                this.month = a - 1
            }
        },
        dd: {
            regex: "[0-2][0-9]{1}|3[0-1]{1}", apply: function (a) {
                this.date = +a
            }
        },
        d: {
            regex: "[1-2]?[0-9]{1}|3[0-1]{1}", apply: function (a) {
                this.date = +a
            }
        },
        EEEE: {regex: a.DATETIME_FORMATS.DAY.join("|")},
        EEE: {regex: a.DATETIME_FORMATS.SHORTDAY.join("|")},
        HH: {
            regex: "(?:0|1)[0-9]|2[0-3]", apply: function (a) {
                this.hours = +a
            }
        },
        H: {
            regex: "1?[0-9]|2[0-3]", apply: function (a) {
                this.hours = +a
            }
        },
        mm: {
            regex: "[0-5][0-9]", apply: function (a) {
                this.minutes = +a
            }
        },
        m: {
            regex: "[0-9]|[1-5][0-9]", apply: function (a) {
                this.minutes = +a
            }
        },
        sss: {
            regex: "[0-9][0-9][0-9]", apply: function (a) {
                this.milliseconds = +a
            }
        },
        ss: {
            regex: "[0-5][0-9]", apply: function (a) {
                this.seconds = +a
            }
        },
        s: {
            regex: "[0-9]|[1-5][0-9]", apply: function (a) {
                this.seconds = +a
            }
        }
    };
    this.parse = function (b, f, g) {
        if (!angular.isString(b) || !f)return b;
        f = a.DATETIME_FORMATS[f] || f, f = f.replace(e, "\\$&"), this.parsers[f] || (this.parsers[f] = c(f));
        var h = this.parsers[f], i = h.regex, j = h.map, k = b.match(i);
        if (k && k.length) {
            var l, m;
            l = g ? {
                year: g.getFullYear(),
                month: g.getMonth(),
                date: g.getDate(),
                hours: g.getHours(),
                minutes: g.getMinutes(),
                seconds: g.getSeconds(),
                milliseconds: g.getMilliseconds()
            } : {year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
            for (var n = 1, o = k.length; o > n; n++) {
                var p = j[n - 1];
                p.apply && p.apply.call(l, k[n])
            }
            return d(l.year, l.month, l.date) && (m = new Date(l.year, l.month, l.date, l.hours, l.minutes, l.seconds, l.milliseconds || 0)), m
        }
    }
}]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function (a, b) {
    function c(a, c) {
        return a.currentStyle ? a.currentStyle[c] : b.getComputedStyle ? b.getComputedStyle(a)[c] : a.style[c]
    }

    function d(a) {
        return "static" === (c(a, "position") || "static")
    }

    var e = function (b) {
        for (var c = a[0], e = b.offsetParent || c; e && e !== c && d(e);)e = e.offsetParent;
        return e || c
    };
    return {
        position: function (b) {
            var c = this.offset(b), d = {top: 0, left: 0}, f = e(b[0]);
            f != a[0] && (d = this.offset(angular.element(f)), d.top += f.clientTop - f.scrollTop, d.left += f.clientLeft - f.scrollLeft);
            var g = b[0].getBoundingClientRect();
            return {
                width: g.width || b.prop("offsetWidth"),
                height: g.height || b.prop("offsetHeight"),
                top: c.top - d.top,
                left: c.left - d.left
            }
        }, offset: function (c) {
            var d = c[0].getBoundingClientRect();
            return {
                width: d.width || c.prop("offsetWidth"),
                height: d.height || c.prop("offsetHeight"),
                top: d.top + (b.pageYOffset || a[0].documentElement.scrollTop),
                left: d.left + (b.pageXOffset || a[0].documentElement.scrollLeft)
            }
        }, positionElements: function (a, b, c, d) {
            var e, f, g, h, i = c.split("-"), j = i[0], k = i[1] || "center";
            e = d ? this.offset(a) : this.position(a), f = b.prop("offsetWidth"), g = b.prop("offsetHeight");
            var l = {
                center: function () {
                    return e.left + e.width / 2 - f / 2
                }, left: function () {
                    return e.left
                }, right: function () {
                    return e.left + e.width
                }
            }, m = {
                center: function () {
                    return e.top + e.height / 2 - g / 2
                }, top: function () {
                    return e.top
                }, bottom: function () {
                    return e.top + e.height
                }
            };
            switch (j) {
                case"right":
                    h = {top: m[k](), left: l[j]()};
                    break;
                case"left":
                    h = {top: m[k](), left: e.left - f};
                    break;
                case"bottom":
                    h = {top: m[j](), left: l[k]()};
                    break;
                default:
                    h = {top: e.top - g, left: l[k]()}
            }
            return h
        }
    }
}]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).constant("datepickerConfig", {
    formatDay: "dd",
    formatMonth: "MMMM",
    formatYear: "yyyy",
    formatDayHeader: "EEE",
    formatDayTitle: "MMMM yyyy",
    formatMonthTitle: "yyyy",
    datepickerMode: "day",
    minMode: "day",
    maxMode: "year",
    showWeeks: !0,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null,
    shortcutPropagation: !1
}).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function (a, b, c, d, e, f, g, h) {
    var i = this, j = {$setViewValue: angular.noop};
    this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange", "shortcutPropagation"], function (c, e) {
        i[c] = angular.isDefined(b[c]) ? 8 > e ? d(b[c])(a.$parent) : a.$parent.$eval(b[c]) : h[c]
    }), angular.forEach(["minDate", "maxDate"], function (d) {
        b[d] ? a.$parent.$watch(c(b[d]), function (a) {
            i[d] = a ? new Date(a) : null, i.refreshView()
        }) : i[d] = h[d] ? new Date(h[d]) : null
    }), a.datepickerMode = a.datepickerMode || h.datepickerMode, a.maxMode = i.maxMode, a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), angular.isDefined(b.initDate) ? (this.activeDate = a.$parent.$eval(b.initDate) || new Date, a.$parent.$watch(b.initDate, function (a) {
        a && (j.$isEmpty(j.$modelValue) || j.$invalid) && (i.activeDate = a, i.refreshView())
    })) : this.activeDate = new Date, a.isActive = function (b) {
        return 0 === i.compare(b.date, i.activeDate) ? (a.activeDateId = b.uid, !0) : !1
    }, this.init = function (a) {
        j = a, j.$render = function () {
            i.render()
        }
    }, this.render = function () {
        if (j.$viewValue) {
            var a = new Date(j.$viewValue), b = !isNaN(a);
            b ? this.activeDate = a : f.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), j.$setValidity("date", b)
        }
        this.refreshView()
    }, this.refreshView = function () {
        if (this.element) {
            this._refreshView();
            var a = j.$viewValue ? new Date(j.$viewValue) : null;
            j.$setValidity("date-disabled", !a || this.element && !this.isDisabled(a))
        }
    }, this.createDateObject = function (a, b) {
        var c = j.$viewValue ? new Date(j.$viewValue) : null;
        return {
            date: a,
            label: g(a, b),
            selected: c && 0 === this.compare(a, c),
            disabled: this.isDisabled(a),
            current: 0 === this.compare(a, new Date),
            customClass: this.customClass(a)
        }
    }, this.isDisabled = function (c) {
        return this.minDate && this.compare(c, this.minDate) < 0 || this.maxDate && this.compare(c, this.maxDate) > 0 || b.dateDisabled && a.dateDisabled({
                date: c,
                mode: a.datepickerMode
            })
    }, this.customClass = function (b) {
        return a.customClass({date: b, mode: a.datepickerMode})
    }, this.split = function (a, b) {
        for (var c = []; a.length > 0;)c.push(a.splice(0, b));
        return c
    }, a.select = function (b) {
        if (a.datepickerMode === i.minMode) {
            var c = j.$viewValue ? new Date(j.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
            c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), j.$setViewValue(c), j.$render()
        } else i.activeDate = b, a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) - 1]
    }, a.move = function (a) {
        var b = i.activeDate.getFullYear() + a * (i.step.years || 0), c = i.activeDate.getMonth() + a * (i.step.months || 0);
        i.activeDate.setFullYear(b, c, 1), i.refreshView()
    }, a.toggleMode = function (b) {
        b = b || 1, a.datepickerMode === i.maxMode && 1 === b || a.datepickerMode === i.minMode && -1 === b || (a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) + b])
    }, a.keys = {
        13: "enter",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    var k = function () {
        e(function () {
            i.element[0].focus()
        }, 0, !1)
    };
    a.$on("datepicker.focus", k), a.keydown = function (b) {
        var c = a.keys[b.which];
        if (c && !b.shiftKey && !b.altKey)if (b.preventDefault(), i.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
            if (i.isDisabled(i.activeDate))return;
            a.select(i.activeDate), k()
        } else!b.ctrlKey || "up" !== c && "down" !== c ? (i.handleKeyDown(c, b), i.refreshView()) : (a.toggleMode("up" === c ? 1 : -1), k())
    }
}]).directive("datepicker", function () {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/datepicker.html",
        scope: {datepickerMode: "=?", dateDisabled: "&", customClass: "&", shortcutPropagation: "&?"},
        require: ["datepicker", "?^ngModel"],
        controller: "DatepickerController",
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f && e.init(f)
        }
    }
}).directive("daypicker", ["dateFilter", function (a) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/day.html",
        require: "^datepicker",
        link: function (b, c, d, e) {
            function f(a, b) {
                return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? i[b] : 29
            }

            function g(a, b) {
                var c = new Array(b), d = new Date(a), e = 0;
                for (d.setHours(12); b > e;)c[e++] = new Date(d), d.setDate(d.getDate() + 1);
                return c
            }

            function h(a) {
                var b = new Date(a);
                b.setDate(b.getDate() + 4 - (b.getDay() || 7));
                var c = b.getTime();
                return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1
            }

            b.showWeeks = e.showWeeks, e.step = {months: 1}, e.element = c;
            var i = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            e._refreshView = function () {
                var c = e.activeDate.getFullYear(), d = e.activeDate.getMonth(), f = new Date(c, d, 1), i = e.startingDay - f.getDay(), j = i > 0 ? 7 - i : -i, k = new Date(f);
                j > 0 && k.setDate(-j + 1);
                for (var l = g(k, 42), m = 0; 42 > m; m++)l[m] = angular.extend(e.createDateObject(l[m], e.formatDay), {
                    secondary: l[m].getMonth() !== d,
                    uid: b.uniqueId + "-" + m
                });
                b.labels = new Array(7);
                for (var n = 0; 7 > n; n++)b.labels[n] = {
                    abbr: a(l[n].date, e.formatDayHeader),
                    full: a(l[n].date, "EEEE")
                };
                if (b.title = a(e.activeDate, e.formatDayTitle), b.rows = e.split(l, 7), b.showWeeks) {
                    b.weekNumbers = [];
                    for (var o = (11 - e.startingDay) % 7, p = b.rows.length, q = 0; p > q; q++)b.weekNumbers.push(h(b.rows[q][o].date))
                }
            }, e.compare = function (a, b) {
                return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())
            }, e.handleKeyDown = function (a) {
                var b = e.activeDate.getDate();
                if ("left" === a)b -= 1; else if ("up" === a)b -= 7; else if ("right" === a)b += 1; else if ("down" === a)b += 7; else if ("pageup" === a || "pagedown" === a) {
                    var c = e.activeDate.getMonth() + ("pageup" === a ? -1 : 1);
                    e.activeDate.setMonth(c, 1), b = Math.min(f(e.activeDate.getFullYear(), e.activeDate.getMonth()), b)
                } else"home" === a ? b = 1 : "end" === a && (b = f(e.activeDate.getFullYear(), e.activeDate.getMonth()));
                e.activeDate.setDate(b)
            }, e.refreshView()
        }
    }
}]).directive("monthpicker", ["dateFilter", function (a) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/month.html",
        require: "^datepicker",
        link: function (b, c, d, e) {
            e.step = {years: 1}, e.element = c, e._refreshView = function () {
                for (var c = new Array(12), d = e.activeDate.getFullYear(), f = 0; 12 > f; f++)c[f] = angular.extend(e.createDateObject(new Date(d, f, 1), e.formatMonth), {uid: b.uniqueId + "-" + f});
                b.title = a(e.activeDate, e.formatMonthTitle), b.rows = e.split(c, 3)
            }, e.compare = function (a, b) {
                return new Date(a.getFullYear(), a.getMonth()) - new Date(b.getFullYear(), b.getMonth())
            }, e.handleKeyDown = function (a) {
                var b = e.activeDate.getMonth();
                if ("left" === a)b -= 1; else if ("up" === a)b -= 3; else if ("right" === a)b += 1; else if ("down" === a)b += 3; else if ("pageup" === a || "pagedown" === a) {
                    var c = e.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);
                    e.activeDate.setFullYear(c)
                } else"home" === a ? b = 0 : "end" === a && (b = 11);
                e.activeDate.setMonth(b)
            }, e.refreshView()
        }
    }
}]).directive("yearpicker", ["dateFilter", function () {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/year.html",
        require: "^datepicker",
        link: function (a, b, c, d) {
            function e(a) {
                return parseInt((a - 1) / f, 10) * f + 1
            }

            var f = d.yearRange;
            d.step = {years: f}, d.element = b, d._refreshView = function () {
                for (var b = new Array(f), c = 0, g = e(d.activeDate.getFullYear()); f > c; c++)b[c] = angular.extend(d.createDateObject(new Date(g + c, 0, 1), d.formatYear), {uid: a.uniqueId + "-" + c});
                a.title = [b[0].label, b[f - 1].label].join(" - "), a.rows = d.split(b, 5)
            }, d.compare = function (a, b) {
                return a.getFullYear() - b.getFullYear()
            }, d.handleKeyDown = function (a) {
                var b = d.activeDate.getFullYear();
                "left" === a ? b -= 1 : "up" === a ? b -= 5 : "right" === a ? b += 1 : "down" === a ? b += 5 : "pageup" === a || "pagedown" === a ? b += ("pageup" === a ? -1 : 1) * d.step.years : "home" === a ? b = e(d.activeDate.getFullYear()) : "end" === a && (b = e(d.activeDate.getFullYear()) + f - 1), d.activeDate.setFullYear(b)
            }, d.refreshView()
        }
    }
}]).constant("datepickerPopupConfig", {
    datepickerPopup: "yyyy-MM-dd",
    html5Types: {date: "yyyy-MM-dd", "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss", month: "yyyy-MM"},
    currentText: "Today",
    clearText: "Clear",
    closeText: "Done",
    closeOnDateSelection: !0,
    appendToBody: !1,
    showButtonBar: !0
}).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function (a, b, c, d, e, f, g) {
    return {
        restrict: "EA",
        require: "ngModel",
        scope: {isOpen: "=?", currentText: "@", clearText: "@", closeText: "@", dateDisabled: "&", customClass: "&"},
        link: function (h, i, j, k) {
            function l(a) {
                return a.replace(/([A-Z])/g, function (a) {
                    return "-" + a.toLowerCase()
                })
            }

            function m(a) {
                if (angular.isNumber(a) && (a = new Date(a)), a) {
                    if (angular.isDate(a) && !isNaN(a))return a;
                    if (angular.isString(a)) {
                        var b = f.parse(a, o, h.date) || new Date(a);
                        return isNaN(b) ? void 0 : b
                    }
                    return void 0
                }
                return null
            }

            function n(a, b) {
                var c = a || b;
                if (angular.isNumber(c) && (c = new Date(c)), c) {
                    if (angular.isDate(c) && !isNaN(c))return !0;
                    if (angular.isString(c)) {
                        var d = f.parse(c, o) || new Date(c);
                        return !isNaN(d)
                    }
                    return !1
                }
                return !0
            }

            var o, p = angular.isDefined(j.closeOnDateSelection) ? h.$parent.$eval(j.closeOnDateSelection) : g.closeOnDateSelection, q = angular.isDefined(j.datepickerAppendToBody) ? h.$parent.$eval(j.datepickerAppendToBody) : g.appendToBody;
            h.showButtonBar = angular.isDefined(j.showButtonBar) ? h.$parent.$eval(j.showButtonBar) : g.showButtonBar, h.getText = function (a) {
                return h[a + "Text"] || g[a + "Text"]
            };
            var r = !1;
            if (g.html5Types[j.type] ? (o = g.html5Types[j.type], r = !0) : (o = j.datepickerPopup || g.datepickerPopup, j.$observe("datepickerPopup", function (a) {
                    var b = a || g.datepickerPopup;
                    if (b !== o && (o = b, k.$modelValue = null, !o))throw new Error("datepickerPopup must have a date format specified.")
                })), !o)throw new Error("datepickerPopup must have a date format specified.");
            if (r && j.datepickerPopup)throw new Error("HTML5 date input types do not support custom formats.");
            var s = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
            s.attr({"ng-model": "date", "ng-change": "dateSelection()"});
            var t = angular.element(s.children()[0]);
            if (r && "month" == j.type && (t.attr("datepicker-mode", '"month"'), t.attr("min-mode", "month")), j.datepickerOptions) {
                var u = h.$parent.$eval(j.datepickerOptions);
                u.initDate && (h.initDate = u.initDate, t.attr("init-date", "initDate"), delete u.initDate), angular.forEach(u, function (a, b) {
                    t.attr(l(b), a)
                })
            }
            h.watchData = {}, angular.forEach(["minDate", "maxDate", "datepickerMode", "initDate", "shortcutPropagation"], function (a) {
                if (j[a]) {
                    var c = b(j[a]);
                    if (h.$parent.$watch(c, function (b) {
                            h.watchData[a] = b
                        }), t.attr(l(a), "watchData." + a), "datepickerMode" === a) {
                        var d = c.assign;
                        h.$watch("watchData." + a, function (a, b) {
                            a !== b && d(h.$parent, a)
                        })
                    }
                }
            }), j.dateDisabled && t.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), j.showWeeks && t.attr("show-weeks", j.showWeeks), j.customClass && t.attr("custom-class", "customClass({ date: date, mode: mode })"), r ? k.$formatters.push(function (a) {
                return h.date = a, a
            }) : (k.$$parserName = "date", k.$validators.date = n, k.$parsers.unshift(m), k.$formatters.push(function (a) {
                return h.date = a, k.$isEmpty(a) ? a : e(a, o)
            })), h.dateSelection = function (a) {
                angular.isDefined(a) && (h.date = a);
                var b = h.date ? e(h.date, o) : "";
                i.val(b), k.$setViewValue(b), p && (h.isOpen = !1, i[0].focus())
            }, k.$viewChangeListeners.push(function () {
                h.date = f.parse(k.$viewValue, o, h.date) || new Date(k.$viewValue)
            });
            var v = function (a) {
                h.isOpen && a.target !== i[0] && h.$apply(function () {
                    h.isOpen = !1
                })
            }, w = function (a) {
                h.keydown(a)
            };
            i.bind("keydown", w), h.keydown = function (a) {
                27 === a.which ? (a.preventDefault(), h.isOpen && a.stopPropagation(), h.close()) : 40 !== a.which || h.isOpen || (h.isOpen = !0)
            }, h.$watch("isOpen", function (a) {
                a ? (h.$broadcast("datepicker.focus"), h.position = q ? d.offset(i) : d.position(i), h.position.top = h.position.top + i.prop("offsetHeight"), c.bind("click", v)) : c.unbind("click", v)
            }), h.select = function (a) {
                if ("today" === a) {
                    var b = new Date;
                    angular.isDate(h.date) ? (a = new Date(h.date), a.setFullYear(b.getFullYear(), b.getMonth(), b.getDate())) : a = new Date(b.setHours(0, 0, 0, 0))
                }
                h.dateSelection(a)
            }, h.close = function () {
                h.isOpen = !1, i[0].focus()
            };
            var x = a(s)(h);
            s.remove(), q ? c.find("body").append(x) : i.after(x), h.$on("$destroy", function () {
                x.remove(), i.unbind("keydown", w), c.unbind("click", v)
            })
        }
    }
}]).directive("datepickerPopupWrap", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        templateUrl: "template/datepicker/popup.html",
        link: function (a, b) {
            b.bind("click", function (a) {
                a.preventDefault(), a.stopPropagation()
            })
        }
    }
}), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.position"]).constant("dropdownConfig", {openClass: "open"}).service("dropdownService", ["$document", "$rootScope", function (a, b) {
    var c = null;
    this.open = function (b) {
        c || (a.bind("click", d), a.bind("keydown", e)), c && c !== b && (c.isOpen = !1), c = b
    }, this.close = function (b) {
        c === b && (c = null, a.unbind("click", d), a.unbind("keydown", e))
    };
    var d = function (a) {
        if (c && (!a || "disabled" !== c.getAutoClose())) {
            var d = c.getToggleElement();
            if (!(a && d && d[0].contains(a.target))) {
                var e = c.getElement();
                a && "outsideClick" === c.getAutoClose() && e && e[0].contains(a.target) || (c.isOpen = !1, b.$$phase || c.$apply())
            }
        }
    }, e = function (a) {
        27 === a.which && (c.focusToggleElement(), d())
    }
}]).controller("DropdownController", ["$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", "$position", "$document", function (a, b, c, d, e, f, g, h) {
    var i, j = this, k = a.$new(), l = d.openClass, m = angular.noop, n = b.onToggle ? c(b.onToggle) : angular.noop, o = !1;
    this.init = function (d) {
        j.$element = d, b.isOpen && (i = c(b.isOpen), m = i.assign, a.$watch(i, function (a) {
            k.isOpen = !!a
        })), o = angular.isDefined(b.dropdownAppendToBody), o && j.dropdownMenu && (h.find("body").append(j.dropdownMenu), d.on("$destroy", function () {
            j.dropdownMenu.remove()
        }))
    }, this.toggle = function (a) {
        return k.isOpen = arguments.length ? !!a : !k.isOpen
    }, this.isOpen = function () {
        return k.isOpen
    }, k.getToggleElement = function () {
        return j.toggleElement
    }, k.getAutoClose = function () {
        return b.autoClose || "always"
    }, k.getElement = function () {
        return j.$element
    }, k.focusToggleElement = function () {
        j.toggleElement && j.toggleElement[0].focus()
    }, k.$watch("isOpen", function (b, c) {
        if (o && j.dropdownMenu) {
            var d = g.positionElements(j.$element, j.dropdownMenu, "bottom-left", !0);
            j.dropdownMenu.css({top: d.top + "px", left: d.left + "px", display: b ? "block" : "none"})
        }
        f[b ? "addClass" : "removeClass"](j.$element, l), b ? (k.focusToggleElement(), e.open(k)) : e.close(k), m(a, b), angular.isDefined(b) && b !== c && n(a, {open: !!b})
    }), a.$on("$locationChangeSuccess", function () {
        k.isOpen = !1
    }), a.$on("$destroy", function () {
        k.$destroy()
    })
}]).directive("dropdown", function () {
    return {
        controller: "DropdownController", link: function (a, b, c, d) {
            d.init(b)
        }
    }
}).directive("dropdownMenu", function () {
    return {
        restrict: "AC", require: "?^dropdown", link: function (a, b, c, d) {
            d && (d.dropdownMenu = b)
        }
    }
}).directive("dropdownToggle", function () {
    return {
        require: "?^dropdown", link: function (a, b, c, d) {
            if (d) {
                d.toggleElement = b;
                var e = function (e) {
                    e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function () {
                        d.toggle()
                    })
                };
                b.bind("click", e), b.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }), a.$watch(d.isOpen, function (a) {
                    b.attr("aria-expanded", !!a)
                }), a.$on("$destroy", function () {
                    b.unbind("click", e)
                })
            }
        }
    }
}), angular.module("ui.bootstrap.modal", []).factory("$$stackedMap", function () {
    return {
        createNew: function () {
            var a = [];
            return {
                add: function (b, c) {
                    a.push({key: b, value: c})
                }, get: function (b) {
                    for (var c = 0; c < a.length; c++)if (b == a[c].key)return a[c]
                }, keys: function () {
                    for (var b = [], c = 0; c < a.length; c++)b.push(a[c].key);
                    return b
                }, top: function () {
                    return a[a.length - 1]
                }, remove: function (b) {
                    for (var c = -1, d = 0; d < a.length; d++)if (b == a[d].key) {
                        c = d;
                        break
                    }
                    return a.splice(c, 1)[0]
                }, removeTop: function () {
                    return a.splice(a.length - 1, 1)[0]
                }, length: function () {
                    return a.length
                }
            }
        }
    }
}).directive("modalBackdrop", ["$timeout", function (a) {
    function b(b) {
        b.animate = !1, a(function () {
            b.animate = !0
        })
    }

    return {
        restrict: "EA", replace: !0, templateUrl: "template/modal/backdrop.html", compile: function (a, c) {
            return a.addClass(c.backdropClass), b
        }
    }
}]).directive("modalWindow", ["$modalStack", "$q", function (a, b) {
    return {
        restrict: "EA",
        scope: {index: "@", animate: "="},
        replace: !0,
        transclude: !0,
        templateUrl: function (a, b) {
            return b.templateUrl || "template/modal/window.html"
        },
        link: function (c, d, e) {
            d.addClass(e.windowClass || ""), c.size = e.size, c.close = function (b) {
                var c = a.getTop();
                c && c.value.backdrop && "static" != c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"))
            }, c.$isRendered = !0;
            var f = b.defer();
            e.$observe("modalRender", function (a) {
                "true" == a && f.resolve()
            }), f.promise.then(function () {
                c.animate = !0;
                var b = d[0].querySelectorAll("[autofocus]");
                b.length ? b[0].focus() : d[0].focus();
                var e = a.getTop();
                e && a.modalRendered(e.key)
            })
        }
    }
}]).directive("modalAnimationClass", [function () {
    return {
        compile: function (a, b) {
            b.modalAnimation && a.addClass(b.modalAnimationClass)
        }
    }
}]).directive("modalTransclude", function () {
    return {
        link: function (a, b, c, d, e) {
            e(a.$parent, function (a) {
                b.empty(), b.append(a)
            })
        }
    }
}).factory("$modalStack", ["$animate", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function (a, b, c, d, e, f) {
    function g() {
        for (var a = -1, b = o.keys(), c = 0; c < b.length; c++)o.get(b[c]).value.backdrop && (a = c);
        return a
    }

    function h(a) {
        var b = c.find("body").eq(0), d = o.get(a).value;
        o.remove(a), j(d.modalDomEl, d.modalScope, function () {
            b.toggleClass(n, o.length() > 0), i()
        })
    }

    function i() {
        if (l && -1 == g()) {
            var a = m;
            j(l, m, function () {
                a = null
            }), l = void 0, m = void 0
        }
    }

    function j(c, d, f) {
        function g() {
            g.done || (g.done = !0, c.remove(), d.$destroy(), f && f())
        }

        d.animate = !1, c.attr("modal-animation") && a.enabled() ? c.one("$animate:close", function () {
            e.$evalAsync(g)
        }) : b(g)
    }

    function k(a, b, c) {
        return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented
    }

    var l, m, n = "modal-open", o = f.createNew(), p = {};
    return e.$watch(g, function (a) {
        m && (m.index = a)
    }), c.bind("keydown", function (a) {
        var b;
        27 === a.which && (b = o.top(), b && b.value.keyboard && (a.preventDefault(), e.$apply(function () {
            p.dismiss(b.key, "escape key press")
        })))
    }), p.open = function (a, b) {
        var f = c[0].activeElement;
        o.add(a, {
            deferred: b.deferred,
            renderDeferred: b.renderDeferred,
            modalScope: b.scope,
            backdrop: b.backdrop,
            keyboard: b.keyboard
        });
        var h = c.find("body").eq(0), i = g();
        if (i >= 0 && !l) {
            m = e.$new(!0), m.index = i;
            var j = angular.element('<div modal-backdrop="modal-backdrop"></div>');
            j.attr("backdrop-class", b.backdropClass), b.animation && j.attr("modal-animation", "true"), l = d(j)(m), h.append(l)
        }
        var k = angular.element('<div modal-window="modal-window"></div>');
        k.attr({
            "template-url": b.windowTemplateUrl,
            "window-class": b.windowClass,
            size: b.size,
            index: o.length() - 1,
            animate: "animate"
        }).html(b.content), b.animation && k.attr("modal-animation", "true");
        var p = d(k)(b.scope);
        o.top().value.modalDomEl = p, o.top().value.modalOpener = f, h.append(p), h.addClass(n)
    }, p.close = function (a, b) {
        var c = o.get(a);
        return c && k(c, b, !0) ? (c.value.deferred.resolve(b), h(a), c.value.modalOpener.focus(), !0) : !c
    }, p.dismiss = function (a, b) {
        var c = o.get(a);
        return c && k(c, b, !1) ? (c.value.deferred.reject(b), h(a), c.value.modalOpener.focus(), !0) : !c
    }, p.dismissAll = function (a) {
        for (var b = this.getTop(); b && this.dismiss(b.key, a);)b = this.getTop()
    }, p.getTop = function () {
        return o.top()
    }, p.modalRendered = function (a) {
        var b = o.get(a);
        b && b.value.renderDeferred.resolve()
    }, p
}]).provider("$modal", function () {
    var a = {
        options: {animation: !0, backdrop: !0, keyboard: !0},
        $get: ["$injector", "$rootScope", "$q", "$templateRequest", "$controller", "$modalStack", function (b, c, d, e, f, g) {
            function h(a) {
                return a.template ? d.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl)
            }

            function i(a) {
                var c = [];
                return angular.forEach(a, function (a) {
                    (angular.isFunction(a) || angular.isArray(a)) && c.push(d.when(b.invoke(a)))
                }), c
            }

            var j = {};
            return j.open = function (b) {
                var e = d.defer(), j = d.defer(), k = d.defer(), l = {
                    result: e.promise,
                    opened: j.promise,
                    rendered: k.promise,
                    close: function (a) {
                        return g.close(l, a)
                    },
                    dismiss: function (a) {
                        return g.dismiss(l, a)
                    }
                };
                if (b = angular.extend({}, a.options, b), b.resolve = b.resolve || {}, !b.template && !b.templateUrl)throw new Error("One of template or templateUrl options is required.");
                var m = d.all([h(b)].concat(i(b.resolve)));
                return m.then(function (a) {
                    var d = (b.scope || c).$new();
                    d.$close = l.close, d.$dismiss = l.dismiss;
                    var h, i = {}, j = 1;
                    b.controller && (i.$scope = d, i.$modalInstance = l, angular.forEach(b.resolve, function (b, c) {
                        i[c] = a[j++]
                    }), h = f(b.controller, i), b.controllerAs && (d[b.controllerAs] = h)), g.open(l, {
                        scope: d,
                        deferred: e,
                        renderDeferred: k,
                        content: a[0],
                        animation: b.animation,
                        backdrop: b.backdrop,
                        keyboard: b.keyboard,
                        backdropClass: b.backdropClass,
                        windowClass: b.windowClass,
                        windowTemplateUrl: b.windowTemplateUrl,
                        size: b.size
                    })
                }, function (a) {
                    e.reject(a)
                }), m.then(function () {
                    j.resolve(!0)
                }, function (a) {
                    j.reject(a)
                }), l
            }, j
        }]
    };
    return a
}), angular.module("ui.bootstrap.pagination", []).controller("PaginationController", ["$scope", "$attrs", "$parse", function (a, b, c) {
    var d = this, e = {$setViewValue: angular.noop}, f = b.numPages ? c(b.numPages).assign : angular.noop;
    this.init = function (g, h) {
        e = g, this.config = h, e.$render = function () {
            d.render()
        }, b.itemsPerPage ? a.$parent.$watch(c(b.itemsPerPage), function (b) {
            d.itemsPerPage = parseInt(b, 10), a.totalPages = d.calculateTotalPages()
        }) : this.itemsPerPage = h.itemsPerPage, a.$watch("totalItems", function () {
            a.totalPages = d.calculateTotalPages()
        }), a.$watch("totalPages", function (b) {
            f(a.$parent, b), a.page > b ? a.selectPage(b) : e.$render()
        })
    }, this.calculateTotalPages = function () {
        var b = this.itemsPerPage < 1 ? 1 : Math.ceil(a.totalItems / this.itemsPerPage);
        return Math.max(b || 0, 1)
    }, this.render = function () {
        a.page = parseInt(e.$viewValue, 10) || 1
    }, a.selectPage = function (b, c) {
        a.page !== b && b > 0 && b <= a.totalPages && (c && c.target && c.target.blur(), e.$setViewValue(b), e.$render())
    }, a.getText = function (b) {
        return a[b + "Text"] || d.config[b + "Text"]
    }, a.noPrevious = function () {
        return 1 === a.page
    }, a.noNext = function () {
        return a.page === a.totalPages
    }
}]).constant("paginationConfig", {
    itemsPerPage: 10,
    boundaryLinks: !1,
    directionLinks: !0,
    firstText: "First",
    previousText: "Previous",
    nextText: "Next",
    lastText: "Last",
    rotate: !0
}).directive("pagination", ["$parse", "paginationConfig", function (a, b) {
    return {
        restrict: "EA",
        scope: {totalItems: "=", firstText: "@", previousText: "@", nextText: "@", lastText: "@"},
        require: ["pagination", "?ngModel"],
        controller: "PaginationController",
        templateUrl: "template/pagination/pagination.html",
        replace: !0,
        link: function (c, d, e, f) {
            function g(a, b, c) {
                return {number: a, text: b, active: c}
            }

            function h(a, b) {
                var c = [], d = 1, e = b, f = angular.isDefined(k) && b > k;
                f && (l ? (d = Math.max(a - Math.floor(k / 2), 1), e = d + k - 1, e > b && (e = b, d = e - k + 1)) : (d = (Math.ceil(a / k) - 1) * k + 1, e = Math.min(d + k - 1, b)));
                for (var h = d; e >= h; h++) {
                    var i = g(h, h, h === a);
                    c.push(i)
                }
                if (f && !l) {
                    if (d > 1) {
                        var j = g(d - 1, "...", !1);
                        c.unshift(j)
                    }
                    if (b > e) {
                        var m = g(e + 1, "...", !1);
                        c.push(m)
                    }
                }
                return c
            }

            var i = f[0], j = f[1];
            if (j) {
                var k = angular.isDefined(e.maxSize) ? c.$parent.$eval(e.maxSize) : b.maxSize, l = angular.isDefined(e.rotate) ? c.$parent.$eval(e.rotate) : b.rotate;
                c.boundaryLinks = angular.isDefined(e.boundaryLinks) ? c.$parent.$eval(e.boundaryLinks) : b.boundaryLinks, c.directionLinks = angular.isDefined(e.directionLinks) ? c.$parent.$eval(e.directionLinks) : b.directionLinks, i.init(j, b), e.maxSize && c.$parent.$watch(a(e.maxSize), function (a) {
                    k = parseInt(a, 10), i.render()
                });
                var m = i.render;
                i.render = function () {
                    m(), c.page > 0 && c.page <= c.totalPages && (c.pages = h(c.page, c.totalPages))
                }
            }
        }
    }
}]).constant("pagerConfig", {
    itemsPerPage: 10,
    previousText: "« Previous",
    nextText: "Next »",
    align: !0
}).directive("pager", ["pagerConfig", function (a) {
    return {
        restrict: "EA",
        scope: {totalItems: "=", previousText: "@", nextText: "@"},
        require: ["pager", "?ngModel"],
        controller: "PaginationController",
        templateUrl: "template/pagination/pager.html",
        replace: !0,
        link: function (b, c, d, e) {
            var f = e[0], g = e[1];
            g && (b.align = angular.isDefined(d.align) ? b.$parent.$eval(d.align) : a.align, f.init(g, a))
        }
    }
}]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).provider("$tooltip", function () {
    function a(a) {
        var b = /[A-Z]/g, c = "-";
        return a.replace(b, function (a, b) {
            return (b ? c : "") + a.toLowerCase()
        })
    }

    var b = {placement: "top", animation: !0, popupDelay: 0, useContentExp: !1}, c = {
        mouseenter: "mouseleave",
        click: "click",
        focus: "blur"
    }, d = {};
    this.options = function (a) {
        angular.extend(d, a)
    }, this.setTriggers = function (a) {
        angular.extend(c, a)
    }, this.$get = ["$window", "$compile", "$timeout", "$document", "$position", "$interpolate", function (e, f, g, h, i, j) {
        return function (e, k, l, m) {
            function n(a) {
                var b = a || m.trigger || l, d = c[b] || b;
                return {show: b, hide: d}
            }

            m = angular.extend({}, b, d, m);
            var o = a(e), p = j.startSymbol(), q = j.endSymbol(), r = "<div " + o + '-popup title="' + p + "title" + q + '" ' + (m.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + p + "content" + q + '" ') + 'placement="' + p + "placement" + q + '" popup-class="' + p + "popupClass" + q + '" animation="animation" is-open="isOpen"origin-scope="origScope" ></div>';
            return {
                restrict: "EA", compile: function () {
                    var a = f(r);
                    return function (b, c, d) {
                        function f() {
                            E.isOpen ? l() : j()
                        }

                        function j() {
                            (!D || b.$eval(d[k + "Enable"])) && (s(), E.popupDelay ? A || (A = g(o, E.popupDelay, !1), A.then(function (a) {
                                a()
                            })) : o()())
                        }

                        function l() {
                            b.$apply(function () {
                                p()
                            })
                        }

                        function o() {
                            return A = null, z && (g.cancel(z), z = null), (m.useContentExp ? E.contentExp() : E.content) ? (q(), x.css({
                                top: 0,
                                left: 0,
                                display: "block"
                            }), E.$digest(), F(), E.isOpen = !0, E.$apply(), F) : angular.noop
                        }

                        function p() {
                            E.isOpen = !1, g.cancel(A), A = null, E.animation ? z || (z = g(r, 500)) : r()
                        }

                        function q() {
                            x && r(), y = E.$new(), x = a(y, function (a) {
                                B ? h.find("body").append(a) : c.after(a)
                            }), y.$watch(function () {
                                g(F, 0, !1)
                            }), m.useContentExp && y.$watch("contentExp()", function (a) {
                                !a && E.isOpen && p()
                            })
                        }

                        function r() {
                            z = null, x && (x.remove(), x = null), y && (y.$destroy(), y = null)
                        }

                        function s() {
                            t(), u(), v()
                        }

                        function t() {
                            E.popupClass = d[k + "Class"]
                        }

                        function u() {
                            var a = d[k + "Placement"];
                            E.placement = angular.isDefined(a) ? a : m.placement
                        }

                        function v() {
                            var a = d[k + "PopupDelay"], b = parseInt(a, 10);
                            E.popupDelay = isNaN(b) ? m.popupDelay : b
                        }

                        function w() {
                            var a = d[k + "Trigger"];
                            G(), C = n(a), C.show === C.hide ? c.bind(C.show, f) : (c.bind(C.show, j), c.bind(C.hide, l))
                        }

                        var x, y, z, A, B = angular.isDefined(m.appendToBody) ? m.appendToBody : !1, C = n(void 0), D = angular.isDefined(d[k + "Enable"]), E = b.$new(!0), F = function () {
                            if (x) {
                                var a = i.positionElements(c, x, E.placement, B);
                                a.top += "px", a.left += "px", x.css(a)
                            }
                        };
                        E.origScope = b, E.isOpen = !1, E.contentExp = function () {
                            return b.$eval(d[e])
                        }, m.useContentExp || d.$observe(e, function (a) {
                            E.content = a, !a && E.isOpen && p()
                        }), d.$observe("disabled", function (a) {
                            a && E.isOpen && p()
                        }), d.$observe(k + "Title", function (a) {
                            E.title = a
                        });
                        var G = function () {
                            c.unbind(C.show, j), c.unbind(C.hide, l)
                        };
                        w();
                        var H = b.$eval(d[k + "Animation"]);
                        E.animation = angular.isDefined(H) ? !!H : m.animation;
                        var I = b.$eval(d[k + "AppendToBody"]);
                        B = angular.isDefined(I) ? I : B, B && b.$on("$locationChangeSuccess", function () {
                            E.isOpen && p()
                        }), b.$on("$destroy", function () {
                            g.cancel(z), g.cancel(A), G(), r(), E = null
                        })
                    }
                }
            }
        }
    }]
}).directive("tooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function (a, b, c, d) {
    return {
        link: function (e, f, g) {
            var h, i, j, k = e.$eval(g.tooltipTemplateTranscludeScope), l = 0, m = function () {
                i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function () {
                    i = null
                }), i = j, j = null)
            };
            e.$watch(b.parseAsResourceUrl(g.tooltipTemplateTransclude), function (b) {
                var g = ++l;
                b ? (d(b, !0).then(function (d) {
                    if (g === l) {
                        var e = k.$new(), i = d, n = c(i)(e, function (b) {
                            m(), a.enter(b, f)
                        });
                        h = e, j = n, h.$emit("$includeContentLoaded", b)
                    }
                }, function () {
                    g === l && (m(), e.$emit("$includeContentError", b))
                }), e.$emit("$includeContentRequested", b)) : m()
            }), e.$on("$destroy", m)
        }
    }
}]).directive("tooltipClasses", function () {
    return {
        restrict: "A", link: function (a, b, c) {
            a.placement && b.addClass(a.placement), a.popupClass && b.addClass(a.popupClass), a.animation() && b.addClass(c.tooltipAnimationClass)
        }
    }
}).directive("tooltipPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-popup.html"
    }
}).directive("tooltip", ["$tooltip", function (a) {
    return a("tooltip", "tooltip", "mouseenter")
}]).directive("tooltipTemplatePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {contentExp: "&", placement: "@", popupClass: "@", animation: "&", isOpen: "&", originScope: "&"},
        templateUrl: "template/tooltip/tooltip-template-popup.html"
    }
}).directive("tooltipTemplate", ["$tooltip", function (a) {
    return a("tooltipTemplate", "tooltip", "mouseenter", {useContentExp: !0})
}]).directive("tooltipHtmlPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {contentExp: "&", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-html-popup.html"
    }
}).directive("tooltipHtml", ["$tooltip", function (a) {
    return a("tooltipHtml", "tooltip", "mouseenter", {useContentExp: !0})
}]).directive("tooltipHtmlUnsafePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
    }
}).value("tooltipHtmlUnsafeSuppressDeprecated", !1).directive("tooltipHtmlUnsafe", ["$tooltip", "tooltipHtmlUnsafeSuppressDeprecated", "$log", function (a, b, c) {
    return b || c.warn("tooltip-html-unsafe is now deprecated. Use tooltip-html or tooltip-template instead."), a("tooltipHtmlUnsafe", "tooltip", "mouseenter")
}]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("popoverTemplatePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {
            title: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/popover/popover-template.html"
    }
}).directive("popoverTemplate", ["$tooltip", function (a) {
    return a("popoverTemplate", "popover", "click", {useContentExp: !0})
}]).directive("popoverPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {title: "@", content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/popover/popover.html"
    }
}).directive("popover", ["$tooltip", function (a) {
    return a("popover", "popover", "click")
}]), angular.module("ui.bootstrap.progressbar", []).constant("progressConfig", {
    animate: !0,
    max: 100
}).controller("ProgressController", ["$scope", "$attrs", "progressConfig", function (a, b, c) {
    var d = this, e = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
    this.bars = [], a.max = angular.isDefined(a.max) ? a.max : c.max, this.addBar = function (b, c) {
        e || c.css({transition: "none"}), this.bars.push(b), b.$watch("value", function (c) {
            b.percent = +(100 * c / a.max).toFixed(2)
        }), b.$on("$destroy", function () {
            c = null, d.removeBar(b)
        })
    }, this.removeBar = function (a) {
        this.bars.splice(this.bars.indexOf(a), 1)
    }
}]).directive("progress", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        require: "progress",
        scope: {},
        templateUrl: "template/progressbar/progress.html"
    }
}).directive("bar", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        require: "^progress",
        scope: {value: "=", max: "=?", type: "@"},
        templateUrl: "template/progressbar/bar.html",
        link: function (a, b, c, d) {
            d.addBar(a, b)
        }
    }
}).directive("progressbar", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        scope: {value: "=", max: "=?", type: "@"},
        templateUrl: "template/progressbar/progressbar.html",
        link: function (a, b, c, d) {
            d.addBar(a, angular.element(b.children()[0]))
        }
    }
}), angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
    max: 5,
    stateOn: null,
    stateOff: null
}).controller("RatingController", ["$scope", "$attrs", "ratingConfig", function (a, b, c) {
    var d = {$setViewValue: angular.noop};
    this.init = function (e) {
        d = e, d.$render = this.render, d.$formatters.push(function (a) {
            return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a
        }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff;
        var f = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);
        a.range = this.buildTemplateObjects(f)
    }, this.buildTemplateObjects = function (a) {
        for (var b = 0, c = a.length; c > b; b++)a[b] = angular.extend({index: b}, {
            stateOn: this.stateOn,
            stateOff: this.stateOff
        }, a[b]);
        return a
    }, a.rate = function (b) {
        !a.readonly && b >= 0 && b <= a.range.length && (d.$setViewValue(b), d.$render())
    }, a.enter = function (b) {
        a.readonly || (a.value = b), a.onHover({value: b})
    }, a.reset = function () {
        a.value = d.$viewValue, a.onLeave()
    }, a.onKeydown = function (b) {
        /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)))
    }, this.render = function () {
        a.value = d.$viewValue
    }
}]).directive("rating", function () {
    return {
        restrict: "EA",
        require: ["rating", "ngModel"],
        scope: {readonly: "=?", onHover: "&", onLeave: "&"},
        controller: "RatingController",
        templateUrl: "template/rating/rating.html",
        replace: !0,
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            e.init(f)
        }
    }
}), angular.module("ui.bootstrap.tabs", []).controller("TabsetController", ["$scope", function (a) {
    var b = this, c = b.tabs = a.tabs = [];
    b.select = function (a) {
        angular.forEach(c, function (b) {
            b.active && b !== a && (b.active = !1, b.onDeselect())
        }), a.active = !0, a.onSelect()
    }, b.addTab = function (a) {
        c.push(a), 1 === c.length && a.active !== !1 ? a.active = !0 : a.active ? b.select(a) : a.active = !1
    }, b.removeTab = function (a) {
        var e = c.indexOf(a);
        if (a.active && c.length > 1 && !d) {
            var f = e == c.length - 1 ? e - 1 : e + 1;
            b.select(c[f])
        }
        c.splice(e, 1)
    };
    var d;
    a.$on("$destroy", function () {
        d = !0
    })
}]).directive("tabset", function () {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        scope: {type: "@"},
        controller: "TabsetController",
        templateUrl: "template/tabs/tabset.html",
        link: function (a, b, c) {
            a.vertical = angular.isDefined(c.vertical) ? a.$parent.$eval(c.vertical) : !1, a.justified = angular.isDefined(c.justified) ? a.$parent.$eval(c.justified) : !1
        }
    }
}).directive("tab", ["$parse", "$log", function (a, b) {
    return {
        require: "^tabset",
        restrict: "EA",
        replace: !0,
        templateUrl: "template/tabs/tab.html",
        transclude: !0,
        scope: {active: "=?", heading: "@", onSelect: "&select", onDeselect: "&deselect"},
        controller: function () {
        },
        compile: function (c, d, e) {
            return function (c, d, f, g) {
                c.$watch("active", function (a) {
                    a && g.select(c)
                }), c.disabled = !1, f.disable && c.$parent.$watch(a(f.disable), function (a) {
                    c.disabled = !!a
                }), f.disabled && (b.warn('Use of "disabled" attribute has been deprecated, please use "disable"'), c.$parent.$watch(a(f.disabled), function (a) {
                    c.disabled = !!a
                })), c.select = function () {
                    c.disabled || (c.active = !0)
                }, g.addTab(c), c.$on("$destroy", function () {
                    g.removeTab(c)
                }), c.$transcludeFn = e
            }
        }
    }
}]).directive("tabHeadingTransclude", [function () {
    return {
        restrict: "A", require: "^tab", link: function (a, b) {
            a.$watch("headingElement", function (a) {
                a && (b.html(""), b.append(a))
            })
        }
    }
}]).directive("tabContentTransclude", function () {
    function a(a) {
        return a.tagName && (a.hasAttribute("tab-heading") || a.hasAttribute("data-tab-heading") || "tab-heading" === a.tagName.toLowerCase() || "data-tab-heading" === a.tagName.toLowerCase())
    }

    return {
        restrict: "A", require: "^tabset", link: function (b, c, d) {
            var e = b.$eval(d.tabContentTransclude);
            e.$transcludeFn(e.$parent, function (b) {
                angular.forEach(b, function (b) {
                    a(b) ? e.headingElement = b : c.append(b)
                })
            })
        }
    }
}), angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: !0,
    meridians: null,
    readonlyInput: !1,
    mousewheel: !0,
    arrowkeys: !0
}).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function (a, b, c, d, e, f) {
    function g() {
        var b = parseInt(a.hours, 10), c = a.showMeridian ? b > 0 && 13 > b : b >= 0 && 24 > b;
        return c ? (a.showMeridian && (12 === b && (b = 0), a.meridian === p[1] && (b += 12)), b) : void 0
    }

    function h() {
        var b = parseInt(a.minutes, 10);
        return b >= 0 && 60 > b ? b : void 0
    }

    function i(a) {
        return angular.isDefined(a) && a.toString().length < 2 ? "0" + a : a.toString()
    }

    function j(a) {
        k(), o.$setViewValue(new Date(n)), l(a)
    }

    function k() {
        o.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1
    }

    function l(b) {
        var c = n.getHours(), d = n.getMinutes();
        a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : i(c), "m" !== b && (a.minutes = i(d)), a.meridian = n.getHours() < 12 ? p[0] : p[1]
    }

    function m(a) {
        var b = new Date(n.getTime() + 6e4 * a);
        n.setHours(b.getHours(), b.getMinutes()), j()
    }

    var n = new Date, o = {$setViewValue: angular.noop}, p = angular.isDefined(b.meridians) ? a.$parent.$eval(b.meridians) : f.meridians || e.DATETIME_FORMATS.AMPMS;
    this.init = function (c, d) {
        o = c, o.$render = this.render, o.$formatters.unshift(function (a) {
            return a ? new Date(a) : null
        });
        var e = d.eq(0), g = d.eq(1), h = angular.isDefined(b.mousewheel) ? a.$parent.$eval(b.mousewheel) : f.mousewheel;
        h && this.setupMousewheelEvents(e, g);
        var i = angular.isDefined(b.arrowkeys) ? a.$parent.$eval(b.arrowkeys) : f.arrowkeys;
        i && this.setupArrowkeyEvents(e, g), a.readonlyInput = angular.isDefined(b.readonlyInput) ? a.$parent.$eval(b.readonlyInput) : f.readonlyInput, this.setupInputEvents(e, g)
    };
    var q = f.hourStep;
    b.hourStep && a.$parent.$watch(c(b.hourStep), function (a) {
        q = parseInt(a, 10)
    });
    var r = f.minuteStep;
    b.minuteStep && a.$parent.$watch(c(b.minuteStep), function (a) {
        r = parseInt(a, 10)
    }), a.showMeridian = f.showMeridian, b.showMeridian && a.$parent.$watch(c(b.showMeridian), function (b) {
        if (a.showMeridian = !!b, o.$error.time) {
            var c = g(), d = h();
            angular.isDefined(c) && angular.isDefined(d) && (n.setHours(c), j())
        } else l()
    }), this.setupMousewheelEvents = function (b, c) {
        var d = function (a) {
            a.originalEvent && (a = a.originalEvent);
            var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;
            return a.detail || b > 0
        };
        b.bind("mousewheel wheel", function (b) {
            a.$apply(d(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault()
        }), c.bind("mousewheel wheel", function (b) {
            a.$apply(d(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault()
        })
    }, this.setupArrowkeyEvents = function (b, c) {
        b.bind("keydown", function (b) {
            38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply())
        }), c.bind("keydown", function (b) {
            38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply())
        })
    }, this.setupInputEvents = function (b, c) {
        if (a.readonlyInput)return a.updateHours = angular.noop, void(a.updateMinutes = angular.noop);
        var d = function (b, c) {
            o.$setViewValue(null), o.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b), angular.isDefined(c) && (a.invalidMinutes = c)
        };
        a.updateHours = function () {
            var a = g();
            angular.isDefined(a) ? (n.setHours(a), j("h")) : d(!0)
        }, b.bind("blur", function () {
            !a.invalidHours && a.hours < 10 && a.$apply(function () {
                a.hours = i(a.hours)
            })
        }), a.updateMinutes = function () {
            var a = h();
            angular.isDefined(a) ? (n.setMinutes(a), j("m")) : d(void 0, !0)
        }, c.bind("blur", function () {
            !a.invalidMinutes && a.minutes < 10 && a.$apply(function () {
                a.minutes = i(a.minutes)
            })
        })
    }, this.render = function () {
        var a = o.$viewValue;
        isNaN(a) ? (o.$setValidity("time", !1), d.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (a && (n = a), k(), l())
    }, a.incrementHours = function () {
        m(60 * q)
    }, a.decrementHours = function () {
        m(60 * -q)
    }, a.incrementMinutes = function () {
        m(r)
    }, a.decrementMinutes = function () {
        m(-r)
    }, a.toggleMeridian = function () {
        m(720 * (n.getHours() < 12 ? 1 : -1))
    }
}]).directive("timepicker", function () {
    return {
        restrict: "EA",
        require: ["timepicker", "?^ngModel"],
        controller: "TimepickerController",
        replace: !0,
        scope: {},
        templateUrl: "template/timepicker/timepicker.html",
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f && e.init(f, b.find("input"))
        }
    }
}), angular.module("ui.bootstrap.transition", []).value("$transitionSuppressDeprecated", !1).factory("$transition", ["$q", "$timeout", "$rootScope", "$log", "$transitionSuppressDeprecated", function (a, b, c, d, e) {
    function f(a) {
        for (var b in a)if (void 0 !== h.style[b])return a[b]
    }

    e || d.warn("$transition is now deprecated. Use $animate from ngAnimate instead.");
    var g = function (d, e, f) {
        f = f || {};
        var h = a.defer(), i = g[f.animation ? "animationEndEventName" : "transitionEndEventName"], j = function () {
            c.$apply(function () {
                d.unbind(i, j), h.resolve(d)
            })
        };
        return i && d.bind(i, j), b(function () {
            angular.isString(e) ? d.addClass(e) : angular.isFunction(e) ? e(d) : angular.isObject(e) && d.css(e), i || h.resolve(d)
        }), h.promise.cancel = function () {
            i && d.unbind(i, j), h.reject("Transition cancelled")
        }, h.promise
    }, h = document.createElement("trans"), i = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        transition: "transitionend"
    }, j = {
        WebkitTransition: "webkitAnimationEnd",
        MozTransition: "animationend",
        OTransition: "oAnimationEnd",
        transition: "animationend"
    };
    return g.transitionEndEventName = f(i), g.animationEndEventName = f(j), g
}]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).factory("typeaheadParser", ["$parse", function (a) {
    var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
        parse: function (c) {
            var d = c.match(b);
            if (!d)throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');
            return {itemName: d[3], source: a(d[4]), viewMapper: a(d[2] || d[1]), modelMapper: a(d[1])}
        }
    }
}]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function (a, b, c, d, e, f, g) {
    var h = [9, 13, 27, 38, 40];
    return {
        require: "ngModel", link: function (i, j, k, l) {
            var m, n = i.$eval(k.typeaheadMinLength) || 1, o = i.$eval(k.typeaheadWaitMs) || 0, p = i.$eval(k.typeaheadEditable) !== !1, q = b(k.typeaheadLoading).assign || angular.noop, r = b(k.typeaheadOnSelect), s = k.typeaheadInputFormatter ? b(k.typeaheadInputFormatter) : void 0, t = k.typeaheadAppendToBody ? i.$eval(k.typeaheadAppendToBody) : !1, u = i.$eval(k.typeaheadFocusFirst) !== !1, v = b(k.ngModel).assign, w = g.parse(k.typeahead), x = i.$new();
            i.$on("$destroy", function () {
                x.$destroy()
            });
            var y = "typeahead-" + x.$id + "-" + Math.floor(1e4 * Math.random());
            j.attr({"aria-autocomplete": "list", "aria-expanded": !1, "aria-owns": y});
            var z = angular.element("<div typeahead-popup></div>");
            z.attr({
                id: y,
                matches: "matches",
                active: "activeIdx",
                select: "select(activeIdx)",
                query: "query",
                position: "position"
            }), angular.isDefined(k.typeaheadTemplateUrl) && z.attr("template-url", k.typeaheadTemplateUrl);
            var A = function () {
                x.matches = [], x.activeIdx = -1, j.attr("aria-expanded", !1)
            }, B = function (a) {
                return y + "-option-" + a
            };
            x.$watch("activeIdx", function (a) {
                0 > a ? j.removeAttr("aria-activedescendant") : j.attr("aria-activedescendant", B(a))
            });
            var C = function (a) {
                var b = {$viewValue: a};
                q(i, !0), c.when(w.source(i, b)).then(function (c) {
                    var d = a === l.$viewValue;
                    if (d && m)if (c && c.length > 0) {
                        x.activeIdx = u ? 0 : -1, x.matches.length = 0;
                        for (var e = 0; e < c.length; e++)b[w.itemName] = c[e], x.matches.push({
                            id: B(e),
                            label: w.viewMapper(x, b),
                            model: c[e]
                        });
                        x.query = a, x.position = t ? f.offset(j) : f.position(j), x.position.top = x.position.top + j.prop("offsetHeight"), j.attr("aria-expanded", !0)
                    } else A();
                    d && q(i, !1)
                }, function () {
                    A(), q(i, !1)
                })
            };
            A(), x.query = void 0;
            var D, E = function (a) {
                D = d(function () {
                    C(a)
                }, o)
            }, F = function () {
                D && d.cancel(D)
            };
            l.$parsers.unshift(function (a) {
                return m = !0, a && a.length >= n ? o > 0 ? (F(), E(a)) : C(a) : (q(i, !1), F(), A()), p ? a : a ? void l.$setValidity("editable", !1) : (l.$setValidity("editable", !0), a)
            }), l.$formatters.push(function (a) {
                var b, c, d = {};
                return p || l.$setValidity("editable", !0), s ? (d.$model = a, s(i, d)) : (d[w.itemName] = a, b = w.viewMapper(i, d), d[w.itemName] = void 0, c = w.viewMapper(i, d), b !== c ? b : a)
            }), x.select = function (a) {
                var b, c, e = {};
                e[w.itemName] = c = x.matches[a].model, b = w.modelMapper(i, e), v(i, b), l.$setValidity("editable", !0), l.$setValidity("parse", !0), r(i, {
                    $item: c,
                    $model: b,
                    $label: w.viewMapper(i, e)
                }), A(), d(function () {
                    j[0].focus()
                }, 0, !1)
            }, j.bind("keydown", function (a) {
                0 !== x.matches.length && -1 !== h.indexOf(a.which) && (-1 != x.activeIdx || 13 !== a.which && 9 !== a.which) && (a.preventDefault(), 40 === a.which ? (x.activeIdx = (x.activeIdx + 1) % x.matches.length, x.$digest()) : 38 === a.which ? (x.activeIdx = (x.activeIdx > 0 ? x.activeIdx : x.matches.length) - 1, x.$digest()) : 13 === a.which || 9 === a.which ? x.$apply(function () {
                    x.select(x.activeIdx)
                }) : 27 === a.which && (a.stopPropagation(), A(), x.$digest()))
            }), j.bind("blur", function () {
                m = !1
            });
            var G = function (a) {
                j[0] !== a.target && (A(), x.$digest())
            };
            e.bind("click", G), i.$on("$destroy", function () {
                e.unbind("click", G), t && H.remove(), z.remove()
            });
            var H = a(z)(x);
            t ? e.find("body").append(H) : j.after(H)
        }
    }
}]).directive("typeaheadPopup", function () {
    return {
        restrict: "EA",
        scope: {matches: "=", query: "=", active: "=", position: "=", select: "&"},
        replace: !0,
        templateUrl: "template/typeahead/typeahead-popup.html",
        link: function (a, b, c) {
            a.templateUrl = c.templateUrl, a.isOpen = function () {
                return a.matches.length > 0
            }, a.isActive = function (b) {
                return a.active == b
            }, a.selectActive = function (b) {
                a.active = b
            }, a.selectMatch = function (b) {
                a.select({activeIdx: b})
            }
        }
    }
}).directive("typeaheadMatch", ["$templateRequest", "$compile", "$parse", function (a, b, c) {
    return {
        restrict: "EA", scope: {index: "=", match: "=", query: "="}, link: function (d, e, f) {
            var g = c(f.templateUrl)(d.$parent) || "template/typeahead/typeahead-match.html";
            a(g).then(function (a) {
                b(a.trim())(d, function (a) {
                    e.replaceWith(a)
                })
            })
        }
    }
}]).filter("typeaheadHighlight", function () {
    function a(a) {
        return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }

    return function (b, c) {
        return c ? ("" + b).replace(new RegExp(a(c), "gi"), "<strong>$&</strong>") : b
    }
}), !angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0 - 2015-05-02
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.transition", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html", "template/accordion/accordion.html", "template/alert/alert.html", "template/carousel/carousel.html", "template/carousel/slide.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/month.html", "template/datepicker/popup.html", "template/datepicker/year.html", "template/modal/backdrop.html", "template/modal/window.html", "template/pagination/pager.html", "template/pagination/pagination.html", "template/tooltip/tooltip-html-popup.html", "template/tooltip/tooltip-html-unsafe-popup.html", "template/tooltip/tooltip-popup.html", "template/tooltip/tooltip-template-popup.html", "template/popover/popover-template.html", "template/popover/popover.html", "template/progressbar/bar.html", "template/progressbar/progress.html", "template/progressbar/progressbar.html", "template/rating/rating.html", "template/tabs/tab.html", "template/tabs/tabset.html", "template/timepicker/timepicker.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrap.collapse", []).directive("collapse", ["$animate", function (a) {
    return {
        link: function (b, c, d) {
            function e() {
                c.removeClass("collapse").addClass("collapsing"), a.addClass(c, "in", {to: {height: c[0].scrollHeight + "px"}}).then(f)
            }

            function f() {
                c.removeClass("collapsing"), c.css({height: "auto"})
            }

            function g() {
                c.css({height: c[0].scrollHeight + "px"}).removeClass("collapse").addClass("collapsing"), a.removeClass(c, "in", {to: {height: "0"}}).then(h)
            }

            function h() {
                c.css({height: "0"}), c.removeClass("collapsing"), c.addClass("collapse")
            }

            b.$watch(d.collapse, function (a) {
                a ? g() : e()
            })
        }
    }
}]), angular.module("ui.bootstrap.accordion", ["ui.bootstrap.collapse"]).constant("accordionConfig", {closeOthers: !0}).controller("AccordionController", ["$scope", "$attrs", "accordionConfig", function (a, b, c) {
    this.groups = [], this.closeOthers = function (d) {
        var e = angular.isDefined(b.closeOthers) ? a.$eval(b.closeOthers) : c.closeOthers;
        e && angular.forEach(this.groups, function (a) {
            a !== d && (a.isOpen = !1)
        })
    }, this.addGroup = function (a) {
        var b = this;
        this.groups.push(a), a.$on("$destroy", function () {
            b.removeGroup(a)
        })
    }, this.removeGroup = function (a) {
        var b = this.groups.indexOf(a);
        -1 !== b && this.groups.splice(b, 1)
    }
}]).directive("accordion", function () {
    return {
        restrict: "EA",
        controller: "AccordionController",
        transclude: !0,
        replace: !1,
        templateUrl: "template/accordion/accordion.html"
    }
}).directive("accordionGroup", function () {
    return {
        require: "^accordion",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/accordion/accordion-group.html",
        scope: {heading: "@", isOpen: "=?", isDisabled: "=?"},
        controller: function () {
            this.setHeading = function (a) {
                this.heading = a
            }
        },
        link: function (a, b, c, d) {
            d.addGroup(a), a.$watch("isOpen", function (b) {
                b && d.closeOthers(a)
            }), a.toggleOpen = function () {
                a.isDisabled || (a.isOpen = !a.isOpen)
            }
        }
    }
}).directive("accordionHeading", function () {
    return {
        restrict: "EA",
        transclude: !0,
        template: "",
        replace: !0,
        require: "^accordionGroup",
        link: function (a, b, c, d, e) {
            d.setHeading(e(a, angular.noop))
        }
    }
}).directive("accordionTransclude", function () {
    return {
        require: "^accordionGroup", link: function (a, b, c, d) {
            a.$watch(function () {
                return d[c.accordionTransclude]
            }, function (a) {
                a && (b.html(""), b.append(a))
            })
        }
    }
}), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs", function (a, b) {
    a.closeable = "close"in b, this.close = a.close
}]).directive("alert", function () {
    return {
        restrict: "EA",
        controller: "AlertController",
        templateUrl: "template/alert/alert.html",
        transclude: !0,
        replace: !0,
        scope: {type: "@", close: "&"}
    }
}).directive("dismissOnTimeout", ["$timeout", function (a) {
    return {
        require: "alert", link: function (b, c, d, e) {
            a(function () {
                e.close()
            }, parseInt(d.dismissOnTimeout, 10))
        }
    }
}]), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function () {
    return function (a, b, c) {
        b.addClass("ng-binding").data("$binding", c.bindHtmlUnsafe), a.$watch(c.bindHtmlUnsafe, function (a) {
            b.html(a || "")
        })
    }
}), angular.module("ui.bootstrap.buttons", []).constant("buttonConfig", {
    activeClass: "active",
    toggleEvent: "click"
}).controller("ButtonsController", ["buttonConfig", function (a) {
    this.activeClass = a.activeClass || "active", this.toggleEvent = a.toggleEvent || "click"
}]).directive("btnRadio", function () {
    return {
        require: ["btnRadio", "ngModel"], controller: "ButtonsController", link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f.$render = function () {
                b.toggleClass(e.activeClass, angular.equals(f.$modelValue, a.$eval(c.btnRadio)))
            }, b.bind(e.toggleEvent, function () {
                var d = b.hasClass(e.activeClass);
                (!d || angular.isDefined(c.uncheckable)) && a.$apply(function () {
                    f.$setViewValue(d ? null : a.$eval(c.btnRadio)), f.$render()
                })
            })
        }
    }
}).directive("btnCheckbox", function () {
    return {
        require: ["btnCheckbox", "ngModel"], controller: "ButtonsController", link: function (a, b, c, d) {
            function e() {
                return g(c.btnCheckboxTrue, !0)
            }

            function f() {
                return g(c.btnCheckboxFalse, !1)
            }

            function g(b, c) {
                var d = a.$eval(b);
                return angular.isDefined(d) ? d : c
            }

            var h = d[0], i = d[1];
            i.$render = function () {
                b.toggleClass(h.activeClass, angular.equals(i.$modelValue, e()))
            }, b.bind(h.toggleEvent, function () {
                a.$apply(function () {
                    i.$setViewValue(b.hasClass(h.activeClass) ? f() : e()), i.$render()
                })
            })
        }
    }
}), angular.module("ui.bootstrap.carousel", []).controller("CarouselController", ["$scope", "$interval", "$animate", function (a, b, c) {
    function d(a) {
        if (angular.isUndefined(k[a].index))return k[a];
        {
            var b;
            k.length
        }
        for (b = 0; b < k.length; ++b)if (k[b].index == a)return k[b]
    }

    function e() {
        f();
        var c = +a.interval;
        !isNaN(c) && c > 0 && (h = b(g, c))
    }

    function f() {
        h && (b.cancel(h), h = null)
    }

    function g() {
        var b = +a.interval;
        i && !isNaN(b) && b > 0 ? a.next() : a.pause()
    }

    var h, i, j = this, k = j.slides = a.slides = [], l = -1;
    j.currentSlide = null;
    var m = !1;
    j.select = a.select = function (b, d) {
        function f() {
            m || (angular.extend(b, {direction: d, active: !0}), angular.extend(j.currentSlide || {}, {
                direction: d,
                active: !1
            }), c.enabled() && !a.noTransition && b.$element && (a.$currentTransition = !0, b.$element.one("$animate:close", function () {
                a.$currentTransition = null
            })), j.currentSlide = b, l = g, e())
        }

        var g = j.indexOfSlide(b);
        void 0 === d && (d = g > j.getCurrentIndex() ? "next" : "prev"), b && b !== j.currentSlide && f()
    }, a.$on("$destroy", function () {
        m = !0
    }), j.getCurrentIndex = function () {
        return j.currentSlide && angular.isDefined(j.currentSlide.index) ? +j.currentSlide.index : l
    }, j.indexOfSlide = function (a) {
        return angular.isDefined(a.index) ? +a.index : k.indexOf(a)
    }, a.next = function () {
        var b = (j.getCurrentIndex() + 1) % k.length;
        return a.$currentTransition ? void 0 : j.select(d(b), "next")
    }, a.prev = function () {
        var b = j.getCurrentIndex() - 1 < 0 ? k.length - 1 : j.getCurrentIndex() - 1;
        return a.$currentTransition ? void 0 : j.select(d(b), "prev")
    }, a.isActive = function (a) {
        return j.currentSlide === a
    }, a.$watch("interval", e), a.$on("$destroy", f), a.play = function () {
        i || (i = !0, e())
    }, a.pause = function () {
        a.noPause || (i = !1, f())
    }, j.addSlide = function (b, c) {
        b.$element = c, k.push(b), 1 === k.length || b.active ? (j.select(k[k.length - 1]), 1 == k.length && a.play()) : b.active = !1
    }, j.removeSlide = function (a) {
        angular.isDefined(a.index) && k.sort(function (a, b) {
            return +a.index > +b.index
        });
        var b = k.indexOf(a);
        k.splice(b, 1), k.length > 0 && a.active ? j.select(b >= k.length ? k[b - 1] : k[b]) : l > b && l--
    }
}]).directive("carousel", [function () {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        controller: "CarouselController",
        require: "carousel",
        templateUrl: "template/carousel/carousel.html",
        scope: {interval: "=", noTransition: "=", noPause: "="}
    }
}]).directive("slide", function () {
    return {
        require: "^carousel",
        restrict: "EA",
        transclude: !0,
        replace: !0,
        templateUrl: "template/carousel/slide.html",
        scope: {active: "=?", index: "=?"},
        link: function (a, b, c, d) {
            d.addSlide(a, b), a.$on("$destroy", function () {
                d.removeSlide(a)
            }), a.$watch("active", function (b) {
                b && d.select(a)
            })
        }
    }
}).animation(".item", ["$animate", function (a) {
    return {
        beforeAddClass: function (b, c, d) {
            if ("active" == c && b.parent() && !b.parent().scope().noTransition) {
                var e = !1, f = b.isolateScope().direction, g = "next" == f ? "left" : "right";
                return b.addClass(f), a.addClass(b, g).then(function () {
                    e || b.removeClass(g + " " + f), d()
                }), function () {
                    e = !0
                }
            }
            d()
        }, beforeRemoveClass: function (b, c, d) {
            if ("active" == c && b.parent() && !b.parent().scope().noTransition) {
                var e = !1, f = b.isolateScope().direction, g = "next" == f ? "left" : "right";
                return a.addClass(b, g).then(function () {
                    e || b.removeClass(g), d()
                }), function () {
                    e = !0
                }
            }
            d()
        }
    }
}]), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter", function (a, b) {
    function c(a) {
        var c = [], d = a.split("");
        return angular.forEach(f, function (b, e) {
            var f = a.indexOf(e);
            if (f > -1) {
                a = a.split(""), d[f] = "(" + b.regex + ")", a[f] = "$";
                for (var g = f + 1, h = f + e.length; h > g; g++)d[g] = "", a[g] = "$";
                a = a.join(""), c.push({index: f, apply: b.apply})
            }
        }), {regex: new RegExp("^" + d.join("") + "$"), map: b(c, "index")}
    }

    function d(a, b, c) {
        return 1 > c ? !1 : 1 === b && c > 28 ? 29 === c && (a % 4 === 0 && a % 100 !== 0 || a % 400 === 0) : 3 === b || 5 === b || 8 === b || 10 === b ? 31 > c : !0
    }

    var e = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
    this.parsers = {};
    var f = {
        yyyy: {
            regex: "\\d{4}", apply: function (a) {
                this.year = +a
            }
        },
        yy: {
            regex: "\\d{2}", apply: function (a) {
                this.year = +a + 2e3
            }
        },
        y: {
            regex: "\\d{1,4}", apply: function (a) {
                this.year = +a
            }
        },
        MMMM: {
            regex: a.DATETIME_FORMATS.MONTH.join("|"), apply: function (b) {
                this.month = a.DATETIME_FORMATS.MONTH.indexOf(b)
            }
        },
        MMM: {
            regex: a.DATETIME_FORMATS.SHORTMONTH.join("|"), apply: function (b) {
                this.month = a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)
            }
        },
        MM: {
            regex: "0[1-9]|1[0-2]", apply: function (a) {
                this.month = a - 1
            }
        },
        M: {
            regex: "[1-9]|1[0-2]", apply: function (a) {
                this.month = a - 1
            }
        },
        dd: {
            regex: "[0-2][0-9]{1}|3[0-1]{1}", apply: function (a) {
                this.date = +a
            }
        },
        d: {
            regex: "[1-2]?[0-9]{1}|3[0-1]{1}", apply: function (a) {
                this.date = +a
            }
        },
        EEEE: {regex: a.DATETIME_FORMATS.DAY.join("|")},
        EEE: {regex: a.DATETIME_FORMATS.SHORTDAY.join("|")},
        HH: {
            regex: "(?:0|1)[0-9]|2[0-3]", apply: function (a) {
                this.hours = +a
            }
        },
        H: {
            regex: "1?[0-9]|2[0-3]", apply: function (a) {
                this.hours = +a
            }
        },
        mm: {
            regex: "[0-5][0-9]", apply: function (a) {
                this.minutes = +a
            }
        },
        m: {
            regex: "[0-9]|[1-5][0-9]", apply: function (a) {
                this.minutes = +a
            }
        },
        sss: {
            regex: "[0-9][0-9][0-9]", apply: function (a) {
                this.milliseconds = +a
            }
        },
        ss: {
            regex: "[0-5][0-9]", apply: function (a) {
                this.seconds = +a
            }
        },
        s: {
            regex: "[0-9]|[1-5][0-9]", apply: function (a) {
                this.seconds = +a
            }
        }
    };
    this.parse = function (b, f, g) {
        if (!angular.isString(b) || !f)return b;
        f = a.DATETIME_FORMATS[f] || f, f = f.replace(e, "\\$&"), this.parsers[f] || (this.parsers[f] = c(f));
        var h = this.parsers[f], i = h.regex, j = h.map, k = b.match(i);
        if (k && k.length) {
            var l, m;
            l = g ? {
                year: g.getFullYear(),
                month: g.getMonth(),
                date: g.getDate(),
                hours: g.getHours(),
                minutes: g.getMinutes(),
                seconds: g.getSeconds(),
                milliseconds: g.getMilliseconds()
            } : {year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0};
            for (var n = 1, o = k.length; o > n; n++) {
                var p = j[n - 1];
                p.apply && p.apply.call(l, k[n])
            }
            return d(l.year, l.month, l.date) && (m = new Date(l.year, l.month, l.date, l.hours, l.minutes, l.seconds, l.milliseconds || 0)), m
        }
    }
}]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window", function (a, b) {
    function c(a, c) {
        return a.currentStyle ? a.currentStyle[c] : b.getComputedStyle ? b.getComputedStyle(a)[c] : a.style[c]
    }

    function d(a) {
        return "static" === (c(a, "position") || "static")
    }

    var e = function (b) {
        for (var c = a[0], e = b.offsetParent || c; e && e !== c && d(e);)e = e.offsetParent;
        return e || c
    };
    return {
        position: function (b) {
            var c = this.offset(b), d = {top: 0, left: 0}, f = e(b[0]);
            f != a[0] && (d = this.offset(angular.element(f)), d.top += f.clientTop - f.scrollTop, d.left += f.clientLeft - f.scrollLeft);
            var g = b[0].getBoundingClientRect();
            return {
                width: g.width || b.prop("offsetWidth"),
                height: g.height || b.prop("offsetHeight"),
                top: c.top - d.top,
                left: c.left - d.left
            }
        }, offset: function (c) {
            var d = c[0].getBoundingClientRect();
            return {
                width: d.width || c.prop("offsetWidth"),
                height: d.height || c.prop("offsetHeight"),
                top: d.top + (b.pageYOffset || a[0].documentElement.scrollTop),
                left: d.left + (b.pageXOffset || a[0].documentElement.scrollLeft)
            }
        }, positionElements: function (a, b, c, d) {
            var e, f, g, h, i = c.split("-"), j = i[0], k = i[1] || "center";
            e = d ? this.offset(a) : this.position(a), f = b.prop("offsetWidth"), g = b.prop("offsetHeight");
            var l = {
                center: function () {
                    return e.left + e.width / 2 - f / 2
                }, left: function () {
                    return e.left
                }, right: function () {
                    return e.left + e.width
                }
            }, m = {
                center: function () {
                    return e.top + e.height / 2 - g / 2
                }, top: function () {
                    return e.top
                }, bottom: function () {
                    return e.top + e.height
                }
            };
            switch (j) {
                case"right":
                    h = {top: m[k](), left: l[j]()};
                    break;
                case"left":
                    h = {top: m[k](), left: e.left - f};
                    break;
                case"bottom":
                    h = {top: m[j](), left: l[k]()};
                    break;
                default:
                    h = {top: e.top - g, left: l[k]()}
            }
            return h
        }
    }
}]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).constant("datepickerConfig", {
    formatDay: "dd",
    formatMonth: "MMMM",
    formatYear: "yyyy",
    formatDayHeader: "EEE",
    formatDayTitle: "MMMM yyyy",
    formatMonthTitle: "yyyy",
    datepickerMode: "day",
    minMode: "day",
    maxMode: "year",
    showWeeks: !0,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null,
    shortcutPropagation: !1
}).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", function (a, b, c, d, e, f, g, h) {
    var i = this, j = {$setViewValue: angular.noop};
    this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange", "shortcutPropagation"], function (c, e) {
        i[c] = angular.isDefined(b[c]) ? 8 > e ? d(b[c])(a.$parent) : a.$parent.$eval(b[c]) : h[c]
    }), angular.forEach(["minDate", "maxDate"], function (d) {
        b[d] ? a.$parent.$watch(c(b[d]), function (a) {
            i[d] = a ? new Date(a) : null, i.refreshView()
        }) : i[d] = h[d] ? new Date(h[d]) : null
    }), a.datepickerMode = a.datepickerMode || h.datepickerMode, a.maxMode = i.maxMode, a.uniqueId = "datepicker-" + a.$id + "-" + Math.floor(1e4 * Math.random()), angular.isDefined(b.initDate) ? (this.activeDate = a.$parent.$eval(b.initDate) || new Date, a.$parent.$watch(b.initDate, function (a) {
        a && (j.$isEmpty(j.$modelValue) || j.$invalid) && (i.activeDate = a, i.refreshView())
    })) : this.activeDate = new Date, a.isActive = function (b) {
        return 0 === i.compare(b.date, i.activeDate) ? (a.activeDateId = b.uid, !0) : !1
    }, this.init = function (a) {
        j = a, j.$render = function () {
            i.render()
        }
    }, this.render = function () {
        if (j.$viewValue) {
            var a = new Date(j.$viewValue), b = !isNaN(a);
            b ? this.activeDate = a : f.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), j.$setValidity("date", b)
        }
        this.refreshView()
    }, this.refreshView = function () {
        if (this.element) {
            this._refreshView();
            var a = j.$viewValue ? new Date(j.$viewValue) : null;
            j.$setValidity("date-disabled", !a || this.element && !this.isDisabled(a))
        }
    }, this.createDateObject = function (a, b) {
        var c = j.$viewValue ? new Date(j.$viewValue) : null;
        return {
            date: a,
            label: g(a, b),
            selected: c && 0 === this.compare(a, c),
            disabled: this.isDisabled(a),
            current: 0 === this.compare(a, new Date),
            customClass: this.customClass(a)
        }
    }, this.isDisabled = function (c) {
        return this.minDate && this.compare(c, this.minDate) < 0 || this.maxDate && this.compare(c, this.maxDate) > 0 || b.dateDisabled && a.dateDisabled({
                date: c,
                mode: a.datepickerMode
            })
    }, this.customClass = function (b) {
        return a.customClass({date: b, mode: a.datepickerMode})
    }, this.split = function (a, b) {
        for (var c = []; a.length > 0;)c.push(a.splice(0, b));
        return c
    }, a.select = function (b) {
        if (a.datepickerMode === i.minMode) {
            var c = j.$viewValue ? new Date(j.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
            c.setFullYear(b.getFullYear(), b.getMonth(), b.getDate()), j.$setViewValue(c), j.$render()
        } else i.activeDate = b, a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) - 1]
    }, a.move = function (a) {
        var b = i.activeDate.getFullYear() + a * (i.step.years || 0), c = i.activeDate.getMonth() + a * (i.step.months || 0);
        i.activeDate.setFullYear(b, c, 1), i.refreshView()
    }, a.toggleMode = function (b) {
        b = b || 1, a.datepickerMode === i.maxMode && 1 === b || a.datepickerMode === i.minMode && -1 === b || (a.datepickerMode = i.modes[i.modes.indexOf(a.datepickerMode) + b])
    }, a.keys = {
        13: "enter",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };
    var k = function () {
        e(function () {
            i.element[0].focus()
        }, 0, !1)
    };
    a.$on("datepicker.focus", k), a.keydown = function (b) {
        var c = a.keys[b.which];
        if (c && !b.shiftKey && !b.altKey)if (b.preventDefault(), i.shortcutPropagation || b.stopPropagation(), "enter" === c || "space" === c) {
            if (i.isDisabled(i.activeDate))return;
            a.select(i.activeDate), k()
        } else!b.ctrlKey || "up" !== c && "down" !== c ? (i.handleKeyDown(c, b), i.refreshView()) : (a.toggleMode("up" === c ? 1 : -1), k())
    }
}]).directive("datepicker", function () {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/datepicker.html",
        scope: {datepickerMode: "=?", dateDisabled: "&", customClass: "&", shortcutPropagation: "&?"},
        require: ["datepicker", "?^ngModel"],
        controller: "DatepickerController",
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f && e.init(f)
        }
    }
}).directive("daypicker", ["dateFilter", function (a) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/day.html",
        require: "^datepicker",
        link: function (b, c, d, e) {
            function f(a, b) {
                return 1 !== b || a % 4 !== 0 || a % 100 === 0 && a % 400 !== 0 ? i[b] : 29
            }

            function g(a, b) {
                var c = new Array(b), d = new Date(a), e = 0;
                for (d.setHours(12); b > e;)c[e++] = new Date(d), d.setDate(d.getDate() + 1);
                return c
            }

            function h(a) {
                var b = new Date(a);
                b.setDate(b.getDate() + 4 - (b.getDay() || 7));
                var c = b.getTime();
                return b.setMonth(0), b.setDate(1), Math.floor(Math.round((c - b) / 864e5) / 7) + 1
            }

            b.showWeeks = e.showWeeks, e.step = {months: 1}, e.element = c;
            var i = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            e._refreshView = function () {
                var c = e.activeDate.getFullYear(), d = e.activeDate.getMonth(), f = new Date(c, d, 1), i = e.startingDay - f.getDay(), j = i > 0 ? 7 - i : -i, k = new Date(f);
                j > 0 && k.setDate(-j + 1);
                for (var l = g(k, 42), m = 0; 42 > m; m++)l[m] = angular.extend(e.createDateObject(l[m], e.formatDay), {
                    secondary: l[m].getMonth() !== d,
                    uid: b.uniqueId + "-" + m
                });
                b.labels = new Array(7);
                for (var n = 0; 7 > n; n++)b.labels[n] = {
                    abbr: a(l[n].date, e.formatDayHeader),
                    full: a(l[n].date, "EEEE")
                };
                if (b.title = a(e.activeDate, e.formatDayTitle), b.rows = e.split(l, 7), b.showWeeks) {
                    b.weekNumbers = [];
                    for (var o = (11 - e.startingDay) % 7, p = b.rows.length, q = 0; p > q; q++)b.weekNumbers.push(h(b.rows[q][o].date))
                }
            }, e.compare = function (a, b) {
                return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate())
            }, e.handleKeyDown = function (a) {
                var b = e.activeDate.getDate();
                if ("left" === a)b -= 1; else if ("up" === a)b -= 7; else if ("right" === a)b += 1; else if ("down" === a)b += 7; else if ("pageup" === a || "pagedown" === a) {
                    var c = e.activeDate.getMonth() + ("pageup" === a ? -1 : 1);
                    e.activeDate.setMonth(c, 1), b = Math.min(f(e.activeDate.getFullYear(), e.activeDate.getMonth()), b)
                } else"home" === a ? b = 1 : "end" === a && (b = f(e.activeDate.getFullYear(), e.activeDate.getMonth()));
                e.activeDate.setDate(b)
            }, e.refreshView()
        }
    }
}]).directive("monthpicker", ["dateFilter", function (a) {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/month.html",
        require: "^datepicker",
        link: function (b, c, d, e) {
            e.step = {years: 1}, e.element = c, e._refreshView = function () {
                for (var c = new Array(12), d = e.activeDate.getFullYear(), f = 0; 12 > f; f++)c[f] = angular.extend(e.createDateObject(new Date(d, f, 1), e.formatMonth), {uid: b.uniqueId + "-" + f});
                b.title = a(e.activeDate, e.formatMonthTitle), b.rows = e.split(c, 3)
            }, e.compare = function (a, b) {
                return new Date(a.getFullYear(), a.getMonth()) - new Date(b.getFullYear(), b.getMonth())
            }, e.handleKeyDown = function (a) {
                var b = e.activeDate.getMonth();
                if ("left" === a)b -= 1; else if ("up" === a)b -= 3; else if ("right" === a)b += 1; else if ("down" === a)b += 3; else if ("pageup" === a || "pagedown" === a) {
                    var c = e.activeDate.getFullYear() + ("pageup" === a ? -1 : 1);
                    e.activeDate.setFullYear(c)
                } else"home" === a ? b = 0 : "end" === a && (b = 11);
                e.activeDate.setMonth(b)
            }, e.refreshView()
        }
    }
}]).directive("yearpicker", ["dateFilter", function () {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/year.html",
        require: "^datepicker",
        link: function (a, b, c, d) {
            function e(a) {
                return parseInt((a - 1) / f, 10) * f + 1
            }

            var f = d.yearRange;
            d.step = {years: f}, d.element = b, d._refreshView = function () {
                for (var b = new Array(f), c = 0, g = e(d.activeDate.getFullYear()); f > c; c++)b[c] = angular.extend(d.createDateObject(new Date(g + c, 0, 1), d.formatYear), {uid: a.uniqueId + "-" + c});
                a.title = [b[0].label, b[f - 1].label].join(" - "), a.rows = d.split(b, 5)
            }, d.compare = function (a, b) {
                return a.getFullYear() - b.getFullYear()
            }, d.handleKeyDown = function (a) {
                var b = d.activeDate.getFullYear();
                "left" === a ? b -= 1 : "up" === a ? b -= 5 : "right" === a ? b += 1 : "down" === a ? b += 5 : "pageup" === a || "pagedown" === a ? b += ("pageup" === a ? -1 : 1) * d.step.years : "home" === a ? b = e(d.activeDate.getFullYear()) : "end" === a && (b = e(d.activeDate.getFullYear()) + f - 1), d.activeDate.setFullYear(b)
            }, d.refreshView()
        }
    }
}]).constant("datepickerPopupConfig", {
    datepickerPopup: "yyyy-MM-dd",
    html5Types: {date: "yyyy-MM-dd", "datetime-local": "yyyy-MM-ddTHH:mm:ss.sss", month: "yyyy-MM"},
    currentText: "Today",
    clearText: "Clear",
    closeText: "Done",
    closeOnDateSelection: !0,
    appendToBody: !1,
    showButtonBar: !0
}).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig", function (a, b, c, d, e, f, g) {
    return {
        restrict: "EA",
        require: "ngModel",
        scope: {isOpen: "=?", currentText: "@", clearText: "@", closeText: "@", dateDisabled: "&", customClass: "&"},
        link: function (h, i, j, k) {
            function l(a) {
                return a.replace(/([A-Z])/g, function (a) {
                    return "-" + a.toLowerCase()
                })
            }

            function m(a) {
                if (angular.isNumber(a) && (a = new Date(a)), a) {
                    if (angular.isDate(a) && !isNaN(a))return a;
                    if (angular.isString(a)) {
                        var b = f.parse(a, o, h.date) || new Date(a);
                        return isNaN(b) ? void 0 : b
                    }
                    return void 0
                }
                return null
            }

            function n(a, b) {
                var c = a || b;
                if (angular.isNumber(c) && (c = new Date(c)), c) {
                    if (angular.isDate(c) && !isNaN(c))return !0;
                    if (angular.isString(c)) {
                        var d = f.parse(c, o) || new Date(c);
                        return !isNaN(d)
                    }
                    return !1
                }
                return !0
            }

            var o, p = angular.isDefined(j.closeOnDateSelection) ? h.$parent.$eval(j.closeOnDateSelection) : g.closeOnDateSelection, q = angular.isDefined(j.datepickerAppendToBody) ? h.$parent.$eval(j.datepickerAppendToBody) : g.appendToBody;
            h.showButtonBar = angular.isDefined(j.showButtonBar) ? h.$parent.$eval(j.showButtonBar) : g.showButtonBar, h.getText = function (a) {
                return h[a + "Text"] || g[a + "Text"]
            };
            var r = !1;
            if (g.html5Types[j.type] ? (o = g.html5Types[j.type], r = !0) : (o = j.datepickerPopup || g.datepickerPopup, j.$observe("datepickerPopup", function (a) {
                    var b = a || g.datepickerPopup;
                    if (b !== o && (o = b, k.$modelValue = null, !o))throw new Error("datepickerPopup must have a date format specified.")
                })), !o)throw new Error("datepickerPopup must have a date format specified.");
            if (r && j.datepickerPopup)throw new Error("HTML5 date input types do not support custom formats.");
            var s = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
            s.attr({"ng-model": "date", "ng-change": "dateSelection()"});
            var t = angular.element(s.children()[0]);
            if (r && "month" == j.type && (t.attr("datepicker-mode", '"month"'), t.attr("min-mode", "month")), j.datepickerOptions) {
                var u = h.$parent.$eval(j.datepickerOptions);
                u.initDate && (h.initDate = u.initDate, t.attr("init-date", "initDate"), delete u.initDate), angular.forEach(u, function (a, b) {
                    t.attr(l(b), a)
                })
            }
            h.watchData = {}, angular.forEach(["minDate", "maxDate", "datepickerMode", "initDate", "shortcutPropagation"], function (a) {
                if (j[a]) {
                    var c = b(j[a]);
                    if (h.$parent.$watch(c, function (b) {
                            h.watchData[a] = b
                        }), t.attr(l(a), "watchData." + a), "datepickerMode" === a) {
                        var d = c.assign;
                        h.$watch("watchData." + a, function (a, b) {
                            a !== b && d(h.$parent, a)
                        })
                    }
                }
            }), j.dateDisabled && t.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), j.showWeeks && t.attr("show-weeks", j.showWeeks), j.customClass && t.attr("custom-class", "customClass({ date: date, mode: mode })"), r ? k.$formatters.push(function (a) {
                return h.date = a, a
            }) : (k.$$parserName = "date", k.$validators.date = n, k.$parsers.unshift(m), k.$formatters.push(function (a) {
                return h.date = a, k.$isEmpty(a) ? a : e(a, o)
            })), h.dateSelection = function (a) {
                angular.isDefined(a) && (h.date = a);
                var b = h.date ? e(h.date, o) : "";
                i.val(b), k.$setViewValue(b), p && (h.isOpen = !1, i[0].focus())
            }, k.$viewChangeListeners.push(function () {
                h.date = f.parse(k.$viewValue, o, h.date) || new Date(k.$viewValue)
            });
            var v = function (a) {
                h.isOpen && a.target !== i[0] && h.$apply(function () {
                    h.isOpen = !1
                })
            }, w = function (a) {
                h.keydown(a)
            };
            i.bind("keydown", w), h.keydown = function (a) {
                27 === a.which ? (a.preventDefault(), h.isOpen && a.stopPropagation(), h.close()) : 40 !== a.which || h.isOpen || (h.isOpen = !0)
            }, h.$watch("isOpen", function (a) {
                a ? (h.$broadcast("datepicker.focus"), h.position = q ? d.offset(i) : d.position(i), h.position.top = h.position.top + i.prop("offsetHeight"), c.bind("click", v)) : c.unbind("click", v)
            }), h.select = function (a) {
                if ("today" === a) {
                    var b = new Date;
                    angular.isDate(h.date) ? (a = new Date(h.date), a.setFullYear(b.getFullYear(), b.getMonth(), b.getDate())) : a = new Date(b.setHours(0, 0, 0, 0))
                }
                h.dateSelection(a)
            }, h.close = function () {
                h.isOpen = !1, i[0].focus()
            };
            var x = a(s)(h);
            s.remove(), q ? c.find("body").append(x) : i.after(x), h.$on("$destroy", function () {
                x.remove(), i.unbind("keydown", w), c.unbind("click", v)
            })
        }
    }
}]).directive("datepickerPopupWrap", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        templateUrl: "template/datepicker/popup.html",
        link: function (a, b) {
            b.bind("click", function (a) {
                a.preventDefault(), a.stopPropagation()
            })
        }
    }
}), angular.module("ui.bootstrap.dropdown", ["ui.bootstrap.position"]).constant("dropdownConfig", {openClass: "open"}).service("dropdownService", ["$document", "$rootScope", function (a, b) {
    var c = null;
    this.open = function (b) {
        c || (a.bind("click", d), a.bind("keydown", e)), c && c !== b && (c.isOpen = !1), c = b
    }, this.close = function (b) {
        c === b && (c = null, a.unbind("click", d), a.unbind("keydown", e))
    };
    var d = function (a) {
        if (c && (!a || "disabled" !== c.getAutoClose())) {
            var d = c.getToggleElement();
            if (!(a && d && d[0].contains(a.target))) {
                var e = c.getElement();
                a && "outsideClick" === c.getAutoClose() && e && e[0].contains(a.target) || (c.isOpen = !1, b.$$phase || c.$apply())
            }
        }
    }, e = function (a) {
        27 === a.which && (c.focusToggleElement(), d())
    }
}]).controller("DropdownController", ["$scope", "$attrs", "$parse", "dropdownConfig", "dropdownService", "$animate", "$position", "$document", function (a, b, c, d, e, f, g, h) {
    var i, j = this, k = a.$new(), l = d.openClass, m = angular.noop, n = b.onToggle ? c(b.onToggle) : angular.noop, o = !1;
    this.init = function (d) {
        j.$element = d, b.isOpen && (i = c(b.isOpen), m = i.assign, a.$watch(i, function (a) {
            k.isOpen = !!a
        })), o = angular.isDefined(b.dropdownAppendToBody), o && j.dropdownMenu && (h.find("body").append(j.dropdownMenu), d.on("$destroy", function () {
            j.dropdownMenu.remove()
        }))
    }, this.toggle = function (a) {
        return k.isOpen = arguments.length ? !!a : !k.isOpen
    }, this.isOpen = function () {
        return k.isOpen
    }, k.getToggleElement = function () {
        return j.toggleElement
    }, k.getAutoClose = function () {
        return b.autoClose || "always"
    }, k.getElement = function () {
        return j.$element
    }, k.focusToggleElement = function () {
        j.toggleElement && j.toggleElement[0].focus()
    }, k.$watch("isOpen", function (b, c) {
        if (o && j.dropdownMenu) {
            var d = g.positionElements(j.$element, j.dropdownMenu, "bottom-left", !0);
            j.dropdownMenu.css({top: d.top + "px", left: d.left + "px", display: b ? "block" : "none"})
        }
        f[b ? "addClass" : "removeClass"](j.$element, l), b ? (k.focusToggleElement(), e.open(k)) : e.close(k), m(a, b), angular.isDefined(b) && b !== c && n(a, {open: !!b})
    }), a.$on("$locationChangeSuccess", function () {
        k.isOpen = !1
    }), a.$on("$destroy", function () {
        k.$destroy()
    })
}]).directive("dropdown", function () {
    return {
        controller: "DropdownController", link: function (a, b, c, d) {
            d.init(b)
        }
    }
}).directive("dropdownMenu", function () {
    return {
        restrict: "AC", require: "?^dropdown", link: function (a, b, c, d) {
            d && (d.dropdownMenu = b)
        }
    }
}).directive("dropdownToggle", function () {
    return {
        require: "?^dropdown", link: function (a, b, c, d) {
            if (d) {
                d.toggleElement = b;
                var e = function (e) {
                    e.preventDefault(), b.hasClass("disabled") || c.disabled || a.$apply(function () {
                        d.toggle()
                    })
                };
                b.bind("click", e), b.attr({
                    "aria-haspopup": !0,
                    "aria-expanded": !1
                }), a.$watch(d.isOpen, function (a) {
                    b.attr("aria-expanded", !!a)
                }), a.$on("$destroy", function () {
                    b.unbind("click", e)
                })
            }
        }
    }
}), angular.module("ui.bootstrap.modal", []).factory("$$stackedMap", function () {
    return {
        createNew: function () {
            var a = [];
            return {
                add: function (b, c) {
                    a.push({key: b, value: c})
                }, get: function (b) {
                    for (var c = 0; c < a.length; c++)if (b == a[c].key)return a[c]
                }, keys: function () {
                    for (var b = [], c = 0; c < a.length; c++)b.push(a[c].key);
                    return b
                }, top: function () {
                    return a[a.length - 1]
                }, remove: function (b) {
                    for (var c = -1, d = 0; d < a.length; d++)if (b == a[d].key) {
                        c = d;
                        break
                    }
                    return a.splice(c, 1)[0]
                }, removeTop: function () {
                    return a.splice(a.length - 1, 1)[0]
                }, length: function () {
                    return a.length
                }
            }
        }
    }
}).directive("modalBackdrop", ["$timeout", function (a) {
    function b(b) {
        b.animate = !1, a(function () {
            b.animate = !0
        })
    }

    return {
        restrict: "EA", replace: !0, templateUrl: "template/modal/backdrop.html", compile: function (a, c) {
            return a.addClass(c.backdropClass), b
        }
    }
}]).directive("modalWindow", ["$modalStack", "$q", function (a, b) {
    return {
        restrict: "EA",
        scope: {index: "@", animate: "="},
        replace: !0,
        transclude: !0,
        templateUrl: function (a, b) {
            return b.templateUrl || "template/modal/window.html"
        },
        link: function (c, d, e) {
            d.addClass(e.windowClass || ""), c.size = e.size, c.close = function (b) {
                var c = a.getTop();
                c && c.value.backdrop && "static" != c.value.backdrop && b.target === b.currentTarget && (b.preventDefault(), b.stopPropagation(), a.dismiss(c.key, "backdrop click"))
            }, c.$isRendered = !0;
            var f = b.defer();
            e.$observe("modalRender", function (a) {
                "true" == a && f.resolve()
            }), f.promise.then(function () {
                c.animate = !0;
                var b = d[0].querySelectorAll("[autofocus]");
                b.length ? b[0].focus() : d[0].focus();
                var e = a.getTop();
                e && a.modalRendered(e.key)
            })
        }
    }
}]).directive("modalAnimationClass", [function () {
    return {
        compile: function (a, b) {
            b.modalAnimation && a.addClass(b.modalAnimationClass)
        }
    }
}]).directive("modalTransclude", function () {
    return {
        link: function (a, b, c, d, e) {
            e(a.$parent, function (a) {
                b.empty(), b.append(a)
            })
        }
    }
}).factory("$modalStack", ["$animate", "$timeout", "$document", "$compile", "$rootScope", "$$stackedMap", function (a, b, c, d, e, f) {
    function g() {
        for (var a = -1, b = o.keys(), c = 0; c < b.length; c++)o.get(b[c]).value.backdrop && (a = c);
        return a
    }

    function h(a) {
        var b = c.find("body").eq(0), d = o.get(a).value;
        o.remove(a), j(d.modalDomEl, d.modalScope, function () {
            b.toggleClass(n, o.length() > 0), i()
        })
    }

    function i() {
        if (l && -1 == g()) {
            var a = m;
            j(l, m, function () {
                a = null
            }), l = void 0, m = void 0
        }
    }

    function j(c, d, f) {
        function g() {
            g.done || (g.done = !0, c.remove(), d.$destroy(), f && f())
        }

        d.animate = !1, c.attr("modal-animation") && a.enabled() ? c.one("$animate:close", function () {
            e.$evalAsync(g)
        }) : b(g)
    }

    function k(a, b, c) {
        return !a.value.modalScope.$broadcast("modal.closing", b, c).defaultPrevented
    }

    var l, m, n = "modal-open", o = f.createNew(), p = {};
    return e.$watch(g, function (a) {
        m && (m.index = a)
    }), c.bind("keydown", function (a) {
        var b;
        27 === a.which && (b = o.top(), b && b.value.keyboard && (a.preventDefault(), e.$apply(function () {
            p.dismiss(b.key, "escape key press")
        })))
    }), p.open = function (a, b) {
        var f = c[0].activeElement;
        o.add(a, {
            deferred: b.deferred,
            renderDeferred: b.renderDeferred,
            modalScope: b.scope,
            backdrop: b.backdrop,
            keyboard: b.keyboard
        });
        var h = c.find("body").eq(0), i = g();
        if (i >= 0 && !l) {
            m = e.$new(!0), m.index = i;
            var j = angular.element('<div modal-backdrop="modal-backdrop"></div>');
            j.attr("backdrop-class", b.backdropClass), b.animation && j.attr("modal-animation", "true"), l = d(j)(m), h.append(l)
        }
        var k = angular.element('<div modal-window="modal-window"></div>');
        k.attr({
            "template-url": b.windowTemplateUrl,
            "window-class": b.windowClass,
            size: b.size,
            index: o.length() - 1,
            animate: "animate"
        }).html(b.content), b.animation && k.attr("modal-animation", "true");
        var p = d(k)(b.scope);
        o.top().value.modalDomEl = p, o.top().value.modalOpener = f, h.append(p), h.addClass(n)
    }, p.close = function (a, b) {
        var c = o.get(a);
        return c && k(c, b, !0) ? (c.value.deferred.resolve(b), h(a), c.value.modalOpener.focus(), !0) : !c
    }, p.dismiss = function (a, b) {
        var c = o.get(a);
        return c && k(c, b, !1) ? (c.value.deferred.reject(b), h(a), c.value.modalOpener.focus(), !0) : !c
    }, p.dismissAll = function (a) {
        for (var b = this.getTop(); b && this.dismiss(b.key, a);)b = this.getTop()
    }, p.getTop = function () {
        return o.top()
    }, p.modalRendered = function (a) {
        var b = o.get(a);
        b && b.value.renderDeferred.resolve()
    }, p
}]).provider("$modal", function () {
    var a = {
        options: {animation: !0, backdrop: !0, keyboard: !0},
        $get: ["$injector", "$rootScope", "$q", "$templateRequest", "$controller", "$modalStack", function (b, c, d, e, f, g) {
            function h(a) {
                return a.template ? d.when(a.template) : e(angular.isFunction(a.templateUrl) ? a.templateUrl() : a.templateUrl)
            }

            function i(a) {
                var c = [];
                return angular.forEach(a, function (a) {
                    (angular.isFunction(a) || angular.isArray(a)) && c.push(d.when(b.invoke(a)))
                }), c
            }

            var j = {};
            return j.open = function (b) {
                var e = d.defer(), j = d.defer(), k = d.defer(), l = {
                    result: e.promise,
                    opened: j.promise,
                    rendered: k.promise,
                    close: function (a) {
                        return g.close(l, a)
                    },
                    dismiss: function (a) {
                        return g.dismiss(l, a)
                    }
                };
                if (b = angular.extend({}, a.options, b), b.resolve = b.resolve || {}, !b.template && !b.templateUrl)throw new Error("One of template or templateUrl options is required.");
                var m = d.all([h(b)].concat(i(b.resolve)));
                return m.then(function (a) {
                    var d = (b.scope || c).$new();
                    d.$close = l.close, d.$dismiss = l.dismiss;
                    var h, i = {}, j = 1;
                    b.controller && (i.$scope = d, i.$modalInstance = l, angular.forEach(b.resolve, function (b, c) {
                        i[c] = a[j++]
                    }), h = f(b.controller, i), b.controllerAs && (d[b.controllerAs] = h)), g.open(l, {
                        scope: d,
                        deferred: e,
                        renderDeferred: k,
                        content: a[0],
                        animation: b.animation,
                        backdrop: b.backdrop,
                        keyboard: b.keyboard,
                        backdropClass: b.backdropClass,
                        windowClass: b.windowClass,
                        windowTemplateUrl: b.windowTemplateUrl,
                        size: b.size
                    })
                }, function (a) {
                    e.reject(a)
                }), m.then(function () {
                    j.resolve(!0)
                }, function (a) {
                    j.reject(a)
                }), l
            }, j
        }]
    };
    return a
}), angular.module("ui.bootstrap.pagination", []).controller("PaginationController", ["$scope", "$attrs", "$parse", function (a, b, c) {
    var d = this, e = {$setViewValue: angular.noop}, f = b.numPages ? c(b.numPages).assign : angular.noop;
    this.init = function (g, h) {
        e = g, this.config = h, e.$render = function () {
            d.render()
        }, b.itemsPerPage ? a.$parent.$watch(c(b.itemsPerPage), function (b) {
            d.itemsPerPage = parseInt(b, 10), a.totalPages = d.calculateTotalPages()
        }) : this.itemsPerPage = h.itemsPerPage, a.$watch("totalItems", function () {
            a.totalPages = d.calculateTotalPages()
        }), a.$watch("totalPages", function (b) {
            f(a.$parent, b), a.page > b ? a.selectPage(b) : e.$render()
        })
    }, this.calculateTotalPages = function () {
        var b = this.itemsPerPage < 1 ? 1 : Math.ceil(a.totalItems / this.itemsPerPage);
        return Math.max(b || 0, 1)
    }, this.render = function () {
        a.page = parseInt(e.$viewValue, 10) || 1
    }, a.selectPage = function (b, c) {
        a.page !== b && b > 0 && b <= a.totalPages && (c && c.target && c.target.blur(), e.$setViewValue(b), e.$render())
    }, a.getText = function (b) {
        return a[b + "Text"] || d.config[b + "Text"]
    }, a.noPrevious = function () {
        return 1 === a.page
    }, a.noNext = function () {
        return a.page === a.totalPages
    }
}]).constant("paginationConfig", {
    itemsPerPage: 10,
    boundaryLinks: !1,
    directionLinks: !0,
    firstText: "First",
    previousText: "Previous",
    nextText: "Next",
    lastText: "Last",
    rotate: !0
}).directive("pagination", ["$parse", "paginationConfig", function (a, b) {
    return {
        restrict: "EA",
        scope: {totalItems: "=", firstText: "@", previousText: "@", nextText: "@", lastText: "@"},
        require: ["pagination", "?ngModel"],
        controller: "PaginationController",
        templateUrl: "template/pagination/pagination.html",
        replace: !0,
        link: function (c, d, e, f) {
            function g(a, b, c) {
                return {number: a, text: b, active: c}
            }

            function h(a, b) {
                var c = [], d = 1, e = b, f = angular.isDefined(k) && b > k;
                f && (l ? (d = Math.max(a - Math.floor(k / 2), 1), e = d + k - 1, e > b && (e = b, d = e - k + 1)) : (d = (Math.ceil(a / k) - 1) * k + 1, e = Math.min(d + k - 1, b)));
                for (var h = d; e >= h; h++) {
                    var i = g(h, h, h === a);
                    c.push(i)
                }
                if (f && !l) {
                    if (d > 1) {
                        var j = g(d - 1, "...", !1);
                        c.unshift(j)
                    }
                    if (b > e) {
                        var m = g(e + 1, "...", !1);
                        c.push(m)
                    }
                }
                return c
            }

            var i = f[0], j = f[1];
            if (j) {
                var k = angular.isDefined(e.maxSize) ? c.$parent.$eval(e.maxSize) : b.maxSize, l = angular.isDefined(e.rotate) ? c.$parent.$eval(e.rotate) : b.rotate;
                c.boundaryLinks = angular.isDefined(e.boundaryLinks) ? c.$parent.$eval(e.boundaryLinks) : b.boundaryLinks, c.directionLinks = angular.isDefined(e.directionLinks) ? c.$parent.$eval(e.directionLinks) : b.directionLinks, i.init(j, b), e.maxSize && c.$parent.$watch(a(e.maxSize), function (a) {
                    k = parseInt(a, 10), i.render()
                });
                var m = i.render;
                i.render = function () {
                    m(), c.page > 0 && c.page <= c.totalPages && (c.pages = h(c.page, c.totalPages))
                }
            }
        }
    }
}]).constant("pagerConfig", {
    itemsPerPage: 10,
    previousText: "« Previous",
    nextText: "Next »",
    align: !0
}).directive("pager", ["pagerConfig", function (a) {
    return {
        restrict: "EA",
        scope: {totalItems: "=", previousText: "@", nextText: "@"},
        require: ["pager", "?ngModel"],
        controller: "PaginationController",
        templateUrl: "template/pagination/pager.html",
        replace: !0,
        link: function (b, c, d, e) {
            var f = e[0], g = e[1];
            g && (b.align = angular.isDefined(d.align) ? b.$parent.$eval(d.align) : a.align, f.init(g, a))
        }
    }
}]), angular.module("ui.bootstrap.tooltip", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).provider("$tooltip", function () {
    function a(a) {
        var b = /[A-Z]/g, c = "-";
        return a.replace(b, function (a, b) {
            return (b ? c : "") + a.toLowerCase()
        })
    }

    var b = {placement: "top", animation: !0, popupDelay: 0, useContentExp: !1}, c = {
        mouseenter: "mouseleave",
        click: "click",
        focus: "blur"
    }, d = {};
    this.options = function (a) {
        angular.extend(d, a)
    }, this.setTriggers = function (a) {
        angular.extend(c, a)
    }, this.$get = ["$window", "$compile", "$timeout", "$document", "$position", "$interpolate", function (e, f, g, h, i, j) {
        return function (e, k, l, m) {
            function n(a) {
                var b = a || m.trigger || l, d = c[b] || b;
                return {show: b, hide: d}
            }

            m = angular.extend({}, b, d, m);
            var o = a(e), p = j.startSymbol(), q = j.endSymbol(), r = "<div " + o + '-popup title="' + p + "title" + q + '" ' + (m.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + p + "content" + q + '" ') + 'placement="' + p + "placement" + q + '" popup-class="' + p + "popupClass" + q + '" animation="animation" is-open="isOpen"origin-scope="origScope" ></div>';
            return {
                restrict: "EA", compile: function () {
                    var a = f(r);
                    return function (b, c, d) {
                        function f() {
                            E.isOpen ? l() : j()
                        }

                        function j() {
                            (!D || b.$eval(d[k + "Enable"])) && (s(), E.popupDelay ? A || (A = g(o, E.popupDelay, !1), A.then(function (a) {
                                a()
                            })) : o()())
                        }

                        function l() {
                            b.$apply(function () {
                                p()
                            })
                        }

                        function o() {
                            return A = null, z && (g.cancel(z), z = null), (m.useContentExp ? E.contentExp() : E.content) ? (q(), x.css({
                                top: 0,
                                left: 0,
                                display: "block"
                            }), E.$digest(), F(), E.isOpen = !0, E.$apply(), F) : angular.noop
                        }

                        function p() {
                            E.isOpen = !1, g.cancel(A), A = null, E.animation ? z || (z = g(r, 500)) : r()
                        }

                        function q() {
                            x && r(), y = E.$new(), x = a(y, function (a) {
                                B ? h.find("body").append(a) : c.after(a)
                            }), y.$watch(function () {
                                g(F, 0, !1)
                            }), m.useContentExp && y.$watch("contentExp()", function (a) {
                                !a && E.isOpen && p()
                            })
                        }

                        function r() {
                            z = null, x && (x.remove(), x = null), y && (y.$destroy(), y = null)
                        }

                        function s() {
                            t(), u(), v()
                        }

                        function t() {
                            E.popupClass = d[k + "Class"]
                        }

                        function u() {
                            var a = d[k + "Placement"];
                            E.placement = angular.isDefined(a) ? a : m.placement
                        }

                        function v() {
                            var a = d[k + "PopupDelay"], b = parseInt(a, 10);
                            E.popupDelay = isNaN(b) ? m.popupDelay : b
                        }

                        function w() {
                            var a = d[k + "Trigger"];
                            G(), C = n(a), C.show === C.hide ? c.bind(C.show, f) : (c.bind(C.show, j), c.bind(C.hide, l))
                        }

                        var x, y, z, A, B = angular.isDefined(m.appendToBody) ? m.appendToBody : !1, C = n(void 0), D = angular.isDefined(d[k + "Enable"]), E = b.$new(!0), F = function () {
                            if (x) {
                                var a = i.positionElements(c, x, E.placement, B);
                                a.top += "px", a.left += "px", x.css(a)
                            }
                        };
                        E.origScope = b, E.isOpen = !1, E.contentExp = function () {
                            return b.$eval(d[e])
                        }, m.useContentExp || d.$observe(e, function (a) {
                            E.content = a, !a && E.isOpen && p()
                        }), d.$observe("disabled", function (a) {
                            a && E.isOpen && p()
                        }), d.$observe(k + "Title", function (a) {
                            E.title = a
                        });
                        var G = function () {
                            c.unbind(C.show, j), c.unbind(C.hide, l)
                        };
                        w();
                        var H = b.$eval(d[k + "Animation"]);
                        E.animation = angular.isDefined(H) ? !!H : m.animation;
                        var I = b.$eval(d[k + "AppendToBody"]);
                        B = angular.isDefined(I) ? I : B, B && b.$on("$locationChangeSuccess", function () {
                            E.isOpen && p()
                        }), b.$on("$destroy", function () {
                            g.cancel(z), g.cancel(A), G(), r(), E = null
                        })
                    }
                }
            }
        }
    }]
}).directive("tooltipTemplateTransclude", ["$animate", "$sce", "$compile", "$templateRequest", function (a, b, c, d) {
    return {
        link: function (e, f, g) {
            var h, i, j, k = e.$eval(g.tooltipTemplateTranscludeScope), l = 0, m = function () {
                i && (i.remove(), i = null), h && (h.$destroy(), h = null), j && (a.leave(j).then(function () {
                    i = null
                }), i = j, j = null)
            };
            e.$watch(b.parseAsResourceUrl(g.tooltipTemplateTransclude), function (b) {
                var g = ++l;
                b ? (d(b, !0).then(function (d) {
                    if (g === l) {
                        var e = k.$new(), i = d, n = c(i)(e, function (b) {
                            m(), a.enter(b, f)
                        });
                        h = e, j = n, h.$emit("$includeContentLoaded", b)
                    }
                }, function () {
                    g === l && (m(), e.$emit("$includeContentError", b))
                }), e.$emit("$includeContentRequested", b)) : m()
            }), e.$on("$destroy", m)
        }
    }
}]).directive("tooltipClasses", function () {
    return {
        restrict: "A", link: function (a, b, c) {
            a.placement && b.addClass(a.placement), a.popupClass && b.addClass(a.popupClass), a.animation() && b.addClass(c.tooltipAnimationClass)
        }
    }
}).directive("tooltipPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-popup.html"
    }
}).directive("tooltip", ["$tooltip", function (a) {
    return a("tooltip", "tooltip", "mouseenter")
}]).directive("tooltipTemplatePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {contentExp: "&", placement: "@", popupClass: "@", animation: "&", isOpen: "&", originScope: "&"},
        templateUrl: "template/tooltip/tooltip-template-popup.html"
    }
}).directive("tooltipTemplate", ["$tooltip", function (a) {
    return a("tooltipTemplate", "tooltip", "mouseenter", {useContentExp: !0})
}]).directive("tooltipHtmlPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {contentExp: "&", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-html-popup.html"
    }
}).directive("tooltipHtml", ["$tooltip", function (a) {
    return a("tooltipHtml", "tooltip", "mouseenter", {useContentExp: !0})
}]).directive("tooltipHtmlUnsafePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/tooltip/tooltip-html-unsafe-popup.html"
    }
}).value("tooltipHtmlUnsafeSuppressDeprecated", !1).directive("tooltipHtmlUnsafe", ["$tooltip", "tooltipHtmlUnsafeSuppressDeprecated", "$log", function (a, b, c) {
    return b || c.warn("tooltip-html-unsafe is now deprecated. Use tooltip-html or tooltip-template instead."), a("tooltipHtmlUnsafe", "tooltip", "mouseenter")
}]), angular.module("ui.bootstrap.popover", ["ui.bootstrap.tooltip"]).directive("popoverTemplatePopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {
            title: "@",
            contentExp: "&",
            placement: "@",
            popupClass: "@",
            animation: "&",
            isOpen: "&",
            originScope: "&"
        },
        templateUrl: "template/popover/popover-template.html"
    }
}).directive("popoverTemplate", ["$tooltip", function (a) {
    return a("popoverTemplate", "popover", "click", {useContentExp: !0})
}]).directive("popoverPopup", function () {
    return {
        restrict: "EA",
        replace: !0,
        scope: {title: "@", content: "@", placement: "@", popupClass: "@", animation: "&", isOpen: "&"},
        templateUrl: "template/popover/popover.html"
    }
}).directive("popover", ["$tooltip", function (a) {
    return a("popover", "popover", "click")
}]), angular.module("ui.bootstrap.progressbar", []).constant("progressConfig", {
    animate: !0,
    max: 100
}).controller("ProgressController", ["$scope", "$attrs", "progressConfig", function (a, b, c) {
    var d = this, e = angular.isDefined(b.animate) ? a.$parent.$eval(b.animate) : c.animate;
    this.bars = [], a.max = angular.isDefined(a.max) ? a.max : c.max, this.addBar = function (b, c) {
        e || c.css({transition: "none"}), this.bars.push(b), b.$watch("value", function (c) {
            b.percent = +(100 * c / a.max).toFixed(2)
        }), b.$on("$destroy", function () {
            c = null, d.removeBar(b)
        })
    }, this.removeBar = function (a) {
        this.bars.splice(this.bars.indexOf(a), 1)
    }
}]).directive("progress", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        require: "progress",
        scope: {},
        templateUrl: "template/progressbar/progress.html"
    }
}).directive("bar", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        require: "^progress",
        scope: {value: "=", max: "=?", type: "@"},
        templateUrl: "template/progressbar/bar.html",
        link: function (a, b, c, d) {
            d.addBar(a, b)
        }
    }
}).directive("progressbar", function () {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        controller: "ProgressController",
        scope: {value: "=", max: "=?", type: "@"},
        templateUrl: "template/progressbar/progressbar.html",
        link: function (a, b, c, d) {
            d.addBar(a, angular.element(b.children()[0]))
        }
    }
}), angular.module("ui.bootstrap.rating", []).constant("ratingConfig", {
    max: 5,
    stateOn: null,
    stateOff: null
}).controller("RatingController", ["$scope", "$attrs", "ratingConfig", function (a, b, c) {
    var d = {$setViewValue: angular.noop};
    this.init = function (e) {
        d = e, d.$render = this.render, d.$formatters.push(function (a) {
            return angular.isNumber(a) && a << 0 !== a && (a = Math.round(a)), a
        }), this.stateOn = angular.isDefined(b.stateOn) ? a.$parent.$eval(b.stateOn) : c.stateOn, this.stateOff = angular.isDefined(b.stateOff) ? a.$parent.$eval(b.stateOff) : c.stateOff;
        var f = angular.isDefined(b.ratingStates) ? a.$parent.$eval(b.ratingStates) : new Array(angular.isDefined(b.max) ? a.$parent.$eval(b.max) : c.max);
        a.range = this.buildTemplateObjects(f)
    }, this.buildTemplateObjects = function (a) {
        for (var b = 0, c = a.length; c > b; b++)a[b] = angular.extend({index: b}, {
            stateOn: this.stateOn,
            stateOff: this.stateOff
        }, a[b]);
        return a
    }, a.rate = function (b) {
        !a.readonly && b >= 0 && b <= a.range.length && (d.$setViewValue(b), d.$render())
    }, a.enter = function (b) {
        a.readonly || (a.value = b), a.onHover({value: b})
    }, a.reset = function () {
        a.value = d.$viewValue, a.onLeave()
    }, a.onKeydown = function (b) {
        /(37|38|39|40)/.test(b.which) && (b.preventDefault(), b.stopPropagation(), a.rate(a.value + (38 === b.which || 39 === b.which ? 1 : -1)))
    }, this.render = function () {
        a.value = d.$viewValue
    }
}]).directive("rating", function () {
    return {
        restrict: "EA",
        require: ["rating", "ngModel"],
        scope: {readonly: "=?", onHover: "&", onLeave: "&"},
        controller: "RatingController",
        templateUrl: "template/rating/rating.html",
        replace: !0,
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            e.init(f)
        }
    }
}), angular.module("ui.bootstrap.tabs", []).controller("TabsetController", ["$scope", function (a) {
    var b = this, c = b.tabs = a.tabs = [];
    b.select = function (a) {
        angular.forEach(c, function (b) {
            b.active && b !== a && (b.active = !1, b.onDeselect())
        }), a.active = !0, a.onSelect()
    }, b.addTab = function (a) {
        c.push(a), 1 === c.length && a.active !== !1 ? a.active = !0 : a.active ? b.select(a) : a.active = !1
    }, b.removeTab = function (a) {
        var e = c.indexOf(a);
        if (a.active && c.length > 1 && !d) {
            var f = e == c.length - 1 ? e - 1 : e + 1;
            b.select(c[f])
        }
        c.splice(e, 1)
    };
    var d;
    a.$on("$destroy", function () {
        d = !0
    })
}]).directive("tabset", function () {
    return {
        restrict: "EA",
        transclude: !0,
        replace: !0,
        scope: {type: "@"},
        controller: "TabsetController",
        templateUrl: "template/tabs/tabset.html",
        link: function (a, b, c) {
            a.vertical = angular.isDefined(c.vertical) ? a.$parent.$eval(c.vertical) : !1, a.justified = angular.isDefined(c.justified) ? a.$parent.$eval(c.justified) : !1
        }
    }
}).directive("tab", ["$parse", "$log", function (a, b) {
    return {
        require: "^tabset",
        restrict: "EA",
        replace: !0,
        templateUrl: "template/tabs/tab.html",
        transclude: !0,
        scope: {active: "=?", heading: "@", onSelect: "&select", onDeselect: "&deselect"},
        controller: function () {
        },
        compile: function (c, d, e) {
            return function (c, d, f, g) {
                c.$watch("active", function (a) {
                    a && g.select(c)
                }), c.disabled = !1, f.disable && c.$parent.$watch(a(f.disable), function (a) {
                    c.disabled = !!a
                }), f.disabled && (b.warn('Use of "disabled" attribute has been deprecated, please use "disable"'), c.$parent.$watch(a(f.disabled), function (a) {
                    c.disabled = !!a
                })), c.select = function () {
                    c.disabled || (c.active = !0)
                }, g.addTab(c), c.$on("$destroy", function () {
                    g.removeTab(c)
                }), c.$transcludeFn = e
            }
        }
    }
}]).directive("tabHeadingTransclude", [function () {
    return {
        restrict: "A", require: "^tab", link: function (a, b) {
            a.$watch("headingElement", function (a) {
                a && (b.html(""), b.append(a))
            })
        }
    }
}]).directive("tabContentTransclude", function () {
    function a(a) {
        return a.tagName && (a.hasAttribute("tab-heading") || a.hasAttribute("data-tab-heading") || "tab-heading" === a.tagName.toLowerCase() || "data-tab-heading" === a.tagName.toLowerCase())
    }

    return {
        restrict: "A", require: "^tabset", link: function (b, c, d) {
            var e = b.$eval(d.tabContentTransclude);
            e.$transcludeFn(e.$parent, function (b) {
                angular.forEach(b, function (b) {
                    a(b) ? e.headingElement = b : c.append(b)
                })
            })
        }
    }
}), angular.module("ui.bootstrap.timepicker", []).constant("timepickerConfig", {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: !0,
    meridians: null,
    readonlyInput: !1,
    mousewheel: !0,
    arrowkeys: !0
}).controller("TimepickerController", ["$scope", "$attrs", "$parse", "$log", "$locale", "timepickerConfig", function (a, b, c, d, e, f) {
    function g() {
        var b = parseInt(a.hours, 10), c = a.showMeridian ? b > 0 && 13 > b : b >= 0 && 24 > b;
        return c ? (a.showMeridian && (12 === b && (b = 0), a.meridian === p[1] && (b += 12)), b) : void 0
    }

    function h() {
        var b = parseInt(a.minutes, 10);
        return b >= 0 && 60 > b ? b : void 0
    }

    function i(a) {
        return angular.isDefined(a) && a.toString().length < 2 ? "0" + a : a.toString()
    }

    function j(a) {
        k(), o.$setViewValue(new Date(n)), l(a)
    }

    function k() {
        o.$setValidity("time", !0), a.invalidHours = !1, a.invalidMinutes = !1
    }

    function l(b) {
        var c = n.getHours(), d = n.getMinutes();
        a.showMeridian && (c = 0 === c || 12 === c ? 12 : c % 12), a.hours = "h" === b ? c : i(c), "m" !== b && (a.minutes = i(d)), a.meridian = n.getHours() < 12 ? p[0] : p[1]
    }

    function m(a) {
        var b = new Date(n.getTime() + 6e4 * a);
        n.setHours(b.getHours(), b.getMinutes()), j()
    }

    var n = new Date, o = {$setViewValue: angular.noop}, p = angular.isDefined(b.meridians) ? a.$parent.$eval(b.meridians) : f.meridians || e.DATETIME_FORMATS.AMPMS;
    this.init = function (c, d) {
        o = c, o.$render = this.render, o.$formatters.unshift(function (a) {
            return a ? new Date(a) : null
        });
        var e = d.eq(0), g = d.eq(1), h = angular.isDefined(b.mousewheel) ? a.$parent.$eval(b.mousewheel) : f.mousewheel;
        h && this.setupMousewheelEvents(e, g);
        var i = angular.isDefined(b.arrowkeys) ? a.$parent.$eval(b.arrowkeys) : f.arrowkeys;
        i && this.setupArrowkeyEvents(e, g), a.readonlyInput = angular.isDefined(b.readonlyInput) ? a.$parent.$eval(b.readonlyInput) : f.readonlyInput, this.setupInputEvents(e, g)
    };
    var q = f.hourStep;
    b.hourStep && a.$parent.$watch(c(b.hourStep), function (a) {
        q = parseInt(a, 10)
    });
    var r = f.minuteStep;
    b.minuteStep && a.$parent.$watch(c(b.minuteStep), function (a) {
        r = parseInt(a, 10)
    }), a.showMeridian = f.showMeridian, b.showMeridian && a.$parent.$watch(c(b.showMeridian), function (b) {
        if (a.showMeridian = !!b, o.$error.time) {
            var c = g(), d = h();
            angular.isDefined(c) && angular.isDefined(d) && (n.setHours(c), j())
        } else l()
    }), this.setupMousewheelEvents = function (b, c) {
        var d = function (a) {
            a.originalEvent && (a = a.originalEvent);
            var b = a.wheelDelta ? a.wheelDelta : -a.deltaY;
            return a.detail || b > 0
        };
        b.bind("mousewheel wheel", function (b) {
            a.$apply(d(b) ? a.incrementHours() : a.decrementHours()), b.preventDefault()
        }), c.bind("mousewheel wheel", function (b) {
            a.$apply(d(b) ? a.incrementMinutes() : a.decrementMinutes()), b.preventDefault()
        })
    }, this.setupArrowkeyEvents = function (b, c) {
        b.bind("keydown", function (b) {
            38 === b.which ? (b.preventDefault(), a.incrementHours(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementHours(), a.$apply())
        }), c.bind("keydown", function (b) {
            38 === b.which ? (b.preventDefault(), a.incrementMinutes(), a.$apply()) : 40 === b.which && (b.preventDefault(), a.decrementMinutes(), a.$apply())
        })
    }, this.setupInputEvents = function (b, c) {
        if (a.readonlyInput)return a.updateHours = angular.noop, void(a.updateMinutes = angular.noop);
        var d = function (b, c) {
            o.$setViewValue(null), o.$setValidity("time", !1), angular.isDefined(b) && (a.invalidHours = b), angular.isDefined(c) && (a.invalidMinutes = c)
        };
        a.updateHours = function () {
            var a = g();
            angular.isDefined(a) ? (n.setHours(a), j("h")) : d(!0)
        }, b.bind("blur", function () {
            !a.invalidHours && a.hours < 10 && a.$apply(function () {
                a.hours = i(a.hours)
            })
        }), a.updateMinutes = function () {
            var a = h();
            angular.isDefined(a) ? (n.setMinutes(a), j("m")) : d(void 0, !0)
        }, c.bind("blur", function () {
            !a.invalidMinutes && a.minutes < 10 && a.$apply(function () {
                a.minutes = i(a.minutes)
            })
        })
    }, this.render = function () {
        var a = o.$viewValue;
        isNaN(a) ? (o.$setValidity("time", !1), d.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')) : (a && (n = a), k(), l())
    }, a.incrementHours = function () {
        m(60 * q)
    }, a.decrementHours = function () {
        m(60 * -q)
    }, a.incrementMinutes = function () {
        m(r)
    }, a.decrementMinutes = function () {
        m(-r)
    }, a.toggleMeridian = function () {
        m(720 * (n.getHours() < 12 ? 1 : -1))
    }
}]).directive("timepicker", function () {
    return {
        restrict: "EA",
        require: ["timepicker", "?^ngModel"],
        controller: "TimepickerController",
        replace: !0,
        scope: {},
        templateUrl: "template/timepicker/timepicker.html",
        link: function (a, b, c, d) {
            var e = d[0], f = d[1];
            f && e.init(f, b.find("input"))
        }
    }
}), angular.module("ui.bootstrap.transition", []).value("$transitionSuppressDeprecated", !1).factory("$transition", ["$q", "$timeout", "$rootScope", "$log", "$transitionSuppressDeprecated", function (a, b, c, d, e) {
    function f(a) {
        for (var b in a)if (void 0 !== h.style[b])return a[b]
    }

    e || d.warn("$transition is now deprecated. Use $animate from ngAnimate instead.");
    var g = function (d, e, f) {
        f = f || {};
        var h = a.defer(), i = g[f.animation ? "animationEndEventName" : "transitionEndEventName"], j = function () {
            c.$apply(function () {
                d.unbind(i, j), h.resolve(d)
            })
        };
        return i && d.bind(i, j), b(function () {
            angular.isString(e) ? d.addClass(e) : angular.isFunction(e) ? e(d) : angular.isObject(e) && d.css(e), i || h.resolve(d)
        }), h.promise.cancel = function () {
            i && d.unbind(i, j), h.reject("Transition cancelled")
        }, h.promise
    }, h = document.createElement("trans"), i = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd",
        transition: "transitionend"
    }, j = {
        WebkitTransition: "webkitAnimationEnd",
        MozTransition: "animationend",
        OTransition: "oAnimationEnd",
        transition: "animationend"
    };
    return g.transitionEndEventName = f(i), g.animationEndEventName = f(j), g
}]), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).factory("typeaheadParser", ["$parse", function (a) {
    var b = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
        parse: function (c) {
            var d = c.match(b);
            if (!d)throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + c + '".');
            return {itemName: d[3], source: a(d[4]), viewMapper: a(d[2] || d[1]), modelMapper: a(d[1])}
        }
    }
}]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser", function (a, b, c, d, e, f, g) {
    var h = [9, 13, 27, 38, 40];
    return {
        require: "ngModel", link: function (i, j, k, l) {
            var m, n = i.$eval(k.typeaheadMinLength) || 1, o = i.$eval(k.typeaheadWaitMs) || 0, p = i.$eval(k.typeaheadEditable) !== !1, q = b(k.typeaheadLoading).assign || angular.noop, r = b(k.typeaheadOnSelect), s = k.typeaheadInputFormatter ? b(k.typeaheadInputFormatter) : void 0, t = k.typeaheadAppendToBody ? i.$eval(k.typeaheadAppendToBody) : !1, u = i.$eval(k.typeaheadFocusFirst) !== !1, v = b(k.ngModel).assign, w = g.parse(k.typeahead), x = i.$new();
            i.$on("$destroy", function () {
                x.$destroy()
            });
            var y = "typeahead-" + x.$id + "-" + Math.floor(1e4 * Math.random());
            j.attr({"aria-autocomplete": "list", "aria-expanded": !1, "aria-owns": y});
            var z = angular.element("<div typeahead-popup></div>");
            z.attr({
                id: y,
                matches: "matches",
                active: "activeIdx",
                select: "select(activeIdx)",
                query: "query",
                position: "position"
            }), angular.isDefined(k.typeaheadTemplateUrl) && z.attr("template-url", k.typeaheadTemplateUrl);
            var A = function () {
                x.matches = [], x.activeIdx = -1, j.attr("aria-expanded", !1)
            }, B = function (a) {
                return y + "-option-" + a
            };
            x.$watch("activeIdx", function (a) {
                0 > a ? j.removeAttr("aria-activedescendant") : j.attr("aria-activedescendant", B(a))
            });
            var C = function (a) {
                var b = {$viewValue: a};
                q(i, !0), c.when(w.source(i, b)).then(function (c) {
                    var d = a === l.$viewValue;
                    if (d && m)if (c && c.length > 0) {
                        x.activeIdx = u ? 0 : -1, x.matches.length = 0;
                        for (var e = 0; e < c.length; e++)b[w.itemName] = c[e], x.matches.push({
                            id: B(e),
                            label: w.viewMapper(x, b),
                            model: c[e]
                        });
                        x.query = a, x.position = t ? f.offset(j) : f.position(j), x.position.top = x.position.top + j.prop("offsetHeight"), j.attr("aria-expanded", !0)
                    } else A();
                    d && q(i, !1)
                }, function () {
                    A(), q(i, !1)
                })
            };
            A(), x.query = void 0;
            var D, E = function (a) {
                D = d(function () {
                    C(a)
                }, o)
            }, F = function () {
                D && d.cancel(D)
            };
            l.$parsers.unshift(function (a) {
                return m = !0, a && a.length >= n ? o > 0 ? (F(), E(a)) : C(a) : (q(i, !1), F(), A()), p ? a : a ? void l.$setValidity("editable", !1) : (l.$setValidity("editable", !0), a)
            }), l.$formatters.push(function (a) {
                var b, c, d = {};
                return p || l.$setValidity("editable", !0), s ? (d.$model = a, s(i, d)) : (d[w.itemName] = a, b = w.viewMapper(i, d), d[w.itemName] = void 0, c = w.viewMapper(i, d), b !== c ? b : a)
            }), x.select = function (a) {
                var b, c, e = {};
                e[w.itemName] = c = x.matches[a].model, b = w.modelMapper(i, e), v(i, b), l.$setValidity("editable", !0), l.$setValidity("parse", !0), r(i, {
                    $item: c,
                    $model: b,
                    $label: w.viewMapper(i, e)
                }), A(), d(function () {
                    j[0].focus()
                }, 0, !1)
            }, j.bind("keydown", function (a) {
                0 !== x.matches.length && -1 !== h.indexOf(a.which) && (-1 != x.activeIdx || 13 !== a.which && 9 !== a.which) && (a.preventDefault(), 40 === a.which ? (x.activeIdx = (x.activeIdx + 1) % x.matches.length, x.$digest()) : 38 === a.which ? (x.activeIdx = (x.activeIdx > 0 ? x.activeIdx : x.matches.length) - 1, x.$digest()) : 13 === a.which || 9 === a.which ? x.$apply(function () {
                    x.select(x.activeIdx)
                }) : 27 === a.which && (a.stopPropagation(), A(), x.$digest()))
            }), j.bind("blur", function () {
                m = !1
            });
            var G = function (a) {
                j[0] !== a.target && (A(), x.$digest())
            };
            e.bind("click", G), i.$on("$destroy", function () {
                e.unbind("click", G), t && H.remove(), z.remove()
            });
            var H = a(z)(x);
            t ? e.find("body").append(H) : j.after(H)
        }
    }
}]).directive("typeaheadPopup", function () {
    return {
        restrict: "EA",
        scope: {matches: "=", query: "=", active: "=", position: "=", select: "&"},
        replace: !0,
        templateUrl: "template/typeahead/typeahead-popup.html",
        link: function (a, b, c) {
            a.templateUrl = c.templateUrl, a.isOpen = function () {
                return a.matches.length > 0
            }, a.isActive = function (b) {
                return a.active == b
            }, a.selectActive = function (b) {
                a.active = b
            }, a.selectMatch = function (b) {
                a.select({activeIdx: b})
            }
        }
    }
}).directive("typeaheadMatch", ["$templateRequest", "$compile", "$parse", function (a, b, c) {
    return {
        restrict: "EA", scope: {index: "=", match: "=", query: "="}, link: function (d, e, f) {
            var g = c(f.templateUrl)(d.$parent) || "template/typeahead/typeahead-match.html";
            a(g).then(function (a) {
                b(a.trim())(d, function (a) {
                    e.replaceWith(a)
                })
            })
        }
    }
}]).filter("typeaheadHighlight", function () {
    function a(a) {
        return a.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }

    return function (b, c) {
        return c ? ("" + b).replace(new RegExp(a(c), "gi"), "<strong>$&</strong>") : b
    }
}), angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function (a) {
    a.put("template/accordion/accordion-group.html", '<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0)" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')
}]), angular.module("template/accordion/accordion.html", []).run(["$templateCache", function (a) {
    a.put("template/accordion/accordion.html", '<div class="panel-group" ng-transclude></div>')
}]), angular.module("template/alert/alert.html", []).run(["$templateCache", function (a) {
    a.put("template/alert/alert.html", '<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')
}]), angular.module("template/carousel/carousel.html", []).run(["$templateCache", function (a) {
    a.put("template/carousel/carousel.html", '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides | orderBy:\'index\' track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')
}]), angular.module("template/carousel/slide.html", []).run(["$templateCache", function (a) {
    a.put("template/carousel/slide.html", '<div ng-class="{\n    \'active\': active\n  }" class="item text-center" ng-transclude></div>\n')
}]), angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function (a) {
    a.put("template/datepicker/datepicker.html", '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')
}]), angular.module("template/datepicker/day.html", []).run(["$templateCache", function (a) {
    a.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}" ng-class="dt.customClass">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}]), angular.module("template/datepicker/month.html", []).run(["$templateCache", function (a) {
    a.put("template/datepicker/month.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}]), angular.module("template/datepicker/popup.html", []).run(["$templateCache", function (a) {
    a.put("template/datepicker/popup.html", '<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')
}]), angular.module("template/datepicker/year.html", []).run(["$templateCache", function (a) {
    a.put("template/datepicker/year.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')
}]), angular.module("template/modal/backdrop.html", []).run(["$templateCache", function (a) {
    a.put("template/modal/backdrop.html", '<div class="modal-backdrop"\n     modal-animation-class="fade"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')
}]), angular.module("template/modal/window.html", []).run(["$templateCache", function (a) {
    a.put("template/modal/window.html", '<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    modal-animation-class="fade"\n	ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" modal-transclude></div></div>\n</div>\n')
}]), angular.module("template/pagination/pager.html", []).run(["$templateCache", function (a) {
    a.put("template/pagination/pager.html", '<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1, $event)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1, $event)">{{getText(\'next\')}}</a></li>\n</ul>')
}]), angular.module("template/pagination/pagination.html", []).run(["$templateCache", function (a) {
    a.put("template/pagination/pagination.html", '<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1, $event)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1, $event)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1, $event)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages, $event)">{{getText(\'last\')}}</a></li>\n</ul>')
}]), angular.module("template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function (a) {
    a.put("template/tooltip/tooltip-html-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n</div>\n')
}]), angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function (a) {
    a.put("template/tooltip/tooltip-html-unsafe-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')
}]), angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function (a) {
    a.put("template/tooltip/tooltip-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')
}]), angular.module("template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function (a) {
    a.put("template/tooltip/tooltip-template-popup.html", '<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner"\n    tooltip-template-transclude="contentExp()"\n    tooltip-template-transclude-scope="originScope()"></div>\n</div>\n')
}]), angular.module("template/popover/popover-template.html", []).run(["$templateCache", function (a) {
    a.put("template/popover/popover-template.html", '<div class="popover"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content"\n        tooltip-template-transclude="contentExp()"\n        tooltip-template-transclude-scope="originScope()"></div>\n  </div>\n</div>\n')
}]), angular.module("template/popover/popover-window.html", []).run(["$templateCache", function (a) {
    a.put("template/popover/popover-window.html", '<div class="popover {{placement}}" ng-class="{ in: isOpen, fade: animation }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" tooltip-template-transclude></div>\n  </div>\n</div>\n')
}]), angular.module("template/popover/popover.html", []).run(["$templateCache", function (a) {
    a.put("template/popover/popover.html", '<div class="popover"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')
}]), angular.module("template/progressbar/bar.html", []).run(["$templateCache", function (a) {
    a.put("template/progressbar/bar.html", '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n')
}]), angular.module("template/progressbar/progress.html", []).run(["$templateCache", function (a) {
    a.put("template/progressbar/progress.html", '<div class="progress" ng-transclude></div>')
}]), angular.module("template/progressbar/progressbar.html", []).run(["$templateCache", function (a) {
    a.put("template/progressbar/progressbar.html", '<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>\n')
}]), angular.module("template/rating/rating.html", []).run(["$templateCache", function (a) {
    a.put("template/rating/rating.html", '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')
}]), angular.module("template/tabs/tab.html", []).run(["$templateCache", function (a) {
    a.put("template/tabs/tab.html", '<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')
}]), angular.module("template/tabs/tabset.html", []).run(["$templateCache", function (a) {
    a.put("template/tabs/tabset.html", '<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')
}]), angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function (a) {
    a.put("template/timepicker/timepicker.html", '<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input style="width:50px;" type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input style="width:50px;" type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')
}]), angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function (a) {
    a.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
}]), angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function (a) {
    a.put("template/typeahead/typeahead-popup.html", '<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')
}]), !angular.$$csp() && angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');ui-bootstrap-0.13.0.min.js:172: WARNING - Suspicious code. The result of the 'getprop' operator is not being used.
            k.length
            ^

ui-bootstrap-0.13.0.min.js:2065: WARNING - Suspicious code. The result of the 'getprop' operator is not being used.
            k.length
            ^

0 error(s), 2 warning(s)
angular.module("ui.bootstrap","ui.bootstrap.collapse ui.bootstrap.accordion ui.bootstrap.alert ui.bootstrap.bindHtml ui.bootstrap.buttons ui.bootstrap.carousel ui.bootstrap.dateparser ui.bootstrap.position ui.bootstrap.datepicker ui.bootstrap.dropdown ui.bootstrap.modal ui.bootstrap.pagination ui.bootstrap.tooltip ui.bootstrap.popover ui.bootstrap.progressbar ui.bootstrap.rating ui.bootstrap.tabs ui.bootstrap.timepicker ui.bootstrap.transition ui.bootstrap.typeahead".split(" "));
angular.module("ui.bootstrap.collapse",[]).directive("collapse",["$animate",function(a){return{link:function(b,f,e){function d(){f.removeClass("collapsing");f.css({height:"auto"})}function c(){f.css({height:"0"});f.removeClass("collapsing");f.addClass("collapse")}b.$watch(e.collapse,function(b){b?(f.css({height:f[0].scrollHeight+"px"}).removeClass("collapse").addClass("collapsing"),a.removeClass(f,"in",{to:{height:"0"}}).then(c)):(f.removeClass("collapse").addClass("collapsing"),a.addClass(f,"in",
{to:{height:f[0].scrollHeight+"px"}}).then(d))})}}}]);
angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,f){this.groups=[];this.closeOthers=function(e){(angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):f.closeOthers)&&angular.forEach(this.groups,function(a){a!==e&&(a.isOpen=!1)})};this.addGroup=function(a){var d=this;this.groups.push(a);a.$on("$destroy",function(){d.removeGroup(a)})};this.removeGroup=
function(a){a=this.groups.indexOf(a);-1!==a&&this.groups.splice(a,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(a){this.heading=
a}},link:function(a,b,f,e){e.addGroup(a);a.$watch("isOpen",function(d){d&&e.closeOthers(a)});a.toggleOpen=function(){a.isDisabled||(a.isOpen=!a.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(a,b,f,e,d){e.setHeading(d(a,angular.noop))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,f,e){a.$watch(function(){return e[f.accordionTransclude]},function(a){a&&
(b.html(""),b.append(a))})}}});
angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b;this.close=a.close}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"@",close:"&"}}}).directive("dismissOnTimeout",["$timeout",function(a){return{require:"alert",link:function(b,f,e,d){a(function(){d.close()},parseInt(e.dismissOnTimeout,10))}}}]);
angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,f){b.addClass("ng-binding").data("$binding",f.bindHtmlUnsafe);a.$watch(f.bindHtmlUnsafe,function(a){b.html(a||"")})}});
angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active";this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,f,e){var d=e[0],c=e[1];c.$render=function(){b.toggleClass(d.activeClass,angular.equals(c.$modelValue,a.$eval(f.btnRadio)))};b.bind(d.toggleEvent,
function(){var e=b.hasClass(d.activeClass);e&&!angular.isDefined(f.uncheckable)||a.$apply(function(){c.$setViewValue(e?null:a.$eval(f.btnRadio));c.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,f,e){function d(c,d){var b=a.$eval(c);return angular.isDefined(b)?b:d}var c=e[0],m=e[1];m.$render=function(){b.toggleClass(c.activeClass,angular.equals(m.$modelValue,d(f.btnCheckboxTrue,!0)))};b.bind(c.toggleEvent,
function(){a.$apply(function(){m.$setViewValue(b.hasClass(c.activeClass)?d(f.btnCheckboxFalse,!1):d(f.btnCheckboxTrue,!0));m.$render()})})}}});
angular.module("ui.bootstrap.carousel",[]).controller("CarouselController",["$scope","$interval","$animate",function(a,b,f){function e(a){if(angular.isUndefined(l[a].index))return l[a];var c;l.length;for(c=0;c<l.length;++c)if(l[c].index==a)return l[c]}function d(){c();var d=+a.interval;!isNaN(d)&&0<d&&(g=b(m,d))}function c(){g&&(b.cancel(g),g=null)}function m(){var c=+a.interval;h&&!isNaN(c)&&0<c?a.next():a.pause()}var g,h,k=this,l=k.slides=a.slides=[],p=-1;k.currentSlide=null;var r=!1;k.select=a.select=
function(c,b){function e(){r||(angular.extend(c,{direction:b,active:!0}),angular.extend(k.currentSlide||{},{direction:b,active:!1}),f.enabled()&&!a.noTransition&&c.$element&&(a.$currentTransition=!0,c.$element.one("$animate:close",function(){a.$currentTransition=null})),k.currentSlide=c,p=g,d())}var g=k.indexOfSlide(c);void 0===b&&(b=g>k.getCurrentIndex()?"next":"prev");c&&c!==k.currentSlide&&e()};a.$on("$destroy",function(){r=!0});k.getCurrentIndex=function(){return k.currentSlide&&angular.isDefined(k.currentSlide.index)?
+k.currentSlide.index:p};k.indexOfSlide=function(a){return angular.isDefined(a.index)?+a.index:l.indexOf(a)};a.next=function(){var c=(k.getCurrentIndex()+1)%l.length;return a.$currentTransition?void 0:k.select(e(c),"next")};a.prev=function(){var c=0>k.getCurrentIndex()-1?l.length-1:k.getCurrentIndex()-1;return a.$currentTransition?void 0:k.select(e(c),"prev")};a.isActive=function(a){return k.currentSlide===a};a.$watch("interval",d);a.$on("$destroy",c);a.play=function(){h||(h=!0,d())};a.pause=function(){a.noPause||
(h=!1,c())};k.addSlide=function(c,d){c.$element=d;l.push(c);1===l.length||c.active?(k.select(l[l.length-1]),1==l.length&&a.play()):c.active=!1};k.removeSlide=function(a){angular.isDefined(a.index)&&l.sort(function(a,c){return+a.index>+c.index});var c=l.indexOf(a);l.splice(c,1);0<l.length&&a.active?k.select(c>=l.length?l[c-1]:l[c]):p>c&&p--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",
scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"=?",index:"=?"},link:function(a,b,f,e){e.addSlide(a,b);a.$on("$destroy",function(){e.removeSlide(a)});a.$watch("active",function(d){d&&e.select(a)})}}}).animation(".item",["$animate",function(a){return{beforeAddClass:function(b,f,e){if("active"==f&&b.parent()&&!b.parent().scope().noTransition){var d=
!1,c=b.isolateScope().direction,m="next"==c?"left":"right";return b.addClass(c),a.addClass(b,m).then(function(){d||b.removeClass(m+" "+c);e()}),function(){d=!0}}e()},beforeRemoveClass:function(b,f,e){if("active"==f&&b.parent()&&!b.parent().scope().noTransition){var d=!1,c="next"==b.isolateScope().direction?"left":"right";return a.addClass(b,c).then(function(){d||b.removeClass(c);e()}),function(){d=!0}}e()}}}]);
angular.module("ui.bootstrap.dateparser",[]).service("dateParser",["$locale","orderByFilter",function(a,b){function f(a){var e=[],f=a.split("");return angular.forEach(d,function(d,b){var l=a.indexOf(b);if(-1<l){a=a.split("");f[l]="("+d.regex+")";a[l]="$";for(var p=l+1,r=l+b.length;r>p;p++)f[p]="",a[p]="$";a=a.join("");e.push({index:l,apply:d.apply})}}),{regex:new RegExp("^"+f.join("")+"$"),map:b(e,"index")}}var e=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;this.parsers={};var d={yyyy:{regex:"\\d{4}",apply:function(a){this.year=
+a}},yy:{regex:"\\d{2}",apply:function(a){this.year=+a+2E3}},y:{regex:"\\d{1,4}",apply:function(a){this.year=+a}},MMMM:{regex:a.DATETIME_FORMATS.MONTH.join("|"),apply:function(c){this.month=a.DATETIME_FORMATS.MONTH.indexOf(c)}},MMM:{regex:a.DATETIME_FORMATS.SHORTMONTH.join("|"),apply:function(c){this.month=a.DATETIME_FORMATS.SHORTMONTH.indexOf(c)}},MM:{regex:"0[1-9]|1[0-2]",apply:function(a){this.month=a-1}},M:{regex:"[1-9]|1[0-2]",apply:function(a){this.month=a-1}},dd:{regex:"[0-2][0-9]{1}|3[0-1]{1}",
apply:function(a){this.date=+a}},d:{regex:"[1-2]?[0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},EEEE:{regex:a.DATETIME_FORMATS.DAY.join("|")},EEE:{regex:a.DATETIME_FORMATS.SHORTDAY.join("|")},HH:{regex:"(?:0|1)[0-9]|2[0-3]",apply:function(a){this.hours=+a}},H:{regex:"1?[0-9]|2[0-3]",apply:function(a){this.hours=+a}},mm:{regex:"[0-5][0-9]",apply:function(a){this.minutes=+a}},m:{regex:"[0-9]|[1-5][0-9]",apply:function(a){this.minutes=+a}},sss:{regex:"[0-9][0-9][0-9]",apply:function(a){this.milliseconds=
+a}},ss:{regex:"[0-5][0-9]",apply:function(a){this.seconds=+a}},s:{regex:"[0-9]|[1-5][0-9]",apply:function(a){this.seconds=+a}}};this.parse=function(c,d,b){if(!angular.isString(c)||!d)return c;d=a.DATETIME_FORMATS[d]||d;d=d.replace(e,"\\$&");this.parsers[d]||(this.parsers[d]=f(d));var h=this.parsers[d];d=h.map;if((c=c.match(h.regex))&&c.length){var k;b=b?{year:b.getFullYear(),month:b.getMonth(),date:b.getDate(),hours:b.getHours(),minutes:b.getMinutes(),seconds:b.getSeconds(),milliseconds:b.getMilliseconds()}:
{year:1900,month:0,date:1,hours:0,minutes:0,seconds:0,milliseconds:0};for(var h=1,l=c.length;l>h;h++){var p=d[h-1];p.apply&&p.apply.call(b,c[h])}d=b.year;c=b.month;h=b.date;return(1>h?!1:1===c&&28<h?29===h&&(0===d%4&&0!==d%100||0===d%400):3===c||5===c||8===c||10===c?31>h:!0)&&(k=new Date(b.year,b.month,b.date,b.hours,b.minutes,b.seconds,b.milliseconds||0)),k}}}]);
angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function f(a,d){return a.currentStyle?a.currentStyle[d]:b.getComputedStyle?b.getComputedStyle(a)[d]:a.style[d]}return{position:function(b){var d=this.offset(b),c={top:0,left:0},m;m=a[0];for(var g=b[0].offsetParent||m;g&&g!==m&&"static"===(f(g,"position")||"static");)g=g.offsetParent;m=g||m;m!=a[0]&&(c=this.offset(angular.element(m)),c.top+=m.clientTop-m.scrollTop,c.left+=m.clientLeft-m.scrollLeft);
m=b[0].getBoundingClientRect();return{width:m.width||b.prop("offsetWidth"),height:m.height||b.prop("offsetHeight"),top:d.top-c.top,left:d.left-c.left}},offset:function(e){var d=e[0].getBoundingClientRect();return{width:d.width||e.prop("offsetWidth"),height:d.height||e.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,f){var g,h,k,l=c.split("-");c=l[0];l=l[1]||"center";g=f?this.offset(a):
this.position(a);h=b.prop("offsetWidth");k=b.prop("offsetHeight");a={center:function(){return g.left+g.width/2-h/2},left:function(){return g.left},right:function(){return g.left+g.width}};b={center:function(){return g.top+g.height/2-k/2},top:function(){return g.top},bottom:function(){return g.top+g.height}};switch(c){case "right":c={top:b[l](),left:a[c]()};break;case "left":c={top:b[l](),left:g.left-h};break;case "bottom":c={top:b[c](),left:a[l]()};break;default:c={top:g.top-k,left:a[l]()}}return c}}}]);
angular.module("ui.bootstrap.datepicker",["ui.bootstrap.dateparser","ui.bootstrap.position"]).constant("datepickerConfig",{formatDay:"dd",formatMonth:"MMMM",formatYear:"yyyy",formatDayHeader:"EEE",formatDayTitle:"MMMM yyyy",formatMonthTitle:"yyyy",datepickerMode:"day",minMode:"day",maxMode:"year",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null,shortcutPropagation:!1}).controller("DatepickerController",["$scope","$attrs","$parse","$interpolate","$timeout","$log","dateFilter","datepickerConfig",
function(a,b,f,e,d,c,m,g){var h=this,k={$setViewValue:angular.noop};this.modes=["day","month","year"];angular.forEach("formatDay formatMonth formatYear formatDayHeader formatDayTitle formatMonthTitle minMode maxMode showWeeks startingDay yearRange shortcutPropagation".split(" "),function(c,d){h[c]=angular.isDefined(b[c])?8>d?e(b[c])(a.$parent):a.$parent.$eval(b[c]):g[c]});angular.forEach(["minDate","maxDate"],function(c){b[c]?a.$parent.$watch(f(b[c]),function(a){h[c]=a?new Date(a):null;h.refreshView()}):
h[c]=g[c]?new Date(g[c]):null});a.datepickerMode=a.datepickerMode||g.datepickerMode;a.maxMode=h.maxMode;a.uniqueId="datepicker-"+a.$id+"-"+Math.floor(1E4*Math.random());angular.isDefined(b.initDate)?(this.activeDate=a.$parent.$eval(b.initDate)||new Date,a.$parent.$watch(b.initDate,function(a){a&&(k.$isEmpty(k.$modelValue)||k.$invalid)&&(h.activeDate=a,h.refreshView())})):this.activeDate=new Date;a.isActive=function(c){return 0===h.compare(c.date,h.activeDate)?(a.activeDateId=c.uid,!0):!1};this.init=
function(a){k=a;k.$render=function(){h.render()}};this.render=function(){if(k.$viewValue){var a=new Date(k.$viewValue),b=!isNaN(a);b?this.activeDate=a:c.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');k.$setValidity("date",b)}this.refreshView()};this.refreshView=function(){if(this.element){this._refreshView();var a=k.$viewValue?new Date(k.$viewValue):null;k.$setValidity("date-disabled",
!a||this.element&&!this.isDisabled(a))}};this.createDateObject=function(a,c){var b=k.$viewValue?new Date(k.$viewValue):null;return{date:a,label:m(a,c),selected:b&&0===this.compare(a,b),disabled:this.isDisabled(a),current:0===this.compare(a,new Date),customClass:this.customClass(a)}};this.isDisabled=function(c){return this.minDate&&0>this.compare(c,this.minDate)||this.maxDate&&0<this.compare(c,this.maxDate)||b.dateDisabled&&a.dateDisabled({date:c,mode:a.datepickerMode})};this.customClass=function(c){return a.customClass({date:c,
mode:a.datepickerMode})};this.split=function(a,c){for(var b=[];0<a.length;)b.push(a.splice(0,c));return b};a.select=function(c){if(a.datepickerMode===h.minMode){var b=k.$viewValue?new Date(k.$viewValue):new Date(0,0,0,0,0,0,0);b.setFullYear(c.getFullYear(),c.getMonth(),c.getDate());k.$setViewValue(b);k.$render()}else h.activeDate=c,a.datepickerMode=h.modes[h.modes.indexOf(a.datepickerMode)-1]};a.move=function(a){var c=h.activeDate.getFullYear()+a*(h.step.years||0);a=h.activeDate.getMonth()+a*(h.step.months||
0);h.activeDate.setFullYear(c,a,1);h.refreshView()};a.toggleMode=function(c){c=c||1;a.datepickerMode===h.maxMode&&1===c||a.datepickerMode===h.minMode&&-1===c||(a.datepickerMode=h.modes[h.modes.indexOf(a.datepickerMode)+c])};a.keys={13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"};var l=function(){d(function(){h.element[0].focus()},0,!1)};a.$on("datepicker.focus",l);a.keydown=function(c){var b=a.keys[c.which];!b||c.shiftKey||c.altKey||((c.preventDefault(),
h.shortcutPropagation||c.stopPropagation(),"enter"===b||"space"===b)?h.isDisabled(h.activeDate)||(a.select(h.activeDate),l()):!c.ctrlKey||"up"!==b&&"down"!==b?(h.handleKeyDown(b,c),h.refreshView()):(a.toggleMode("up"===b?1:-1),l()))}}]).directive("datepicker",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{datepickerMode:"=?",dateDisabled:"&",customClass:"&",shortcutPropagation:"&?"},require:["datepicker","?^ngModel"],controller:"DatepickerController",
link:function(a,b,f,e){a=e[0];(e=e[1])&&a.init(e)}}}).directive("daypicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/day.html",require:"^datepicker",link:function(b,f,e,d){function c(a,c){return 1!==c||0!==a%4||0===a%100&&0!==a%400?g[c]:29}function m(a){a=new Date(a);a.setDate(a.getDate()+4-(a.getDay()||7));var c=a.getTime();return a.setMonth(0),a.setDate(1),Math.floor(Math.round((c-a)/864E5)/7)+1}b.showWeeks=d.showWeeks;d.step={months:1};d.element=
f;var g=[31,28,31,30,31,30,31,31,30,31,30,31];d._refreshView=function(){var c=d.activeDate.getFullYear(),e=d.activeDate.getMonth(),c=new Date(c,e,1),f=d.startingDay-c.getDay(),f=0<f?7-f:-f,g=new Date(c);0<f&&g.setDate(-f+1);c=Array(42);f=new Date(g);g=0;for(f.setHours(12);42>g;)c[g++]=new Date(f),f.setDate(f.getDate()+1);for(f=0;42>f;f++)c[f]=angular.extend(d.createDateObject(c[f],d.formatDay),{secondary:c[f].getMonth()!==e,uid:b.uniqueId+"-"+f});b.labels=Array(7);for(e=0;7>e;e++)b.labels[e]={abbr:a(c[e].date,
d.formatDayHeader),full:a(c[e].date,"EEEE")};if(b.title=a(d.activeDate,d.formatDayTitle),b.rows=d.split(c,7),b.showWeeks)for(b.weekNumbers=[],e=(11-d.startingDay)%7,c=b.rows.length,f=0;c>f;f++)b.weekNumbers.push(m(b.rows[f][e].date))};d.compare=function(a,c){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(c.getFullYear(),c.getMonth(),c.getDate())};d.handleKeyDown=function(a){var b=d.activeDate.getDate();"left"===a?--b:"up"===a?b-=7:"right"===a?b+=1:"down"===a?b+=7:"pageup"===a||
"pagedown"===a?(a=d.activeDate.getMonth()+("pageup"===a?-1:1),d.activeDate.setMonth(a,1),b=Math.min(c(d.activeDate.getFullYear(),d.activeDate.getMonth()),b)):"home"===a?b=1:"end"===a&&(b=c(d.activeDate.getFullYear(),d.activeDate.getMonth()));d.activeDate.setDate(b)};d.refreshView()}}}]).directive("monthpicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/month.html",require:"^datepicker",link:function(b,f,e,d){d.step={years:1};d.element=f;d._refreshView=
function(){for(var c=Array(12),e=d.activeDate.getFullYear(),f=0;12>f;f++)c[f]=angular.extend(d.createDateObject(new Date(e,f,1),d.formatMonth),{uid:b.uniqueId+"-"+f});b.title=a(d.activeDate,d.formatMonthTitle);b.rows=d.split(c,3)};d.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())};d.handleKeyDown=function(a){var b=d.activeDate.getMonth();"left"===a?--b:"up"===a?b-=3:"right"===a?b+=1:"down"===a?b+=3:"pageup"===a||"pagedown"===a?(a=d.activeDate.getFullYear()+
("pageup"===a?-1:1),d.activeDate.setFullYear(a)):"home"===a?b=0:"end"===a&&(b=11);d.activeDate.setMonth(b)};d.refreshView()}}}]).directive("yearpicker",["dateFilter",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/year.html",require:"^datepicker",link:function(a,b,f,e){function d(a){return parseInt((a-1)/c,10)*c+1}var c=e.yearRange;e.step={years:c};e.element=b;e._refreshView=function(){for(var b=Array(c),f=0,h=d(e.activeDate.getFullYear());c>f;f++)b[f]=angular.extend(e.createDateObject(new Date(h+
f,0,1),e.formatYear),{uid:a.uniqueId+"-"+f});a.title=[b[0].label,b[c-1].label].join(" - ");a.rows=e.split(b,5)};e.compare=function(a,c){return a.getFullYear()-c.getFullYear()};e.handleKeyDown=function(a){var b=e.activeDate.getFullYear();"left"===a?--b:"up"===a?b-=5:"right"===a?b+=1:"down"===a?b+=5:"pageup"===a||"pagedown"===a?b+=("pageup"===a?-1:1)*e.step.years:"home"===a?b=d(e.activeDate.getFullYear()):"end"===a&&(b=d(e.activeDate.getFullYear())+c-1);e.activeDate.setFullYear(b)};e.refreshView()}}}]).constant("datepickerPopupConfig",
{datepickerPopup:"yyyy-MM-dd",html5Types:{date:"yyyy-MM-dd","datetime-local":"yyyy-MM-ddTHH:mm:ss.sss",month:"yyyy-MM"},currentText:"Today",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","dateParser","datepickerPopupConfig",function(a,b,f,e,d,c,m){return{restrict:"EA",require:"ngModel",scope:{isOpen:"=?",currentText:"@",clearText:"@",closeText:"@",dateDisabled:"&",customClass:"&"},
link:function(g,h,k,l){function p(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function r(a){if(angular.isNumber(a)&&(a=new Date(a)),a){if(angular.isDate(a)&&!isNaN(a))return a;if(angular.isString(a))return a=c.parse(a,q,g.date)||new Date(a),isNaN(a)?void 0:a}else return null}function n(a,b){var d=a||b;return(angular.isNumber(d)&&(d=new Date(d)),d)?angular.isDate(d)&&!isNaN(d)?!0:angular.isString(d)?(d=c.parse(d,q)||new Date(d),!isNaN(d)):!1:!0}var q,x=angular.isDefined(k.closeOnDateSelection)?
g.$parent.$eval(k.closeOnDateSelection):m.closeOnDateSelection,u=angular.isDefined(k.datepickerAppendToBody)?g.$parent.$eval(k.datepickerAppendToBody):m.appendToBody;g.showButtonBar=angular.isDefined(k.showButtonBar)?g.$parent.$eval(k.showButtonBar):m.showButtonBar;g.getText=function(a){return g[a+"Text"]||m[a+"Text"]};var w=!1;if(m.html5Types[k.type]?(q=m.html5Types[k.type],w=!0):(q=k.datepickerPopup||m.datepickerPopup,k.$observe("datepickerPopup",function(a){a=a||m.datepickerPopup;if(a!==q&&(q=
a,l.$modelValue=null,!q))throw Error("datepickerPopup must have a date format specified.");})),!q)throw Error("datepickerPopup must have a date format specified.");if(w&&k.datepickerPopup)throw Error("HTML5 date input types do not support custom formats.");var z=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");z.attr({"ng-model":"date","ng-change":"dateSelection()"});var A=angular.element(z.children()[0]);if(w&&"month"==k.type&&(A.attr("datepicker-mode",'"month"'),A.attr("min-mode",
"month")),k.datepickerOptions){var H=g.$parent.$eval(k.datepickerOptions);H.initDate&&(g.initDate=H.initDate,A.attr("init-date","initDate"),delete H.initDate);angular.forEach(H,function(a,c){A.attr(p(c),a)})}g.watchData={};angular.forEach(["minDate","maxDate","datepickerMode","initDate","shortcutPropagation"],function(a){if(k[a]){var c=b(k[a]);if(g.$parent.$watch(c,function(c){g.watchData[a]=c}),A.attr(p(a),"watchData."+a),"datepickerMode"===a){var d=c.assign;g.$watch("watchData."+a,function(a,c){a!==
c&&d(g.$parent,a)})}}});k.dateDisabled&&A.attr("date-disabled","dateDisabled({ date: date, mode: mode })");k.showWeeks&&A.attr("show-weeks",k.showWeeks);k.customClass&&A.attr("custom-class","customClass({ date: date, mode: mode })");w?l.$formatters.push(function(a){return g.date=a,a}):(l.$$parserName="date",l.$validators.date=n,l.$parsers.unshift(r),l.$formatters.push(function(a){return g.date=a,l.$isEmpty(a)?a:d(a,q)}));g.dateSelection=function(a){angular.isDefined(a)&&(g.date=a);a=g.date?d(g.date,
q):"";h.val(a);l.$setViewValue(a);x&&(g.isOpen=!1,h[0].focus())};l.$viewChangeListeners.push(function(){g.date=c.parse(l.$viewValue,q,g.date)||new Date(l.$viewValue)});var J=function(a){g.isOpen&&a.target!==h[0]&&g.$apply(function(){g.isOpen=!1})},y=function(a){g.keydown(a)};h.bind("keydown",y);g.keydown=function(a){27===a.which?(a.preventDefault(),g.isOpen&&a.stopPropagation(),g.close()):40!==a.which||g.isOpen||(g.isOpen=!0)};g.$watch("isOpen",function(a){a?(g.$broadcast("datepicker.focus"),g.position=
u?e.offset(h):e.position(h),g.position.top+=h.prop("offsetHeight"),f.bind("click",J)):f.unbind("click",J)});g.select=function(a){if("today"===a){var c=new Date;angular.isDate(g.date)?(a=new Date(g.date),a.setFullYear(c.getFullYear(),c.getMonth(),c.getDate())):a=new Date(c.setHours(0,0,0,0))}g.dateSelection(a)};g.close=function(){g.isOpen=!1;h[0].focus()};var t=a(z)(g);z.remove();u?f.find("body").append(t):h.after(t);g.$on("$destroy",function(){t.remove();h.unbind("keydown",y);f.unbind("click",J)})}}}]).directive("datepickerPopupWrap",
function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault();a.stopPropagation()})}}});
angular.module("ui.bootstrap.dropdown",["ui.bootstrap.position"]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document","$rootScope",function(a,b){var f=null;this.open=function(c){f||(a.bind("click",e),a.bind("keydown",d));f&&f!==c&&(f.isOpen=!1);f=c};this.close=function(c){f===c&&(f=null,a.unbind("click",e),a.unbind("keydown",d))};var e=function(a){if(f&&(!a||"disabled"!==f.getAutoClose())){var d=f.getToggleElement();a&&d&&d[0].contains(a.target)||(d=f.getElement(),
a&&"outsideClick"===f.getAutoClose()&&d&&d[0].contains(a.target)||(f.isOpen=!1,b.$$phase||f.$apply()))}},d=function(a){27===a.which&&(f.focusToggleElement(),e())}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate","$position","$document",function(a,b,f,e,d,c,m,g){var h,k=this,l=a.$new(),p=e.openClass,r=angular.noop,n=b.onToggle?f(b.onToggle):angular.noop,q=!1;this.init=function(c){k.$element=c;b.isOpen&&(h=f(b.isOpen),r=h.assign,a.$watch(h,
function(a){l.isOpen=!!a}));(q=angular.isDefined(b.dropdownAppendToBody))&&k.dropdownMenu&&(g.find("body").append(k.dropdownMenu),c.on("$destroy",function(){k.dropdownMenu.remove()}))};this.toggle=function(a){return l.isOpen=arguments.length?!!a:!l.isOpen};this.isOpen=function(){return l.isOpen};l.getToggleElement=function(){return k.toggleElement};l.getAutoClose=function(){return b.autoClose||"always"};l.getElement=function(){return k.$element};l.focusToggleElement=function(){k.toggleElement&&k.toggleElement[0].focus()};
l.$watch("isOpen",function(b,f){if(q&&k.dropdownMenu){var e=m.positionElements(k.$element,k.dropdownMenu,"bottom-left",!0);k.dropdownMenu.css({top:e.top+"px",left:e.left+"px",display:b?"block":"none"})}c[b?"addClass":"removeClass"](k.$element,p);b?(l.focusToggleElement(),d.open(l)):d.close(l);r(a,b);angular.isDefined(b)&&b!==f&&n(a,{open:!!b})});a.$on("$locationChangeSuccess",function(){l.isOpen=!1});a.$on("$destroy",function(){l.$destroy()})}]).directive("dropdown",function(){return{controller:"DropdownController",
link:function(a,b,f,e){e.init(b)}}}).directive("dropdownMenu",function(){return{restrict:"AC",require:"?^dropdown",link:function(a,b,f,e){e&&(e.dropdownMenu=b)}}}).directive("dropdownToggle",function(){return{require:"?^dropdown",link:function(a,b,f,e){if(e){e.toggleElement=b;var d=function(c){c.preventDefault();b.hasClass("disabled")||f.disabled||a.$apply(function(){e.toggle()})};b.bind("click",d);b.attr({"aria-haspopup":!0,"aria-expanded":!1});a.$watch(e.isOpen,function(a){b.attr("aria-expanded",
!!a)});a.$on("$destroy",function(){b.unbind("click",d)})}}}});
angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,f){a.push({key:b,value:f})},get:function(b){for(var f=0;f<a.length;f++)if(b==a[f].key)return a[f]},keys:function(){for(var b=[],f=0;f<a.length;f++)b.push(a[f].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var f=-1,e=0;e<a.length;e++)if(b==a[e].key){f=e;break}return a.splice(f,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},
length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){function b(b){b.animate=!1;a(function(){b.animate=!0})}return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",compile:function(a,e){return a.addClass(e.backdropClass),b}}}]).directive("modalWindow",["$modalStack","$q",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(a,b){return b.templateUrl||"template/modal/window.html"},link:function(f,
e,d){e.addClass(d.windowClass||"");f.size=d.size;f.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))};f.$isRendered=!0;var c=b.defer();d.$observe("modalRender",function(a){"true"==a&&c.resolve()});c.promise.then(function(){f.animate=!0;var b=e[0].querySelectorAll("[autofocus]");b.length?b[0].focus():e[0].focus();(b=a.getTop())&&a.modalRendered(b.key)})}}}]).directive("modalAnimationClass",
[function(){return{compile:function(a,b){b.modalAnimation&&a.addClass(b.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function(a,b,f,e,d){d(a.$parent,function(a){b.empty();b.append(a)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,f,e,d,c){function m(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function g(a){var b=f.find("body").eq(0),c=n.get(a).value;n.remove(a);
k(c.modalDomEl,c.modalScope,function(){b.toggleClass(r,0<n.length());h()})}function h(){l&&-1==m()&&(k(l,p,function(){}),p=l=void 0)}function k(c,f,e){function g(){g.done||(g.done=!0,c.remove(),f.$destroy(),e&&e())}f.animate=!1;c.attr("modal-animation")&&a.enabled()?c.one("$animate:close",function(){d.$evalAsync(g)}):b(g)}var l,p,r="modal-open",n=c.createNew(),q={};return d.$watch(m,function(a){p&&(p.index=a)}),f.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&(a.preventDefault(),
d.$apply(function(){q.dismiss(b.key,"escape key press")})))}),q.open=function(a,b){var c=f[0].activeElement;n.add(a,{deferred:b.deferred,renderDeferred:b.renderDeferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var g=f.find("body").eq(0),h=m();0<=h&&!l&&(p=d.$new(!0),p.index=h,h=angular.element('<div modal-backdrop="modal-backdrop"></div>'),h.attr("backdrop-class",b.backdropClass),b.animation&&h.attr("modal-animation","true"),l=e(h)(p),g.append(l));h=angular.element('<div modal-window="modal-window"></div>');
h.attr({"template-url":b.windowTemplateUrl,"window-class":b.windowClass,size:b.size,index:n.length()-1,animate:"animate"}).html(b.content);b.animation&&h.attr("modal-animation","true");h=e(h)(b.scope);n.top().value.modalDomEl=h;n.top().value.modalOpener=c;g.append(h);g.addClass(r)},q.close=function(a,b){var c=n.get(a);return c&&!c.value.modalScope.$broadcast("modal.closing",b,!0).defaultPrevented?(c.value.deferred.resolve(b),g(a),c.value.modalOpener.focus(),!0):!c},q.dismiss=function(a,b){var c=n.get(a);
return c&&!c.value.modalScope.$broadcast("modal.closing",b,!1).defaultPrevented?(c.value.deferred.reject(b),g(a),c.value.modalOpener.focus(),!0):!c},q.dismissAll=function(a){for(var b=this.getTop();b&&this.dismiss(b.key,a);)b=this.getTop()},q.getTop=function(){return n.top()},q.modalRendered=function(a){(a=n.get(a))&&a.value.renderDeferred.resolve()},q}]).provider("$modal",function(){var a={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller",
"$modalStack",function(b,f,e,d,c,m){function g(a){return a.template?e.when(a.template):d(angular.isFunction(a.templateUrl)?a.templateUrl():a.templateUrl)}function h(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(e.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var d=e.defer(),k=e.defer(),n=e.defer(),q={result:d.promise,opened:k.promise,rendered:n.promise,close:function(a){return m.close(q,a)},dismiss:function(a){return m.dismiss(q,a)}};
if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw Error("One of template or templateUrl options is required.");var x=e.all([g(b)].concat(h(b.resolve)));return x.then(function(a){var e=(b.scope||f).$new();e.$close=q.close;e.$dismiss=q.dismiss;var h,g={},k=1;b.controller&&(g.$scope=e,g.$modalInstance=q,angular.forEach(b.resolve,function(b,c){g[c]=a[k++]}),h=c(b.controller,g),b.controllerAs&&(e[b.controllerAs]=h));m.open(q,{scope:e,deferred:d,renderDeferred:n,
content:a[0],animation:b.animation,backdrop:b.backdrop,keyboard:b.keyboard,backdropClass:b.backdropClass,windowClass:b.windowClass,windowTemplateUrl:b.windowTemplateUrl,size:b.size})},function(a){d.reject(a)}),x.then(function(){k.resolve(!0)},function(a){k.reject(a)}),q},k}]};return a});
angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse",function(a,b,f){var e=this,d={$setViewValue:angular.noop},c=b.numPages?f(b.numPages).assign:angular.noop;this.init=function(m,g){d=m;this.config=g;d.$render=function(){e.render()};b.itemsPerPage?a.$parent.$watch(f(b.itemsPerPage),function(b){e.itemsPerPage=parseInt(b,10);a.totalPages=e.calculateTotalPages()}):this.itemsPerPage=g.itemsPerPage;a.$watch("totalItems",function(){a.totalPages=e.calculateTotalPages()});
a.$watch("totalPages",function(b){c(a.$parent,b);a.page>b?a.selectPage(b):d.$render()})};this.calculateTotalPages=function(){var b=1>this.itemsPerPage?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)};this.render=function(){a.page=parseInt(d.$viewValue,10)||1};a.selectPage=function(b,c){a.page!==b&&0<b&&b<=a.totalPages&&(c&&c.target&&c.target.blur(),d.$setViewValue(b),d.$render())};a.getText=function(b){return a[b+"Text"]||e.config[b+"Text"]};a.noPrevious=function(){return 1===
a.page};a.noNext=function(){return a.page===a.totalPages}}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@"},require:["pagination","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pagination.html",
replace:!0,link:function(f,e,d,c){var m=c[0];if(e=c[1]){var g=angular.isDefined(d.maxSize)?f.$parent.$eval(d.maxSize):b.maxSize,h=angular.isDefined(d.rotate)?f.$parent.$eval(d.rotate):b.rotate;f.boundaryLinks=angular.isDefined(d.boundaryLinks)?f.$parent.$eval(d.boundaryLinks):b.boundaryLinks;f.directionLinks=angular.isDefined(d.directionLinks)?f.$parent.$eval(d.directionLinks):b.directionLinks;m.init(e,b);d.maxSize&&f.$parent.$watch(a(d.maxSize),function(a){g=parseInt(a,10);m.render()});var k=m.render;
m.render=function(){k();if(0<f.page&&f.page<=f.totalPages){var a=f.page,b=f.totalPages,c=[],d=1,e=b,m=angular.isDefined(g)&&b>g;m&&(h?(d=Math.max(a-Math.floor(g/2),1),e=d+g-1,e>b&&(e=b,d=e-g+1)):(d=(Math.ceil(a/g)-1)*g+1,e=Math.min(d+g-1,b)));for(var u=d;e>=u;u++)c.push({number:u,text:u,active:u===a});m&&!h&&(1<d&&c.unshift({number:d-1,text:"...",active:!1}),b>e&&c.push({number:e+1,text:"...",active:!1}));f.pages=c}}}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"\u00ab Previous",nextText:"Next \u00bb",
align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{totalItems:"=",previousText:"@",nextText:"@"},require:["pager","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,f,e,d){f=d[0];(d=d[1])&&(b.align=angular.isDefined(e.align)?b.$parent.$eval(e.align):a.align,f.init(d,a))}}}]);
angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){return a.replace(/[A-Z]/g,function(a,b){return(b?"-":"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0,useContentExp:!1},f={mouseenter:"mouseleave",click:"click",focus:"blur"},e={};this.options=function(a){angular.extend(e,a)};this.setTriggers=function(a){angular.extend(f,a)};this.$get=["$window","$compile","$timeout","$document","$position","$interpolate",
function(d,c,m,g,h,k){return function(d,p,r,n){function q(a){a=a||n.trigger||r;return{show:a,hide:f[a]||a}}n=angular.extend({},b,e,n);var x=a(d),u=k.startSymbol(),w=k.endSymbol(),z="<div "+x+'-popup title="'+u+"title"+w+'" '+(n.useContentExp?'content-exp="contentExp()" ':'content="'+u+"content"+w+'" ')+'placement="'+u+"placement"+w+'" popup-class="'+u+"popupClass"+w+'" animation="animation" is-open="isOpen"origin-scope="origScope" ></div>';return{restrict:"EA",compile:function(){var a=c(z);return function(b,
c,e){function f(){v.isOpen?z():k()}function k(){if(!T||b.$eval(e[p+"Enable"]))v.popupClass=e[p+"Class"],O(),K(),v.popupDelay?E||(E=m(r,v.popupDelay,!1),E.then(function(a){a()})):r()()}function z(){b.$apply(function(){u()})}function r(){return E=null,F&&(m.cancel(F),F=null),(n.useContentExp?v.contentExp():v.content)?(x(),B.css({top:0,left:0,display:"block"}),v.$digest(),Q(),v.isOpen=!0,v.$apply(),Q):angular.noop}function u(){v.isOpen=!1;m.cancel(E);E=null;v.animation?F||(F=m(w,500)):w()}function x(){B&&
w();G=v.$new();B=a(G,function(a){P?g.find("body").append(a):c.after(a)});G.$watch(function(){m(Q,0,!1)});n.useContentExp&&G.$watch("contentExp()",function(a){!a&&v.isOpen&&u()})}function w(){F=null;B&&(B.remove(),B=null);G&&(G.$destroy(),G=null)}function O(){var a=e[p+"Placement"];v.placement=angular.isDefined(a)?a:n.placement}function K(){var a=parseInt(e[p+"PopupDelay"],10);v.popupDelay=isNaN(a)?n.popupDelay:a}var B,G,F,E,P=angular.isDefined(n.appendToBody)?n.appendToBody:!1,C=q(void 0),T=angular.isDefined(e[p+
"Enable"]),v=b.$new(!0),Q=function(){if(B){var a=h.positionElements(c,B,v.placement,P);a.top+="px";a.left+="px";B.css(a)}};v.origScope=b;v.isOpen=!1;v.contentExp=function(){return b.$eval(e[d])};n.useContentExp||e.$observe(d,function(a){v.content=a;!a&&v.isOpen&&u()});e.$observe("disabled",function(a){a&&v.isOpen&&u()});e.$observe(p+"Title",function(a){v.title=a});var S=function(){c.unbind(C.show,k);c.unbind(C.hide,z)};(function(){var a=e[p+"Trigger"];S();C=q(a);C.show===C.hide?c.bind(C.show,f):(c.bind(C.show,
k),c.bind(C.hide,z))})();var L=b.$eval(e[p+"Animation"]);v.animation=angular.isDefined(L)?!!L:n.animation;L=b.$eval(e[p+"AppendToBody"]);(P=angular.isDefined(L)?L:P)&&b.$on("$locationChangeSuccess",function(){v.isOpen&&u()});b.$on("$destroy",function(){m.cancel(F);m.cancel(E);S();w();v=null})}}}}}]}).directive("tooltipTemplateTransclude",["$animate","$sce","$compile","$templateRequest",function(a,b,f,e){return{link:function(d,c,m){var g,h,k,l=d.$eval(m.tooltipTemplateTranscludeScope),p=0,r=function(){h&&
(h.remove(),h=null);g&&(g.$destroy(),g=null);k&&(a.leave(k).then(function(){h=null}),h=k,k=null)};d.$watch(b.parseAsResourceUrl(m.tooltipTemplateTransclude),function(b){var h=++p;b?(e(b,!0).then(function(d){if(h===p){var e=l.$new();d=f(d)(e,function(b){r();a.enter(b,c)});g=e;k=d;g.$emit("$includeContentLoaded",b)}},function(){h===p&&(r(),d.$emit("$includeContentError",b))}),d.$emit("$includeContentRequested",b)):r()});d.$on("$destroy",r)}}}]).directive("tooltipClasses",function(){return{restrict:"A",
link:function(a,b,f){a.placement&&b.addClass(a.placement);a.popupClass&&b.addClass(a.popupClass);a.animation()&&b.addClass(f.tooltipAnimationClass)}}}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipTemplatePopup",function(){return{restrict:"EA",
replace:!0,scope:{contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&",originScope:"&"},templateUrl:"template/tooltip/tooltip-template-popup.html"}}).directive("tooltipTemplate",["$tooltip",function(a){return a("tooltipTemplate","tooltip","mouseenter",{useContentExp:!0})}]).directive("tooltipHtmlPopup",function(){return{restrict:"EA",replace:!0,scope:{contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-popup.html"}}).directive("tooltipHtml",
["$tooltip",function(a){return a("tooltipHtml","tooltip","mouseenter",{useContentExp:!0})}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).value("tooltipHtmlUnsafeSuppressDeprecated",!1).directive("tooltipHtmlUnsafe",["$tooltip","tooltipHtmlUnsafeSuppressDeprecated","$log",function(a,b,f){return b||f.warn("tooltip-html-unsafe is now deprecated. Use tooltip-html or tooltip-template instead."),
a("tooltipHtmlUnsafe","tooltip","mouseenter")}]);
angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverTemplatePopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&",originScope:"&"},templateUrl:"template/popover/popover-template.html"}}).directive("popoverTemplate",["$tooltip",function(a){return a("popoverTemplate","popover","click",{useContentExp:!0})}]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",
content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]);
angular.module("ui.bootstrap.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig",function(a,b,f){var e=this,d=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):f.animate;this.bars=[];a.max=angular.isDefined(a.max)?a.max:f.max;this.addBar=function(b,f){d||f.css({transition:"none"});this.bars.push(b);b.$watch("value",function(d){b.percent=+(100*d/a.max).toFixed(2)});b.$on("$destroy",function(){f=null;e.removeBar(b)})};
this.removeBar=function(a){this.bars.splice(this.bars.indexOf(a),1)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},templateUrl:"template/progressbar/progress.html"}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",max:"=?",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,f,e){e.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",
replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",max:"=?",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,f,e){e.addBar(a,angular.element(b.children()[0]))}}});
angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(a,b,f){var e={$setViewValue:angular.noop};this.init=function(d){e=d;e.$render=this.render;e.$formatters.push(function(a){return angular.isNumber(a)&&a<<0!==a&&(a=Math.round(a)),a});this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):f.stateOn;this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):
f.stateOff;d=angular.isDefined(b.ratingStates)?a.$parent.$eval(b.ratingStates):Array(angular.isDefined(b.max)?a.$parent.$eval(b.max):f.max);a.range=this.buildTemplateObjects(d)};this.buildTemplateObjects=function(a){for(var b=0,e=a.length;e>b;b++)a[b]=angular.extend({index:b},{stateOn:this.stateOn,stateOff:this.stateOff},a[b]);return a};a.rate=function(b){!a.readonly&&0<=b&&b<=a.range.length&&(e.$setViewValue(b),e.$render())};a.enter=function(b){a.readonly||(a.value=b);a.onHover({value:b})};a.reset=
function(){a.value=e.$viewValue;a.onLeave()};a.onKeydown=function(b){/(37|38|39|40)/.test(b.which)&&(b.preventDefault(),b.stopPropagation(),a.rate(a.value+(38===b.which||39===b.which?1:-1)))};this.render=function(){a.value=e.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(a,b,f,e){e[0].init(e[1])}}});
angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,f=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(f,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())});a.active=!0;a.onSelect()};b.addTab=function(a){f.push(a);1===f.length&&!1!==a.active?a.active=!0:a.active?b.select(a):a.active=!1};b.removeTab=function(a){var c=f.indexOf(a);a.active&&1<f.length&&!e&&b.select(f[c==f.length-1?c-1:c+1]);f.splice(c,1)};var e;a.$on("$destroy",function(){e=
!0})}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,f){a.vertical=angular.isDefined(f.vertical)?a.$parent.$eval(f.vertical):!1;a.justified=angular.isDefined(f.justified)?a.$parent.$eval(f.justified):!1}}}).directive("tab",["$parse","$log",function(a,b){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",
heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(f,e,d){return function(c,e,f,h){c.$watch("active",function(a){a&&h.select(c)});c.disabled=!1;f.disable&&c.$parent.$watch(a(f.disable),function(a){c.disabled=!!a});f.disabled&&(b.warn('Use of "disabled" attribute has been deprecated, please use "disable"'),c.$parent.$watch(a(f.disabled),function(a){c.disabled=!!a}));c.select=function(){c.disabled||(c.active=!0)};h.addTab(c);c.$on("$destroy",function(){h.removeTab(c)});
c.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){return{restrict:"A",require:"^tabset",link:function(a,b,f){var e=a.$eval(f.tabContentTransclude);e.$transcludeFn(e.$parent,function(a){angular.forEach(a,function(a){a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||
"data-tab-heading"===a.tagName.toLowerCase())?e.headingElement=a:b.append(a)})})}}});
angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0,arrowkeys:!0}).controller("TimepickerController",["$scope","$attrs","$parse","$log","$locale","timepickerConfig",function(a,b,f,e,d,c){function m(){var b=parseInt(a.hours,10);return(a.showMeridian?0<b&&13>b:0<=b&&24>b)?(a.showMeridian&&(12===b&&(b=0),a.meridian===x[1]&&(b+=12)),b):void 0}function g(){var b=parseInt(a.minutes,10);return 0<=
b&&60>b?b:void 0}function h(a){return angular.isDefined(a)&&2>a.toString().length?"0"+a:a.toString()}function k(a){l();q.$setViewValue(new Date(n));p(a)}function l(){q.$setValidity("time",!0);a.invalidHours=!1;a.invalidMinutes=!1}function p(b){var c=n.getHours(),d=n.getMinutes();a.showMeridian&&(c=0===c||12===c?12:c%12);a.hours="h"===b?c:h(c);"m"!==b&&(a.minutes=h(d));a.meridian=12>n.getHours()?x[0]:x[1]}function r(a){a=new Date(n.getTime()+6E4*a);n.setHours(a.getHours(),a.getMinutes());k()}var n=
new Date,q={$setViewValue:angular.noop},x=angular.isDefined(b.meridians)?a.$parent.$eval(b.meridians):c.meridians||d.DATETIME_FORMATS.AMPMS;this.init=function(d,e){q=d;q.$render=this.render;q.$formatters.unshift(function(a){return a?new Date(a):null});var f=e.eq(0),h=e.eq(1);(angular.isDefined(b.mousewheel)?a.$parent.$eval(b.mousewheel):c.mousewheel)&&this.setupMousewheelEvents(f,h);(angular.isDefined(b.arrowkeys)?a.$parent.$eval(b.arrowkeys):c.arrowkeys)&&this.setupArrowkeyEvents(f,h);a.readonlyInput=
angular.isDefined(b.readonlyInput)?a.$parent.$eval(b.readonlyInput):c.readonlyInput;this.setupInputEvents(f,h)};var u=c.hourStep;b.hourStep&&a.$parent.$watch(f(b.hourStep),function(a){u=parseInt(a,10)});var w=c.minuteStep;b.minuteStep&&a.$parent.$watch(f(b.minuteStep),function(a){w=parseInt(a,10)});a.showMeridian=c.showMeridian;b.showMeridian&&a.$parent.$watch(f(b.showMeridian),function(b){if(a.showMeridian=!!b,q.$error.time){b=m();var c=g();angular.isDefined(b)&&angular.isDefined(c)&&(n.setHours(b),
k())}else p()});this.setupMousewheelEvents=function(b,c){var d=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||0<b};b.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementHours():a.decrementHours());b.preventDefault()});c.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementMinutes():a.decrementMinutes());b.preventDefault()})};this.setupArrowkeyEvents=function(b,c){b.bind("keydown",function(b){38===b.which?(b.preventDefault(),
a.incrementHours(),a.$apply()):40===b.which&&(b.preventDefault(),a.decrementHours(),a.$apply())});c.bind("keydown",function(b){38===b.which?(b.preventDefault(),a.incrementMinutes(),a.$apply()):40===b.which&&(b.preventDefault(),a.decrementMinutes(),a.$apply())})};this.setupInputEvents=function(b,c){if(a.readonlyInput)return a.updateHours=angular.noop,void(a.updateMinutes=angular.noop);var d=function(b,c){q.$setViewValue(null);q.$setValidity("time",!1);angular.isDefined(b)&&(a.invalidHours=b);angular.isDefined(c)&&
(a.invalidMinutes=c)};a.updateHours=function(){var a=m();angular.isDefined(a)?(n.setHours(a),k("h")):d(!0)};b.bind("blur",function(){!a.invalidHours&&10>a.hours&&a.$apply(function(){a.hours=h(a.hours)})});a.updateMinutes=function(){var a=g();angular.isDefined(a)?(n.setMinutes(a),k("m")):d(void 0,!0)};c.bind("blur",function(){!a.invalidMinutes&&10>a.minutes&&a.$apply(function(){a.minutes=h(a.minutes)})})};this.render=function(){var a=q.$viewValue;isNaN(a)?(q.$setValidity("time",!1),e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):
(a&&(n=a),l(),p())};a.incrementHours=function(){r(60*u)};a.decrementHours=function(){r(60*-u)};a.incrementMinutes=function(){r(w)};a.decrementMinutes=function(){r(-w)};a.toggleMeridian=function(){r(720*(12>n.getHours()?1:-1))}}]).directive("timepicker",function(){return{restrict:"EA",require:["timepicker","?^ngModel"],controller:"TimepickerController",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(a,b,f,e){a=e[0];(e=e[1])&&a.init(e,b.find("input"))}}});
angular.module("ui.bootstrap.transition",[]).value("$transitionSuppressDeprecated",!1).factory("$transition",["$q","$timeout","$rootScope","$log","$transitionSuppressDeprecated",function(a,b,f,e,d){function c(a){for(var b in a)if(void 0!==g.style[b])return a[b]}d||e.warn("$transition is now deprecated. Use $animate from ngAnimate instead.");var m=function(c,d,e){e=e||{};var g=a.defer(),r=m[e.animation?"animationEndEventName":"transitionEndEventName"],n=function(){f.$apply(function(){c.unbind(r,n);
g.resolve(c)})};return r&&c.bind(r,n),b(function(){angular.isString(d)?c.addClass(d):angular.isFunction(d)?d(c):angular.isObject(d)&&c.css(d);r||g.resolve(c)}),g.promise.cancel=function(){r&&c.unbind(r,n);g.reject("Transition cancelled")},g.promise},g=document.createElement("trans");return m.transitionEndEventName=c({WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}),m.animationEndEventName=c({WebkitTransition:"webkitAnimationEnd",
MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"}),m}]);
angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return{parse:function(f){var e=f.match(b);if(!e)throw Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "'+f+'".');return{itemName:e[3],source:a(e[4]),viewMapper:a(e[2]||e[1]),modelMapper:a(e[1])}}}}]).directive("typeahead",
["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,f,e,d,c,m){var g=[9,13,27,38,40];return{require:"ngModel",link:function(h,k,l,p){var r,n=h.$eval(l.typeaheadMinLength)||1,q=h.$eval(l.typeaheadWaitMs)||0,x=!1!==h.$eval(l.typeaheadEditable),u=b(l.typeaheadLoading).assign||angular.noop,w=b(l.typeaheadOnSelect),z=l.typeaheadInputFormatter?b(l.typeaheadInputFormatter):void 0,A=l.typeaheadAppendToBody?h.$eval(l.typeaheadAppendToBody):!1,H=!1!==h.$eval(l.typeaheadFocusFirst),
J=b(l.ngModel).assign,y=m.parse(l.typeahead),t=h.$new();h.$on("$destroy",function(){t.$destroy()});var M="typeahead-"+t.$id+"-"+Math.floor(1E4*Math.random());k.attr({"aria-autocomplete":"list","aria-expanded":!1,"aria-owns":M});var N=angular.element("<div typeahead-popup></div>");N.attr({id:M,matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"});angular.isDefined(l.typeaheadTemplateUrl)&&N.attr("template-url",l.typeaheadTemplateUrl);var D=function(){t.matches=
[];t.activeIdx=-1;k.attr("aria-expanded",!1)};t.$watch("activeIdx",function(a){0>a?k.removeAttr("aria-activedescendant"):k.attr("aria-activedescendant",M+"-option-"+a)});var R=function(a){var b={$viewValue:a};u(h,!0);f.when(y.source(h,b)).then(function(d){var e=a===p.$viewValue;if(e&&r)if(d&&0<d.length){t.activeIdx=H?0:-1;for(var f=t.matches.length=0;f<d.length;f++)b[y.itemName]=d[f],t.matches.push({id:M+"-option-"+f,label:y.viewMapper(t,b),model:d[f]});t.query=a;t.position=A?c.offset(k):c.position(k);
t.position.top+=k.prop("offsetHeight");k.attr("aria-expanded",!0)}else D();e&&u(h,!1)},function(){D();u(h,!1)})};D();t.query=void 0;var I,U=function(a){I=e(function(){R(a)},q)};p.$parsers.unshift(function(a){r=!0;a&&a.length>=n?0<q?(I&&e.cancel(I),U(a)):R(a):(u(h,!1),I&&e.cancel(I),D());return x?a:a?void p.$setValidity("editable",!1):(p.$setValidity("editable",!0),a)});p.$formatters.push(function(a){var b,c,d={};return x||p.$setValidity("editable",!0),z?(d.$model=a,z(h,d)):(d[y.itemName]=a,b=y.viewMapper(h,
d),d[y.itemName]=void 0,c=y.viewMapper(h,d),b!==c?b:a)});t.select=function(a){var b,c={};c[y.itemName]=b=t.matches[a].model;a=y.modelMapper(h,c);J(h,a);p.$setValidity("editable",!0);p.$setValidity("parse",!0);w(h,{$item:b,$model:a,$label:y.viewMapper(h,c)});D();e(function(){k[0].focus()},0,!1)};k.bind("keydown",function(a){0!==t.matches.length&&-1!==g.indexOf(a.which)&&(-1!=t.activeIdx||13!==a.which&&9!==a.which)&&(a.preventDefault(),40===a.which?(t.activeIdx=(t.activeIdx+1)%t.matches.length,t.$digest()):
38===a.which?(t.activeIdx=(0<t.activeIdx?t.activeIdx:t.matches.length)-1,t.$digest()):13===a.which||9===a.which?t.$apply(function(){t.select(t.activeIdx)}):27===a.which&&(a.stopPropagation(),D(),t.$digest()))});k.bind("blur",function(){r=!1});var O=function(a){k[0]!==a.target&&(D(),t.$digest())};d.bind("click",O);h.$on("$destroy",function(){d.unbind("click",O);A&&K.remove();N.remove()});var K=a(N)(t);A?d.find("body").append(K):k.after(K)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",
scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,f){a.templateUrl=f.templateUrl;a.isOpen=function(){return 0<a.matches.length};a.isActive=function(b){return a.active==b};a.selectActive=function(b){a.active=b};a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$templateRequest","$compile","$parse",function(a,b,f){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},
link:function(e,d,c){c=f(c.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a(c).then(function(a){b(a.trim())(e,function(a){d.replaceWith(a)})})}}}]).filter("typeaheadHighlight",function(){return function(a,b){return b?(""+a).replace(new RegExp(b.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"gi"),"<strong>$&</strong>"):a}});!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');
angular.module("ui.bootstrap","ui.bootstrap.tpls ui.bootstrap.collapse ui.bootstrap.accordion ui.bootstrap.alert ui.bootstrap.bindHtml ui.bootstrap.buttons ui.bootstrap.carousel ui.bootstrap.dateparser ui.bootstrap.position ui.bootstrap.datepicker ui.bootstrap.dropdown ui.bootstrap.modal ui.bootstrap.pagination ui.bootstrap.tooltip ui.bootstrap.popover ui.bootstrap.progressbar ui.bootstrap.rating ui.bootstrap.tabs ui.bootstrap.timepicker ui.bootstrap.transition ui.bootstrap.typeahead".split(" "));
angular.module("ui.bootstrap.tpls","template/accordion/accordion-group.html template/accordion/accordion.html template/alert/alert.html template/carousel/carousel.html template/carousel/slide.html template/datepicker/datepicker.html template/datepicker/day.html template/datepicker/month.html template/datepicker/popup.html template/datepicker/year.html template/modal/backdrop.html template/modal/window.html template/pagination/pager.html template/pagination/pagination.html template/tooltip/tooltip-html-popup.html template/tooltip/tooltip-html-unsafe-popup.html template/tooltip/tooltip-popup.html template/tooltip/tooltip-template-popup.html template/popover/popover-template.html template/popover/popover.html template/progressbar/bar.html template/progressbar/progress.html template/progressbar/progressbar.html template/rating/rating.html template/tabs/tab.html template/tabs/tabset.html template/timepicker/timepicker.html template/typeahead/typeahead-match.html template/typeahead/typeahead-popup.html".split(" "));
angular.module("ui.bootstrap.collapse",[]).directive("collapse",["$animate",function(a){return{link:function(b,f,e){function d(){f.removeClass("collapsing");f.css({height:"auto"})}function c(){f.css({height:"0"});f.removeClass("collapsing");f.addClass("collapse")}b.$watch(e.collapse,function(b){b?(f.css({height:f[0].scrollHeight+"px"}).removeClass("collapse").addClass("collapsing"),a.removeClass(f,"in",{to:{height:"0"}}).then(c)):(f.removeClass("collapse").addClass("collapsing"),a.addClass(f,"in",
{to:{height:f[0].scrollHeight+"px"}}).then(d))})}}}]);
angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,f){this.groups=[];this.closeOthers=function(e){(angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):f.closeOthers)&&angular.forEach(this.groups,function(a){a!==e&&(a.isOpen=!1)})};this.addGroup=function(a){var b=this;this.groups.push(a);a.$on("$destroy",function(){b.removeGroup(a)})};this.removeGroup=
function(a){a=this.groups.indexOf(a);-1!==a&&this.groups.splice(a,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(a){this.heading=
a}},link:function(a,b,f,e){e.addGroup(a);a.$watch("isOpen",function(b){b&&e.closeOthers(a)});a.toggleOpen=function(){a.isDisabled||(a.isOpen=!a.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(a,b,f,e,d){e.setHeading(d(a,angular.noop))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,f,e){a.$watch(function(){return e[f.accordionTransclude]},function(a){a&&
(b.html(""),b.append(a))})}}});
angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b;this.close=a.close}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"@",close:"&"}}}).directive("dismissOnTimeout",["$timeout",function(a){return{require:"alert",link:function(b,f,e,d){a(function(){d.close()},parseInt(e.dismissOnTimeout,10))}}}]);
angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,f){b.addClass("ng-binding").data("$binding",f.bindHtmlUnsafe);a.$watch(f.bindHtmlUnsafe,function(a){b.html(a||"")})}});
angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active";this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,f,e){var d=e[0],c=e[1];c.$render=function(){b.toggleClass(d.activeClass,angular.equals(c.$modelValue,a.$eval(f.btnRadio)))};b.bind(d.toggleEvent,
function(){var e=b.hasClass(d.activeClass);e&&!angular.isDefined(f.uncheckable)||a.$apply(function(){c.$setViewValue(e?null:a.$eval(f.btnRadio));c.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,f,e){function d(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var c=e[0],m=e[1];m.$render=function(){b.toggleClass(c.activeClass,angular.equals(m.$modelValue,d(f.btnCheckboxTrue,!0)))};b.bind(c.toggleEvent,
function(){a.$apply(function(){m.$setViewValue(b.hasClass(c.activeClass)?d(f.btnCheckboxFalse,!1):d(f.btnCheckboxTrue,!0));m.$render()})})}}});
angular.module("ui.bootstrap.carousel",[]).controller("CarouselController",["$scope","$interval","$animate",function(a,b,f){function e(a){if(angular.isUndefined(l[a].index))return l[a];var b;l.length;for(b=0;b<l.length;++b)if(l[b].index==a)return l[b]}function d(){c();var d=+a.interval;!isNaN(d)&&0<d&&(g=b(m,d))}function c(){g&&(b.cancel(g),g=null)}function m(){var b=+a.interval;h&&!isNaN(b)&&0<b?a.next():a.pause()}var g,h,k=this,l=k.slides=a.slides=[],p=-1;k.currentSlide=null;var r=!1;k.select=a.select=
function(b,c){function e(){r||(angular.extend(b,{direction:c,active:!0}),angular.extend(k.currentSlide||{},{direction:c,active:!1}),f.enabled()&&!a.noTransition&&b.$element&&(a.$currentTransition=!0,b.$element.one("$animate:close",function(){a.$currentTransition=null})),k.currentSlide=b,p=g,d())}var g=k.indexOfSlide(b);void 0===c&&(c=g>k.getCurrentIndex()?"next":"prev");b&&b!==k.currentSlide&&e()};a.$on("$destroy",function(){r=!0});k.getCurrentIndex=function(){return k.currentSlide&&angular.isDefined(k.currentSlide.index)?
+k.currentSlide.index:p};k.indexOfSlide=function(a){return angular.isDefined(a.index)?+a.index:l.indexOf(a)};a.next=function(){var b=(k.getCurrentIndex()+1)%l.length;return a.$currentTransition?void 0:k.select(e(b),"next")};a.prev=function(){var b=0>k.getCurrentIndex()-1?l.length-1:k.getCurrentIndex()-1;return a.$currentTransition?void 0:k.select(e(b),"prev")};a.isActive=function(a){return k.currentSlide===a};a.$watch("interval",d);a.$on("$destroy",c);a.play=function(){h||(h=!0,d())};a.pause=function(){a.noPause||
(h=!1,c())};k.addSlide=function(b,c){b.$element=c;l.push(b);1===l.length||b.active?(k.select(l[l.length-1]),1==l.length&&a.play()):b.active=!1};k.removeSlide=function(a){angular.isDefined(a.index)&&l.sort(function(a,b){return+a.index>+b.index});var b=l.indexOf(a);l.splice(b,1);0<l.length&&a.active?k.select(b>=l.length?l[b-1]:l[b]):p>b&&p--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",
scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"=?",index:"=?"},link:function(a,b,f,e){e.addSlide(a,b);a.$on("$destroy",function(){e.removeSlide(a)});a.$watch("active",function(b){b&&e.select(a)})}}}).animation(".item",["$animate",function(a){return{beforeAddClass:function(b,f,e){if("active"==f&&b.parent()&&!b.parent().scope().noTransition){var d=
!1,c=b.isolateScope().direction,m="next"==c?"left":"right";return b.addClass(c),a.addClass(b,m).then(function(){d||b.removeClass(m+" "+c);e()}),function(){d=!0}}e()},beforeRemoveClass:function(b,f,e){if("active"==f&&b.parent()&&!b.parent().scope().noTransition){var d=!1,c="next"==b.isolateScope().direction?"left":"right";return a.addClass(b,c).then(function(){d||b.removeClass(c);e()}),function(){d=!0}}e()}}}]);
angular.module("ui.bootstrap.dateparser",[]).service("dateParser",["$locale","orderByFilter",function(a,b){function f(a){var e=[],f=a.split("");return angular.forEach(d,function(b,d){var l=a.indexOf(d);if(-1<l){a=a.split("");f[l]="("+b.regex+")";a[l]="$";for(var p=l+1,r=l+d.length;r>p;p++)f[p]="",a[p]="$";a=a.join("");e.push({index:l,apply:b.apply})}}),{regex:new RegExp("^"+f.join("")+"$"),map:b(e,"index")}}var e=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;this.parsers={};var d={yyyy:{regex:"\\d{4}",apply:function(a){this.year=
+a}},yy:{regex:"\\d{2}",apply:function(a){this.year=+a+2E3}},y:{regex:"\\d{1,4}",apply:function(a){this.year=+a}},MMMM:{regex:a.DATETIME_FORMATS.MONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.MONTH.indexOf(b)}},MMM:{regex:a.DATETIME_FORMATS.SHORTMONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)}},MM:{regex:"0[1-9]|1[0-2]",apply:function(a){this.month=a-1}},M:{regex:"[1-9]|1[0-2]",apply:function(a){this.month=a-1}},dd:{regex:"[0-2][0-9]{1}|3[0-1]{1}",
apply:function(a){this.date=+a}},d:{regex:"[1-2]?[0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},EEEE:{regex:a.DATETIME_FORMATS.DAY.join("|")},EEE:{regex:a.DATETIME_FORMATS.SHORTDAY.join("|")},HH:{regex:"(?:0|1)[0-9]|2[0-3]",apply:function(a){this.hours=+a}},H:{regex:"1?[0-9]|2[0-3]",apply:function(a){this.hours=+a}},mm:{regex:"[0-5][0-9]",apply:function(a){this.minutes=+a}},m:{regex:"[0-9]|[1-5][0-9]",apply:function(a){this.minutes=+a}},sss:{regex:"[0-9][0-9][0-9]",apply:function(a){this.milliseconds=
+a}},ss:{regex:"[0-5][0-9]",apply:function(a){this.seconds=+a}},s:{regex:"[0-9]|[1-5][0-9]",apply:function(a){this.seconds=+a}}};this.parse=function(b,d,g){if(!angular.isString(b)||!d)return b;d=a.DATETIME_FORMATS[d]||d;d=d.replace(e,"\\$&");this.parsers[d]||(this.parsers[d]=f(d));var h=this.parsers[d];d=h.map;if((b=b.match(h.regex))&&b.length){var k;g=g?{year:g.getFullYear(),month:g.getMonth(),date:g.getDate(),hours:g.getHours(),minutes:g.getMinutes(),seconds:g.getSeconds(),milliseconds:g.getMilliseconds()}:
{year:1900,month:0,date:1,hours:0,minutes:0,seconds:0,milliseconds:0};for(var h=1,l=b.length;l>h;h++){var p=d[h-1];p.apply&&p.apply.call(g,b[h])}d=g.year;b=g.month;h=g.date;return(1>h?!1:1===b&&28<h?29===h&&(0===d%4&&0!==d%100||0===d%400):3===b||5===b||8===b||10===b?31>h:!0)&&(k=new Date(g.year,g.month,g.date,g.hours,g.minutes,g.seconds,g.milliseconds||0)),k}}}]);
angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function f(a,d){return a.currentStyle?a.currentStyle[d]:b.getComputedStyle?b.getComputedStyle(a)[d]:a.style[d]}return{position:function(b){var d=this.offset(b),c={top:0,left:0},m;m=a[0];for(var g=b[0].offsetParent||m;g&&g!==m&&"static"===(f(g,"position")||"static");)g=g.offsetParent;m=g||m;m!=a[0]&&(c=this.offset(angular.element(m)),c.top+=m.clientTop-m.scrollTop,c.left+=m.clientLeft-m.scrollLeft);
m=b[0].getBoundingClientRect();return{width:m.width||b.prop("offsetWidth"),height:m.height||b.prop("offsetHeight"),top:d.top-c.top,left:d.left-c.left}},offset:function(e){var d=e[0].getBoundingClientRect();return{width:d.width||e.prop("offsetWidth"),height:d.height||e.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,f){var g,h,k,l=c.split("-");c=l[0];l=l[1]||"center";g=f?this.offset(a):
this.position(a);h=b.prop("offsetWidth");k=b.prop("offsetHeight");a={center:function(){return g.left+g.width/2-h/2},left:function(){return g.left},right:function(){return g.left+g.width}};b={center:function(){return g.top+g.height/2-k/2},top:function(){return g.top},bottom:function(){return g.top+g.height}};switch(c){case "right":c={top:b[l](),left:a[c]()};break;case "left":c={top:b[l](),left:g.left-h};break;case "bottom":c={top:b[c](),left:a[l]()};break;default:c={top:g.top-k,left:a[l]()}}return c}}}]);
angular.module("ui.bootstrap.datepicker",["ui.bootstrap.dateparser","ui.bootstrap.position"]).constant("datepickerConfig",{formatDay:"dd",formatMonth:"MMMM",formatYear:"yyyy",formatDayHeader:"EEE",formatDayTitle:"MMMM yyyy",formatMonthTitle:"yyyy",datepickerMode:"day",minMode:"day",maxMode:"year",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null,shortcutPropagation:!1}).controller("DatepickerController",["$scope","$attrs","$parse","$interpolate","$timeout","$log","dateFilter","datepickerConfig",
function(a,b,f,e,d,c,m,g){var h=this,k={$setViewValue:angular.noop};this.modes=["day","month","year"];angular.forEach("formatDay formatMonth formatYear formatDayHeader formatDayTitle formatMonthTitle minMode maxMode showWeeks startingDay yearRange shortcutPropagation".split(" "),function(c,d){h[c]=angular.isDefined(b[c])?8>d?e(b[c])(a.$parent):a.$parent.$eval(b[c]):g[c]});angular.forEach(["minDate","maxDate"],function(c){b[c]?a.$parent.$watch(f(b[c]),function(a){h[c]=a?new Date(a):null;h.refreshView()}):
h[c]=g[c]?new Date(g[c]):null});a.datepickerMode=a.datepickerMode||g.datepickerMode;a.maxMode=h.maxMode;a.uniqueId="datepicker-"+a.$id+"-"+Math.floor(1E4*Math.random());angular.isDefined(b.initDate)?(this.activeDate=a.$parent.$eval(b.initDate)||new Date,a.$parent.$watch(b.initDate,function(a){a&&(k.$isEmpty(k.$modelValue)||k.$invalid)&&(h.activeDate=a,h.refreshView())})):this.activeDate=new Date;a.isActive=function(b){return 0===h.compare(b.date,h.activeDate)?(a.activeDateId=b.uid,!0):!1};this.init=
function(a){k=a;k.$render=function(){h.render()}};this.render=function(){if(k.$viewValue){var a=new Date(k.$viewValue),b=!isNaN(a);b?this.activeDate=a:c.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');k.$setValidity("date",b)}this.refreshView()};this.refreshView=function(){if(this.element){this._refreshView();var a=k.$viewValue?new Date(k.$viewValue):null;k.$setValidity("date-disabled",
!a||this.element&&!this.isDisabled(a))}};this.createDateObject=function(a,b){var c=k.$viewValue?new Date(k.$viewValue):null;return{date:a,label:m(a,b),selected:c&&0===this.compare(a,c),disabled:this.isDisabled(a),current:0===this.compare(a,new Date),customClass:this.customClass(a)}};this.isDisabled=function(c){return this.minDate&&0>this.compare(c,this.minDate)||this.maxDate&&0<this.compare(c,this.maxDate)||b.dateDisabled&&a.dateDisabled({date:c,mode:a.datepickerMode})};this.customClass=function(b){return a.customClass({date:b,
mode:a.datepickerMode})};this.split=function(a,b){for(var c=[];0<a.length;)c.push(a.splice(0,b));return c};a.select=function(b){if(a.datepickerMode===h.minMode){var c=k.$viewValue?new Date(k.$viewValue):new Date(0,0,0,0,0,0,0);c.setFullYear(b.getFullYear(),b.getMonth(),b.getDate());k.$setViewValue(c);k.$render()}else h.activeDate=b,a.datepickerMode=h.modes[h.modes.indexOf(a.datepickerMode)-1]};a.move=function(a){var b=h.activeDate.getFullYear()+a*(h.step.years||0);a=h.activeDate.getMonth()+a*(h.step.months||
0);h.activeDate.setFullYear(b,a,1);h.refreshView()};a.toggleMode=function(b){b=b||1;a.datepickerMode===h.maxMode&&1===b||a.datepickerMode===h.minMode&&-1===b||(a.datepickerMode=h.modes[h.modes.indexOf(a.datepickerMode)+b])};a.keys={13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"};var l=function(){d(function(){h.element[0].focus()},0,!1)};a.$on("datepicker.focus",l);a.keydown=function(b){var c=a.keys[b.which];!c||b.shiftKey||b.altKey||((b.preventDefault(),
h.shortcutPropagation||b.stopPropagation(),"enter"===c||"space"===c)?h.isDisabled(h.activeDate)||(a.select(h.activeDate),l()):!b.ctrlKey||"up"!==c&&"down"!==c?(h.handleKeyDown(c,b),h.refreshView()):(a.toggleMode("up"===c?1:-1),l()))}}]).directive("datepicker",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{datepickerMode:"=?",dateDisabled:"&",customClass:"&",shortcutPropagation:"&?"},require:["datepicker","?^ngModel"],controller:"DatepickerController",
link:function(a,b,f,e){a=e[0];(e=e[1])&&a.init(e)}}}).directive("daypicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/day.html",require:"^datepicker",link:function(b,f,e,d){function c(a,b){return 1!==b||0!==a%4||0===a%100&&0!==a%400?g[b]:29}function m(a){a=new Date(a);a.setDate(a.getDate()+4-(a.getDay()||7));var b=a.getTime();return a.setMonth(0),a.setDate(1),Math.floor(Math.round((b-a)/864E5)/7)+1}b.showWeeks=d.showWeeks;d.step={months:1};d.element=
f;var g=[31,28,31,30,31,30,31,31,30,31,30,31];d._refreshView=function(){var c=d.activeDate.getFullYear(),f=d.activeDate.getMonth(),c=new Date(c,f,1),e=d.startingDay-c.getDay(),e=0<e?7-e:-e,g=new Date(c);0<e&&g.setDate(-e+1);c=Array(42);e=new Date(g);g=0;for(e.setHours(12);42>g;)c[g++]=new Date(e),e.setDate(e.getDate()+1);for(e=0;42>e;e++)c[e]=angular.extend(d.createDateObject(c[e],d.formatDay),{secondary:c[e].getMonth()!==f,uid:b.uniqueId+"-"+e});b.labels=Array(7);for(f=0;7>f;f++)b.labels[f]={abbr:a(c[f].date,
d.formatDayHeader),full:a(c[f].date,"EEEE")};if(b.title=a(d.activeDate,d.formatDayTitle),b.rows=d.split(c,7),b.showWeeks)for(b.weekNumbers=[],f=(11-d.startingDay)%7,c=b.rows.length,e=0;c>e;e++)b.weekNumbers.push(m(b.rows[e][f].date))};d.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())};d.handleKeyDown=function(a){var b=d.activeDate.getDate();"left"===a?--b:"up"===a?b-=7:"right"===a?b+=1:"down"===a?b+=7:"pageup"===a||
"pagedown"===a?(a=d.activeDate.getMonth()+("pageup"===a?-1:1),d.activeDate.setMonth(a,1),b=Math.min(c(d.activeDate.getFullYear(),d.activeDate.getMonth()),b)):"home"===a?b=1:"end"===a&&(b=c(d.activeDate.getFullYear(),d.activeDate.getMonth()));d.activeDate.setDate(b)};d.refreshView()}}}]).directive("monthpicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/month.html",require:"^datepicker",link:function(b,f,e,d){d.step={years:1};d.element=f;d._refreshView=
function(){for(var c=Array(12),e=d.activeDate.getFullYear(),f=0;12>f;f++)c[f]=angular.extend(d.createDateObject(new Date(e,f,1),d.formatMonth),{uid:b.uniqueId+"-"+f});b.title=a(d.activeDate,d.formatMonthTitle);b.rows=d.split(c,3)};d.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())};d.handleKeyDown=function(a){var b=d.activeDate.getMonth();"left"===a?--b:"up"===a?b-=3:"right"===a?b+=1:"down"===a?b+=3:"pageup"===a||"pagedown"===a?(a=d.activeDate.getFullYear()+
("pageup"===a?-1:1),d.activeDate.setFullYear(a)):"home"===a?b=0:"end"===a&&(b=11);d.activeDate.setMonth(b)};d.refreshView()}}}]).directive("yearpicker",["dateFilter",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/year.html",require:"^datepicker",link:function(a,b,f,e){function d(a){return parseInt((a-1)/c,10)*c+1}var c=e.yearRange;e.step={years:c};e.element=b;e._refreshView=function(){for(var b=Array(c),f=0,h=d(e.activeDate.getFullYear());c>f;f++)b[f]=angular.extend(e.createDateObject(new Date(h+
f,0,1),e.formatYear),{uid:a.uniqueId+"-"+f});a.title=[b[0].label,b[c-1].label].join(" - ");a.rows=e.split(b,5)};e.compare=function(a,b){return a.getFullYear()-b.getFullYear()};e.handleKeyDown=function(a){var b=e.activeDate.getFullYear();"left"===a?--b:"up"===a?b-=5:"right"===a?b+=1:"down"===a?b+=5:"pageup"===a||"pagedown"===a?b+=("pageup"===a?-1:1)*e.step.years:"home"===a?b=d(e.activeDate.getFullYear()):"end"===a&&(b=d(e.activeDate.getFullYear())+c-1);e.activeDate.setFullYear(b)};e.refreshView()}}}]).constant("datepickerPopupConfig",
{datepickerPopup:"yyyy-MM-dd",html5Types:{date:"yyyy-MM-dd","datetime-local":"yyyy-MM-ddTHH:mm:ss.sss",month:"yyyy-MM"},currentText:"Today",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","dateParser","datepickerPopupConfig",function(a,b,f,e,d,c,m){return{restrict:"EA",require:"ngModel",scope:{isOpen:"=?",currentText:"@",clearText:"@",closeText:"@",dateDisabled:"&",customClass:"&"},
link:function(g,h,k,l){function p(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function r(a){if(angular.isNumber(a)&&(a=new Date(a)),a){if(angular.isDate(a)&&!isNaN(a))return a;if(angular.isString(a))return a=c.parse(a,q,g.date)||new Date(a),isNaN(a)?void 0:a}else return null}function n(a,b){var d=a||b;return(angular.isNumber(d)&&(d=new Date(d)),d)?angular.isDate(d)&&!isNaN(d)?!0:angular.isString(d)?(d=c.parse(d,q)||new Date(d),!isNaN(d)):!1:!0}var q,x=angular.isDefined(k.closeOnDateSelection)?
g.$parent.$eval(k.closeOnDateSelection):m.closeOnDateSelection,u=angular.isDefined(k.datepickerAppendToBody)?g.$parent.$eval(k.datepickerAppendToBody):m.appendToBody;g.showButtonBar=angular.isDefined(k.showButtonBar)?g.$parent.$eval(k.showButtonBar):m.showButtonBar;g.getText=function(a){return g[a+"Text"]||m[a+"Text"]};var w=!1;if(m.html5Types[k.type]?(q=m.html5Types[k.type],w=!0):(q=k.datepickerPopup||m.datepickerPopup,k.$observe("datepickerPopup",function(a){a=a||m.datepickerPopup;if(a!==q&&(q=
a,l.$modelValue=null,!q))throw Error("datepickerPopup must have a date format specified.");})),!q)throw Error("datepickerPopup must have a date format specified.");if(w&&k.datepickerPopup)throw Error("HTML5 date input types do not support custom formats.");var z=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");z.attr({"ng-model":"date","ng-change":"dateSelection()"});var A=angular.element(z.children()[0]);if(w&&"month"==k.type&&(A.attr("datepicker-mode",'"month"'),A.attr("min-mode",
"month")),k.datepickerOptions){var H=g.$parent.$eval(k.datepickerOptions);H.initDate&&(g.initDate=H.initDate,A.attr("init-date","initDate"),delete H.initDate);angular.forEach(H,function(a,b){A.attr(p(b),a)})}g.watchData={};angular.forEach(["minDate","maxDate","datepickerMode","initDate","shortcutPropagation"],function(a){if(k[a]){var c=b(k[a]);if(g.$parent.$watch(c,function(b){g.watchData[a]=b}),A.attr(p(a),"watchData."+a),"datepickerMode"===a){var d=c.assign;g.$watch("watchData."+a,function(a,b){a!==
b&&d(g.$parent,a)})}}});k.dateDisabled&&A.attr("date-disabled","dateDisabled({ date: date, mode: mode })");k.showWeeks&&A.attr("show-weeks",k.showWeeks);k.customClass&&A.attr("custom-class","customClass({ date: date, mode: mode })");w?l.$formatters.push(function(a){return g.date=a,a}):(l.$$parserName="date",l.$validators.date=n,l.$parsers.unshift(r),l.$formatters.push(function(a){return g.date=a,l.$isEmpty(a)?a:d(a,q)}));g.dateSelection=function(a){angular.isDefined(a)&&(g.date=a);a=g.date?d(g.date,
q):"";h.val(a);l.$setViewValue(a);x&&(g.isOpen=!1,h[0].focus())};l.$viewChangeListeners.push(function(){g.date=c.parse(l.$viewValue,q,g.date)||new Date(l.$viewValue)});var J=function(a){g.isOpen&&a.target!==h[0]&&g.$apply(function(){g.isOpen=!1})},y=function(a){g.keydown(a)};h.bind("keydown",y);g.keydown=function(a){27===a.which?(a.preventDefault(),g.isOpen&&a.stopPropagation(),g.close()):40!==a.which||g.isOpen||(g.isOpen=!0)};g.$watch("isOpen",function(a){a?(g.$broadcast("datepicker.focus"),g.position=
u?e.offset(h):e.position(h),g.position.top+=h.prop("offsetHeight"),f.bind("click",J)):f.unbind("click",J)});g.select=function(a){if("today"===a){var b=new Date;angular.isDate(g.date)?(a=new Date(g.date),a.setFullYear(b.getFullYear(),b.getMonth(),b.getDate())):a=new Date(b.setHours(0,0,0,0))}g.dateSelection(a)};g.close=function(){g.isOpen=!1;h[0].focus()};var t=a(z)(g);z.remove();u?f.find("body").append(t):h.after(t);g.$on("$destroy",function(){t.remove();h.unbind("keydown",y);f.unbind("click",J)})}}}]).directive("datepickerPopupWrap",
function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault();a.stopPropagation()})}}});
angular.module("ui.bootstrap.dropdown",["ui.bootstrap.position"]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document","$rootScope",function(a,b){var f=null;this.open=function(b){f||(a.bind("click",e),a.bind("keydown",d));f&&f!==b&&(f.isOpen=!1);f=b};this.close=function(b){f===b&&(f=null,a.unbind("click",e),a.unbind("keydown",d))};var e=function(a){if(f&&(!a||"disabled"!==f.getAutoClose())){var d=f.getToggleElement();a&&d&&d[0].contains(a.target)||(d=f.getElement(),
a&&"outsideClick"===f.getAutoClose()&&d&&d[0].contains(a.target)||(f.isOpen=!1,b.$$phase||f.$apply()))}},d=function(a){27===a.which&&(f.focusToggleElement(),e())}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate","$position","$document",function(a,b,f,e,d,c,m,g){var h,k=this,l=a.$new(),p=e.openClass,r=angular.noop,n=b.onToggle?f(b.onToggle):angular.noop,q=!1;this.init=function(c){k.$element=c;b.isOpen&&(h=f(b.isOpen),r=h.assign,a.$watch(h,
function(a){l.isOpen=!!a}));(q=angular.isDefined(b.dropdownAppendToBody))&&k.dropdownMenu&&(g.find("body").append(k.dropdownMenu),c.on("$destroy",function(){k.dropdownMenu.remove()}))};this.toggle=function(a){return l.isOpen=arguments.length?!!a:!l.isOpen};this.isOpen=function(){return l.isOpen};l.getToggleElement=function(){return k.toggleElement};l.getAutoClose=function(){return b.autoClose||"always"};l.getElement=function(){return k.$element};l.focusToggleElement=function(){k.toggleElement&&k.toggleElement[0].focus()};
l.$watch("isOpen",function(b,f){if(q&&k.dropdownMenu){var e=m.positionElements(k.$element,k.dropdownMenu,"bottom-left",!0);k.dropdownMenu.css({top:e.top+"px",left:e.left+"px",display:b?"block":"none"})}c[b?"addClass":"removeClass"](k.$element,p);b?(l.focusToggleElement(),d.open(l)):d.close(l);r(a,b);angular.isDefined(b)&&b!==f&&n(a,{open:!!b})});a.$on("$locationChangeSuccess",function(){l.isOpen=!1});a.$on("$destroy",function(){l.$destroy()})}]).directive("dropdown",function(){return{controller:"DropdownController",
link:function(a,b,f,e){e.init(b)}}}).directive("dropdownMenu",function(){return{restrict:"AC",require:"?^dropdown",link:function(a,b,f,e){e&&(e.dropdownMenu=b)}}}).directive("dropdownToggle",function(){return{require:"?^dropdown",link:function(a,b,f,e){if(e){e.toggleElement=b;var d=function(c){c.preventDefault();b.hasClass("disabled")||f.disabled||a.$apply(function(){e.toggle()})};b.bind("click",d);b.attr({"aria-haspopup":!0,"aria-expanded":!1});a.$watch(e.isOpen,function(a){b.attr("aria-expanded",
!!a)});a.$on("$destroy",function(){b.unbind("click",d)})}}}});
angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,f){a.push({key:b,value:f})},get:function(b){for(var f=0;f<a.length;f++)if(b==a[f].key)return a[f]},keys:function(){for(var b=[],f=0;f<a.length;f++)b.push(a[f].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var f=-1,e=0;e<a.length;e++)if(b==a[e].key){f=e;break}return a.splice(f,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},
length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){function b(b){b.animate=!1;a(function(){b.animate=!0})}return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",compile:function(a,e){return a.addClass(e.backdropClass),b}}}]).directive("modalWindow",["$modalStack","$q",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(a,b){return b.templateUrl||"template/modal/window.html"},link:function(f,
e,d){e.addClass(d.windowClass||"");f.size=d.size;f.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))};f.$isRendered=!0;var c=b.defer();d.$observe("modalRender",function(a){"true"==a&&c.resolve()});c.promise.then(function(){f.animate=!0;var b=e[0].querySelectorAll("[autofocus]");b.length?b[0].focus():e[0].focus();(b=a.getTop())&&a.modalRendered(b.key)})}}}]).directive("modalAnimationClass",
[function(){return{compile:function(a,b){b.modalAnimation&&a.addClass(b.modalAnimationClass)}}}]).directive("modalTransclude",function(){return{link:function(a,b,f,e,d){d(a.$parent,function(a){b.empty();b.append(a)})}}}).factory("$modalStack",["$animate","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,f,e,d,c){function m(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function g(a){var b=f.find("body").eq(0),c=n.get(a).value;n.remove(a);
k(c.modalDomEl,c.modalScope,function(){b.toggleClass(r,0<n.length());h()})}function h(){l&&-1==m()&&(k(l,p,function(){}),p=l=void 0)}function k(c,e,f){function g(){g.done||(g.done=!0,c.remove(),e.$destroy(),f&&f())}e.animate=!1;c.attr("modal-animation")&&a.enabled()?c.one("$animate:close",function(){d.$evalAsync(g)}):b(g)}var l,p,r="modal-open",n=c.createNew(),q={};return d.$watch(m,function(a){p&&(p.index=a)}),f.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&(a.preventDefault(),
d.$apply(function(){q.dismiss(b.key,"escape key press")})))}),q.open=function(a,b){var c=f[0].activeElement;n.add(a,{deferred:b.deferred,renderDeferred:b.renderDeferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var g=f.find("body").eq(0),h=m();0<=h&&!l&&(p=d.$new(!0),p.index=h,h=angular.element('<div modal-backdrop="modal-backdrop"></div>'),h.attr("backdrop-class",b.backdropClass),b.animation&&h.attr("modal-animation","true"),l=e(h)(p),g.append(l));h=angular.element('<div modal-window="modal-window"></div>');
h.attr({"template-url":b.windowTemplateUrl,"window-class":b.windowClass,size:b.size,index:n.length()-1,animate:"animate"}).html(b.content);b.animation&&h.attr("modal-animation","true");h=e(h)(b.scope);n.top().value.modalDomEl=h;n.top().value.modalOpener=c;g.append(h);g.addClass(r)},q.close=function(a,b){var c=n.get(a);return c&&!c.value.modalScope.$broadcast("modal.closing",b,!0).defaultPrevented?(c.value.deferred.resolve(b),g(a),c.value.modalOpener.focus(),!0):!c},q.dismiss=function(a,b){var c=n.get(a);
return c&&!c.value.modalScope.$broadcast("modal.closing",b,!1).defaultPrevented?(c.value.deferred.reject(b),g(a),c.value.modalOpener.focus(),!0):!c},q.dismissAll=function(a){for(var b=this.getTop();b&&this.dismiss(b.key,a);)b=this.getTop()},q.getTop=function(){return n.top()},q.modalRendered=function(a){(a=n.get(a))&&a.value.renderDeferred.resolve()},q}]).provider("$modal",function(){var a={options:{animation:!0,backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$templateRequest","$controller",
"$modalStack",function(b,f,e,d,c,m){function g(a){return a.template?e.when(a.template):d(angular.isFunction(a.templateUrl)?a.templateUrl():a.templateUrl)}function h(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(e.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var d=e.defer(),k=e.defer(),n=e.defer(),q={result:d.promise,opened:k.promise,rendered:n.promise,close:function(a){return m.close(q,a)},dismiss:function(a){return m.dismiss(q,a)}};
if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw Error("One of template or templateUrl options is required.");var x=e.all([g(b)].concat(h(b.resolve)));return x.then(function(a){var e=(b.scope||f).$new();e.$close=q.close;e.$dismiss=q.dismiss;var g,h={},k=1;b.controller&&(h.$scope=e,h.$modalInstance=q,angular.forEach(b.resolve,function(b,c){h[c]=a[k++]}),g=c(b.controller,h),b.controllerAs&&(e[b.controllerAs]=g));m.open(q,{scope:e,deferred:d,renderDeferred:n,
content:a[0],animation:b.animation,backdrop:b.backdrop,keyboard:b.keyboard,backdropClass:b.backdropClass,windowClass:b.windowClass,windowTemplateUrl:b.windowTemplateUrl,size:b.size})},function(a){d.reject(a)}),x.then(function(){k.resolve(!0)},function(a){k.reject(a)}),q},k}]};return a});
angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse",function(a,b,f){var e=this,d={$setViewValue:angular.noop},c=b.numPages?f(b.numPages).assign:angular.noop;this.init=function(m,g){d=m;this.config=g;d.$render=function(){e.render()};b.itemsPerPage?a.$parent.$watch(f(b.itemsPerPage),function(b){e.itemsPerPage=parseInt(b,10);a.totalPages=e.calculateTotalPages()}):this.itemsPerPage=g.itemsPerPage;a.$watch("totalItems",function(){a.totalPages=e.calculateTotalPages()});
a.$watch("totalPages",function(b){c(a.$parent,b);a.page>b?a.selectPage(b):d.$render()})};this.calculateTotalPages=function(){var b=1>this.itemsPerPage?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)};this.render=function(){a.page=parseInt(d.$viewValue,10)||1};a.selectPage=function(b,c){a.page!==b&&0<b&&b<=a.totalPages&&(c&&c.target&&c.target.blur(),d.$setViewValue(b),d.$render())};a.getText=function(b){return a[b+"Text"]||e.config[b+"Text"]};a.noPrevious=function(){return 1===
a.page};a.noNext=function(){return a.page===a.totalPages}}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@"},require:["pagination","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pagination.html",
replace:!0,link:function(f,e,d,c){var m=c[0];if(e=c[1]){var g=angular.isDefined(d.maxSize)?f.$parent.$eval(d.maxSize):b.maxSize,h=angular.isDefined(d.rotate)?f.$parent.$eval(d.rotate):b.rotate;f.boundaryLinks=angular.isDefined(d.boundaryLinks)?f.$parent.$eval(d.boundaryLinks):b.boundaryLinks;f.directionLinks=angular.isDefined(d.directionLinks)?f.$parent.$eval(d.directionLinks):b.directionLinks;m.init(e,b);d.maxSize&&f.$parent.$watch(a(d.maxSize),function(a){g=parseInt(a,10);m.render()});var k=m.render;
m.render=function(){k();if(0<f.page&&f.page<=f.totalPages){var a=f.page,b=f.totalPages,c=[],d=1,e=b,m=angular.isDefined(g)&&b>g;m&&(h?(d=Math.max(a-Math.floor(g/2),1),e=d+g-1,e>b&&(e=b,d=e-g+1)):(d=(Math.ceil(a/g)-1)*g+1,e=Math.min(d+g-1,b)));for(var u=d;e>=u;u++)c.push({number:u,text:u,active:u===a});m&&!h&&(1<d&&c.unshift({number:d-1,text:"...",active:!1}),b>e&&c.push({number:e+1,text:"...",active:!1}));f.pages=c}}}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"\u00ab Previous",nextText:"Next \u00bb",
align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{totalItems:"=",previousText:"@",nextText:"@"},require:["pager","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,f,e,d){f=d[0];(d=d[1])&&(b.align=angular.isDefined(e.align)?b.$parent.$eval(e.align):a.align,f.init(d,a))}}}]);
angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){return a.replace(/[A-Z]/g,function(a,b){return(b?"-":"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0,useContentExp:!1},f={mouseenter:"mouseleave",click:"click",focus:"blur"},e={};this.options=function(a){angular.extend(e,a)};this.setTriggers=function(a){angular.extend(f,a)};this.$get=["$window","$compile","$timeout","$document","$position","$interpolate",
function(d,c,m,g,h,k){return function(d,p,r,n){function q(a){a=a||n.trigger||r;return{show:a,hide:f[a]||a}}n=angular.extend({},b,e,n);var x=a(d),u=k.startSymbol(),w=k.endSymbol(),z="<div "+x+'-popup title="'+u+"title"+w+'" '+(n.useContentExp?'content-exp="contentExp()" ':'content="'+u+"content"+w+'" ')+'placement="'+u+"placement"+w+'" popup-class="'+u+"popupClass"+w+'" animation="animation" is-open="isOpen"origin-scope="origScope" ></div>';return{restrict:"EA",compile:function(){var a=c(z);return function(b,
c,e){function f(){v.isOpen?r():k()}function k(){if(!T||b.$eval(e[p+"Enable"]))v.popupClass=e[p+"Class"],O(),K(),v.popupDelay?E||(E=m(z,v.popupDelay,!1),E.then(function(a){a()})):z()()}function r(){b.$apply(function(){u()})}function z(){return E=null,F&&(m.cancel(F),F=null),(n.useContentExp?v.contentExp():v.content)?(w(),B.css({top:0,left:0,display:"block"}),v.$digest(),Q(),v.isOpen=!0,v.$apply(),Q):angular.noop}function u(){v.isOpen=!1;m.cancel(E);E=null;v.animation?F||(F=m(x,500)):x()}function w(){B&&
x();G=v.$new();B=a(G,function(a){P?g.find("body").append(a):c.after(a)});G.$watch(function(){m(Q,0,!1)});n.useContentExp&&G.$watch("contentExp()",function(a){!a&&v.isOpen&&u()})}function x(){F=null;B&&(B.remove(),B=null);G&&(G.$destroy(),G=null)}function O(){var a=e[p+"Placement"];v.placement=angular.isDefined(a)?a:n.placement}function K(){var a=parseInt(e[p+"PopupDelay"],10);v.popupDelay=isNaN(a)?n.popupDelay:a}var B,G,F,E,P=angular.isDefined(n.appendToBody)?n.appendToBody:!1,C=q(void 0),T=angular.isDefined(e[p+
"Enable"]),v=b.$new(!0),Q=function(){if(B){var a=h.positionElements(c,B,v.placement,P);a.top+="px";a.left+="px";B.css(a)}};v.origScope=b;v.isOpen=!1;v.contentExp=function(){return b.$eval(e[d])};n.useContentExp||e.$observe(d,function(a){v.content=a;!a&&v.isOpen&&u()});e.$observe("disabled",function(a){a&&v.isOpen&&u()});e.$observe(p+"Title",function(a){v.title=a});var S=function(){c.unbind(C.show,k);c.unbind(C.hide,r)};(function(){var a=e[p+"Trigger"];S();C=q(a);C.show===C.hide?c.bind(C.show,f):(c.bind(C.show,
k),c.bind(C.hide,r))})();var L=b.$eval(e[p+"Animation"]);v.animation=angular.isDefined(L)?!!L:n.animation;L=b.$eval(e[p+"AppendToBody"]);(P=angular.isDefined(L)?L:P)&&b.$on("$locationChangeSuccess",function(){v.isOpen&&u()});b.$on("$destroy",function(){m.cancel(F);m.cancel(E);S();x();v=null})}}}}}]}).directive("tooltipTemplateTransclude",["$animate","$sce","$compile","$templateRequest",function(a,b,f,e){return{link:function(d,c,m){var g,h,k,l=d.$eval(m.tooltipTemplateTranscludeScope),p=0,r=function(){h&&
(h.remove(),h=null);g&&(g.$destroy(),g=null);k&&(a.leave(k).then(function(){h=null}),h=k,k=null)};d.$watch(b.parseAsResourceUrl(m.tooltipTemplateTransclude),function(b){var h=++p;b?(e(b,!0).then(function(d){if(h===p){var e=l.$new();d=f(d)(e,function(b){r();a.enter(b,c)});g=e;k=d;g.$emit("$includeContentLoaded",b)}},function(){h===p&&(r(),d.$emit("$includeContentError",b))}),d.$emit("$includeContentRequested",b)):r()});d.$on("$destroy",r)}}}]).directive("tooltipClasses",function(){return{restrict:"A",
link:function(a,b,f){a.placement&&b.addClass(a.placement);a.popupClass&&b.addClass(a.popupClass);a.animation()&&b.addClass(f.tooltipAnimationClass)}}}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipTemplatePopup",function(){return{restrict:"EA",
replace:!0,scope:{contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&",originScope:"&"},templateUrl:"template/tooltip/tooltip-template-popup.html"}}).directive("tooltipTemplate",["$tooltip",function(a){return a("tooltipTemplate","tooltip","mouseenter",{useContentExp:!0})}]).directive("tooltipHtmlPopup",function(){return{restrict:"EA",replace:!0,scope:{contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-popup.html"}}).directive("tooltipHtml",
["$tooltip",function(a){return a("tooltipHtml","tooltip","mouseenter",{useContentExp:!0})}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).value("tooltipHtmlUnsafeSuppressDeprecated",!1).directive("tooltipHtmlUnsafe",["$tooltip","tooltipHtmlUnsafeSuppressDeprecated","$log",function(a,b,f){return b||f.warn("tooltip-html-unsafe is now deprecated. Use tooltip-html or tooltip-template instead."),
a("tooltipHtmlUnsafe","tooltip","mouseenter")}]);
angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverTemplatePopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",contentExp:"&",placement:"@",popupClass:"@",animation:"&",isOpen:"&",originScope:"&"},templateUrl:"template/popover/popover-template.html"}}).directive("popoverTemplate",["$tooltip",function(a){return a("popoverTemplate","popover","click",{useContentExp:!0})}]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",
content:"@",placement:"@",popupClass:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]);
angular.module("ui.bootstrap.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig",function(a,b,f){var e=this,d=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):f.animate;this.bars=[];a.max=angular.isDefined(a.max)?a.max:f.max;this.addBar=function(b,f){d||f.css({transition:"none"});this.bars.push(b);b.$watch("value",function(d){b.percent=+(100*d/a.max).toFixed(2)});b.$on("$destroy",function(){f=null;e.removeBar(b)})};
this.removeBar=function(a){this.bars.splice(this.bars.indexOf(a),1)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},templateUrl:"template/progressbar/progress.html"}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",max:"=?",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,f,e){e.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",
replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",max:"=?",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,f,e){e.addBar(a,angular.element(b.children()[0]))}}});
angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(a,b,f){var e={$setViewValue:angular.noop};this.init=function(d){e=d;e.$render=this.render;e.$formatters.push(function(a){return angular.isNumber(a)&&a<<0!==a&&(a=Math.round(a)),a});this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):f.stateOn;this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):
f.stateOff;d=angular.isDefined(b.ratingStates)?a.$parent.$eval(b.ratingStates):Array(angular.isDefined(b.max)?a.$parent.$eval(b.max):f.max);a.range=this.buildTemplateObjects(d)};this.buildTemplateObjects=function(a){for(var b=0,e=a.length;e>b;b++)a[b]=angular.extend({index:b},{stateOn:this.stateOn,stateOff:this.stateOff},a[b]);return a};a.rate=function(b){!a.readonly&&0<=b&&b<=a.range.length&&(e.$setViewValue(b),e.$render())};a.enter=function(b){a.readonly||(a.value=b);a.onHover({value:b})};a.reset=
function(){a.value=e.$viewValue;a.onLeave()};a.onKeydown=function(b){/(37|38|39|40)/.test(b.which)&&(b.preventDefault(),b.stopPropagation(),a.rate(a.value+(38===b.which||39===b.which?1:-1)))};this.render=function(){a.value=e.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(a,b,f,e){e[0].init(e[1])}}});
angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,f=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(f,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())});a.active=!0;a.onSelect()};b.addTab=function(a){f.push(a);1===f.length&&!1!==a.active?a.active=!0:a.active?b.select(a):a.active=!1};b.removeTab=function(a){var c=f.indexOf(a);a.active&&1<f.length&&!e&&b.select(f[c==f.length-1?c-1:c+1]);f.splice(c,1)};var e;a.$on("$destroy",function(){e=
!0})}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,f){a.vertical=angular.isDefined(f.vertical)?a.$parent.$eval(f.vertical):!1;a.justified=angular.isDefined(f.justified)?a.$parent.$eval(f.justified):!1}}}).directive("tab",["$parse","$log",function(a,b){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",
heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(f,e,d){return function(c,e,f,h){c.$watch("active",function(a){a&&h.select(c)});c.disabled=!1;f.disable&&c.$parent.$watch(a(f.disable),function(a){c.disabled=!!a});f.disabled&&(b.warn('Use of "disabled" attribute has been deprecated, please use "disable"'),c.$parent.$watch(a(f.disabled),function(a){c.disabled=!!a}));c.select=function(){c.disabled||(c.active=!0)};h.addTab(c);c.$on("$destroy",function(){h.removeTab(c)});
c.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){return{restrict:"A",require:"^tabset",link:function(a,b,f){var e=a.$eval(f.tabContentTransclude);e.$transcludeFn(e.$parent,function(a){angular.forEach(a,function(a){a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||
"data-tab-heading"===a.tagName.toLowerCase())?e.headingElement=a:b.append(a)})})}}});
angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0,arrowkeys:!0}).controller("TimepickerController",["$scope","$attrs","$parse","$log","$locale","timepickerConfig",function(a,b,f,e,d,c){function m(){var b=parseInt(a.hours,10);return(a.showMeridian?0<b&&13>b:0<=b&&24>b)?(a.showMeridian&&(12===b&&(b=0),a.meridian===x[1]&&(b+=12)),b):void 0}function g(){var b=parseInt(a.minutes,10);return 0<=
b&&60>b?b:void 0}function h(a){return angular.isDefined(a)&&2>a.toString().length?"0"+a:a.toString()}function k(a){l();q.$setViewValue(new Date(n));p(a)}function l(){q.$setValidity("time",!0);a.invalidHours=!1;a.invalidMinutes=!1}function p(b){var c=n.getHours(),d=n.getMinutes();a.showMeridian&&(c=0===c||12===c?12:c%12);a.hours="h"===b?c:h(c);"m"!==b&&(a.minutes=h(d));a.meridian=12>n.getHours()?x[0]:x[1]}function r(a){a=new Date(n.getTime()+6E4*a);n.setHours(a.getHours(),a.getMinutes());k()}var n=
new Date,q={$setViewValue:angular.noop},x=angular.isDefined(b.meridians)?a.$parent.$eval(b.meridians):c.meridians||d.DATETIME_FORMATS.AMPMS;this.init=function(d,e){q=d;q.$render=this.render;q.$formatters.unshift(function(a){return a?new Date(a):null});var f=e.eq(0),g=e.eq(1);(angular.isDefined(b.mousewheel)?a.$parent.$eval(b.mousewheel):c.mousewheel)&&this.setupMousewheelEvents(f,g);(angular.isDefined(b.arrowkeys)?a.$parent.$eval(b.arrowkeys):c.arrowkeys)&&this.setupArrowkeyEvents(f,g);a.readonlyInput=
angular.isDefined(b.readonlyInput)?a.$parent.$eval(b.readonlyInput):c.readonlyInput;this.setupInputEvents(f,g)};var u=c.hourStep;b.hourStep&&a.$parent.$watch(f(b.hourStep),function(a){u=parseInt(a,10)});var w=c.minuteStep;b.minuteStep&&a.$parent.$watch(f(b.minuteStep),function(a){w=parseInt(a,10)});a.showMeridian=c.showMeridian;b.showMeridian&&a.$parent.$watch(f(b.showMeridian),function(b){if(a.showMeridian=!!b,q.$error.time){b=m();var c=g();angular.isDefined(b)&&angular.isDefined(c)&&(n.setHours(b),
k())}else p()});this.setupMousewheelEvents=function(b,c){var d=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||0<b};b.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementHours():a.decrementHours());b.preventDefault()});c.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementMinutes():a.decrementMinutes());b.preventDefault()})};this.setupArrowkeyEvents=function(b,c){b.bind("keydown",function(b){38===b.which?(b.preventDefault(),
a.incrementHours(),a.$apply()):40===b.which&&(b.preventDefault(),a.decrementHours(),a.$apply())});c.bind("keydown",function(b){38===b.which?(b.preventDefault(),a.incrementMinutes(),a.$apply()):40===b.which&&(b.preventDefault(),a.decrementMinutes(),a.$apply())})};this.setupInputEvents=function(b,c){if(a.readonlyInput)return a.updateHours=angular.noop,void(a.updateMinutes=angular.noop);var d=function(b,c){q.$setViewValue(null);q.$setValidity("time",!1);angular.isDefined(b)&&(a.invalidHours=b);angular.isDefined(c)&&
(a.invalidMinutes=c)};a.updateHours=function(){var a=m();angular.isDefined(a)?(n.setHours(a),k("h")):d(!0)};b.bind("blur",function(){!a.invalidHours&&10>a.hours&&a.$apply(function(){a.hours=h(a.hours)})});a.updateMinutes=function(){var a=g();angular.isDefined(a)?(n.setMinutes(a),k("m")):d(void 0,!0)};c.bind("blur",function(){!a.invalidMinutes&&10>a.minutes&&a.$apply(function(){a.minutes=h(a.minutes)})})};this.render=function(){var a=q.$viewValue;isNaN(a)?(q.$setValidity("time",!1),e.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):
(a&&(n=a),l(),p())};a.incrementHours=function(){r(60*u)};a.decrementHours=function(){r(60*-u)};a.incrementMinutes=function(){r(w)};a.decrementMinutes=function(){r(-w)};a.toggleMeridian=function(){r(720*(12>n.getHours()?1:-1))}}]).directive("timepicker",function(){return{restrict:"EA",require:["timepicker","?^ngModel"],controller:"TimepickerController",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(a,b,f,e){a=e[0];(e=e[1])&&a.init(e,b.find("input"))}}});
angular.module("ui.bootstrap.transition",[]).value("$transitionSuppressDeprecated",!1).factory("$transition",["$q","$timeout","$rootScope","$log","$transitionSuppressDeprecated",function(a,b,f,e,d){function c(a){for(var b in a)if(void 0!==g.style[b])return a[b]}d||e.warn("$transition is now deprecated. Use $animate from ngAnimate instead.");var m=function(c,d,e){e=e||{};var g=a.defer(),r=m[e.animation?"animationEndEventName":"transitionEndEventName"],n=function(){f.$apply(function(){c.unbind(r,n);
g.resolve(c)})};return r&&c.bind(r,n),b(function(){angular.isString(d)?c.addClass(d):angular.isFunction(d)?d(c):angular.isObject(d)&&c.css(d);r||g.resolve(c)}),g.promise.cancel=function(){r&&c.unbind(r,n);g.reject("Transition cancelled")},g.promise},g=document.createElement("trans");return m.transitionEndEventName=c({WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"}),m.animationEndEventName=c({WebkitTransition:"webkitAnimationEnd",
MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"}),m}]);
angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return{parse:function(f){var e=f.match(b);if(!e)throw Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "'+f+'".');return{itemName:e[3],source:a(e[4]),viewMapper:a(e[2]||e[1]),modelMapper:a(e[1])}}}}]).directive("typeahead",
["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,f,e,d,c,m){var g=[9,13,27,38,40];return{require:"ngModel",link:function(h,k,l,p){var r,n=h.$eval(l.typeaheadMinLength)||1,q=h.$eval(l.typeaheadWaitMs)||0,x=!1!==h.$eval(l.typeaheadEditable),u=b(l.typeaheadLoading).assign||angular.noop,w=b(l.typeaheadOnSelect),z=l.typeaheadInputFormatter?b(l.typeaheadInputFormatter):void 0,A=l.typeaheadAppendToBody?h.$eval(l.typeaheadAppendToBody):!1,H=!1!==h.$eval(l.typeaheadFocusFirst),
J=b(l.ngModel).assign,y=m.parse(l.typeahead),t=h.$new();h.$on("$destroy",function(){t.$destroy()});var M="typeahead-"+t.$id+"-"+Math.floor(1E4*Math.random());k.attr({"aria-autocomplete":"list","aria-expanded":!1,"aria-owns":M});var N=angular.element("<div typeahead-popup></div>");N.attr({id:M,matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"});angular.isDefined(l.typeaheadTemplateUrl)&&N.attr("template-url",l.typeaheadTemplateUrl);var D=function(){t.matches=
[];t.activeIdx=-1;k.attr("aria-expanded",!1)};t.$watch("activeIdx",function(a){0>a?k.removeAttr("aria-activedescendant"):k.attr("aria-activedescendant",M+"-option-"+a)});var R=function(a){var b={$viewValue:a};u(h,!0);f.when(y.source(h,b)).then(function(d){var e=a===p.$viewValue;if(e&&r)if(d&&0<d.length){t.activeIdx=H?0:-1;for(var f=t.matches.length=0;f<d.length;f++)b[y.itemName]=d[f],t.matches.push({id:M+"-option-"+f,label:y.viewMapper(t,b),model:d[f]});t.query=a;t.position=A?c.offset(k):c.position(k);
t.position.top+=k.prop("offsetHeight");k.attr("aria-expanded",!0)}else D();e&&u(h,!1)},function(){D();u(h,!1)})};D();t.query=void 0;var I,U=function(a){I=e(function(){R(a)},q)};p.$parsers.unshift(function(a){r=!0;a&&a.length>=n?0<q?(I&&e.cancel(I),U(a)):R(a):(u(h,!1),I&&e.cancel(I),D());return x?a:a?void p.$setValidity("editable",!1):(p.$setValidity("editable",!0),a)});p.$formatters.push(function(a){var b,c,d={};return x||p.$setValidity("editable",!0),z?(d.$model=a,z(h,d)):(d[y.itemName]=a,b=y.viewMapper(h,
d),d[y.itemName]=void 0,c=y.viewMapper(h,d),b!==c?b:a)});t.select=function(a){var b,c={};c[y.itemName]=b=t.matches[a].model;a=y.modelMapper(h,c);J(h,a);p.$setValidity("editable",!0);p.$setValidity("parse",!0);w(h,{$item:b,$model:a,$label:y.viewMapper(h,c)});D();e(function(){k[0].focus()},0,!1)};k.bind("keydown",function(a){0!==t.matches.length&&-1!==g.indexOf(a.which)&&(-1!=t.activeIdx||13!==a.which&&9!==a.which)&&(a.preventDefault(),40===a.which?(t.activeIdx=(t.activeIdx+1)%t.matches.length,t.$digest()):
38===a.which?(t.activeIdx=(0<t.activeIdx?t.activeIdx:t.matches.length)-1,t.$digest()):13===a.which||9===a.which?t.$apply(function(){t.select(t.activeIdx)}):27===a.which&&(a.stopPropagation(),D(),t.$digest()))});k.bind("blur",function(){r=!1});var O=function(a){k[0]!==a.target&&(D(),t.$digest())};d.bind("click",O);h.$on("$destroy",function(){d.unbind("click",O);A&&K.remove();N.remove()});var K=a(N)(t);A?d.find("body").append(K):k.after(K)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",
scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,f){a.templateUrl=f.templateUrl;a.isOpen=function(){return 0<a.matches.length};a.isActive=function(b){return a.active==b};a.selectActive=function(b){a.active=b};a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$templateRequest","$compile","$parse",function(a,b,f){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},
link:function(e,d,c){c=f(c.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a(c).then(function(a){b(a.trim())(e,function(a){d.replaceWith(a)})})}}}]).filter("typeaheadHighlight",function(){return function(a,b){return b?(""+a).replace(new RegExp(b.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"gi"),"<strong>$&</strong>"):a}});angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0)" tabindex="0" class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse collapse" collapse="!isOpen">\n\t  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')}]);
angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]);angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html",'<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')}]);
angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides | orderBy:\'index\' track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')}]);
angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html",'<div ng-class="{\n    \'active\': active\n  }" class="item text-center" ng-transclude></div>\n')}]);angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')}]);
angular.module("template/datepicker/day.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/day.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}" ng-class="dt.customClass">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]);
angular.module("template/datepicker/month.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/month.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]);
angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html",'<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n\t<li ng-transclude></li>\n\t<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n\t\t<span class="btn-group pull-left">\n\t\t\t<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n\t\t\t<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n\t\t</span>\n\t\t<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n\t</li>\n</ul>\n')}]);
angular.module("template/datepicker/year.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/year.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" ng-disabled="datepickerMode === maxMode" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]);
angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop"\n     modal-animation-class="fade"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]);angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div modal-render="{{$isRendered}}" tabindex="-1" role="dialog" class="modal"\n    modal-animation-class="fade"\n\tng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="size ? \'modal-\' + size : \'\'"><div class="modal-content" modal-transclude></div></div>\n</div>\n')}]);
angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1, $event)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1, $event)">{{getText(\'next\')}}</a></li>\n</ul>')}]);
angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1, $event)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1, $event)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number, $event)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1, $event)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages, $event)">{{getText(\'last\')}}</a></li>\n</ul>')}]);
angular.module("template/tooltip/tooltip-html-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-popup.html",'<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind-html="contentExp()"></div>\n</div>\n')}]);
angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]);
angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]);
angular.module("template/tooltip/tooltip-template-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-template-popup.html",'<div class="tooltip"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner"\n    tooltip-template-transclude="contentExp()"\n    tooltip-template-transclude-scope="originScope()"></div>\n</div>\n')}]);
angular.module("template/popover/popover-template.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover-template.html",'<div class="popover"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content"\n        tooltip-template-transclude="contentExp()"\n        tooltip-template-transclude-scope="originScope()"></div>\n  </div>\n</div>\n')}]);
angular.module("template/popover/popover-window.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover-window.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen, fade: animation }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" tooltip-template-transclude></div>\n  </div>\n</div>\n')}]);
angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover"\n  tooltip-animation-class="fade"\n  tooltip-classes\n  ng-class="{ in: isOpen() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-if="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]);
angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n')}]);
angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]);angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: (percent < 100 ? percent : 100) + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>\n')}]);
angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')}]);
angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]);angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]);
angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table>\n\t<tbody>\n\t\t<tr class="text-center">\n\t\t\t<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n\t\t\t<td ng-show="showMeridian"></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td class="form-group" ng-class="{\'has-error\': invalidHours}">\n\t\t\t\t<input style="width:50px;" type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n\t\t\t</td>\n\t\t\t<td>:</td>\n\t\t\t<td class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n\t\t\t\t<input style="width:50px;" type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n\t\t\t</td>\n\t\t\t<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n\t\t</tr>\n\t\t<tr class="text-center">\n\t\t\t<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n\t\t\t<td ng-show="showMeridian"></td>\n\t\t</tr>\n\t</tbody>\n</table>\n')}]);
angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')}]);angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html",'<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')}]);
!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>');
function AchievementsState(){var a=UserStorage.GetStorage();this.notif=new Notifications;this.container=a.Get("UserAchievements")||[];for(a=this.container.length;a<AchievementsState.List.enumSize;a+=1)this.container[a]=!1}AchievementsState.prototype.IsWon=function(a){return this.container[a]};AchievementsState.prototype.check=function(a,c,b){for(var d=0;d<AchievementsState.List.enumSize;d+=1)this.checkIndividual(d,a,c,b);UserStorage.GetStorage().Set("UserAchievements",this.container)};
AchievementsState.prototype.keyToScore=function(a){switch(a){case AchievementsState.List.Beginner:return 10;case AchievementsState.List.Expert:return 80;case AchievementsState.List.Master:return 160;case AchievementsState.List.God:return 350;case AchievementsState.List.Cheater:return 1E3}throw"What are you doing here ?";};
AchievementsState.prototype.checkMultiLines=function(a,c){var b=0;switch(a){case AchievementsState.List.Ambidextrous:b=1;break;case AchievementsState.List.Psychics:b=2;break;case AchievementsState.List.Sorcerer:b=3;break;default:throw"What are you doing here ?";}for(;b<c.multilines.length;b+=1)if(c.multilines[b])return!0;return!1};
AchievementsState.prototype.checkIndividual=function(a,c,b,d){if(!this.container[a]){switch(a){case AchievementsState.List.Beginner:case AchievementsState.List.Expert:case AchievementsState.List.Master:case AchievementsState.List.God:"classic"===d&&(this.container[a]=c.score>=this.keyToScore(a));break;case AchievementsState.List.Cheater:"sandbox"===d&&(this.container[a]=c.score>=this.keyToScore(a));break;case AchievementsState.List.Ambidextrous:case AchievementsState.List.Psychics:case AchievementsState.List.Sorcerer:this.container[a]=
this.checkMultiLines(a,c);break;case AchievementsState.List.Stubborn:this.container[a]=108E3<b.GetTotalGameStats(d).time;break;case AchievementsState.List.BiggerIsBetter:for(b=3;b<c.lineSizes.length;b+=1)if(c.lineSizes[b]){this.container[a]=!0;break}}this.container[a]&&this.notif.notify("Gratz you unlocked : "+AchievementsState.List.GetName(a))}};AchievementsState.List={Beginner:0,Expert:1,Master:2,God:3,Cheater:4,Ambidextrous:5,Psychics:6,Sorcerer:7,Stubborn:8,BiggerIsBetter:9,Nostalgic:10,enumSize:11};
AchievementsState.List.GetName=function(a){for(var c in AchievementsState.List)if(AchievementsState.List[c]===a)return c;return""};
AchievementsState.List.GetDescription=function(a){switch(a){case AchievementsState.List.Beginner:return"Get 10 points in classic";case AchievementsState.List.Expert:return"Get 80 points in classic";case AchievementsState.List.Master:return"Get 160 points in classic";case AchievementsState.List.God:return"Get 350 points in classic";case AchievementsState.List.Cheater:return"Get 1000 points in sandbox";case AchievementsState.List.Ambidextrous:return"Get 2 series at once in any game mode";case AchievementsState.List.Psychics:return"Get 3 series at once in any game mode";
case AchievementsState.List.Sorcerer:return"Get 4 series at once in any game mode";case AchievementsState.List.Stubborn:return"Play for 30 minutes in any game mode";case AchievementsState.List.BiggerIsBetter:return"Create a line of 6 blocks in any game mode";case AchievementsState.List.Nostalgic:return"Not working yet :)"}return""};
function GameStats(){this.blockDestroyed=this.time=this.score=0;this.multilines=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.lineSizes=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.swapCount=this.gameCount=0}GameStats.prototype.AddLines=function(a,c){this.score+=c;this.multilines[a.length-2]+=1;for(var b=0;b<a.length;b+=1){var d=[];$.each(a[b],function(a,b){-1===$.inArray(b,d)&&d.push(b)});this.lineSizes[d.length-3]+=1;this.blockDestroyed+=d.length}};GameStats.prototype.SetTime=function(a){this.time=a};
GameStats.prototype.SetSwaps=function(a){this.swapCount=a};GameStats.Append=function(a,c){a.gameCount+=c.gameCount;a.score+=c.score;a.time+=c.time;a.blockDestroyed+=c.blockDestroyed;a.swapCount+=c.swapCount;for(var b=0;b<a.multilines.length;b+=1)a.multilines[b]+=c.multilines[b];for(b=0;b<a.lineSizes.length;b+=1)a.lineSizes[b]+=c.lineSizes[b]};
GameStats.KeepBest=function(a,c){a.gameCount+=c.gameCount;a.score=a.score>c.score?a.score:c.score;a.time=a.time>c.time?a.time:c.time;a.blockDestroyed=a.blockDestroyed>c.blockDestroyed?a.blockDestroyed:c.blockDestroyed;a.swapCount=a.swapCount>c.swapCount?a.swapCount:c.swapCount;for(var b=0;b<a.multilines.length;b+=1)a.multilines[b]=a.multilines[b]>c.multilines[b]?a.multilines[b]:c.multilines[b];for(b=0;b<a.lineSizes.length;b+=1)a.lineSizes[b]=a.lineSizes[b]>c.lineSizes[b]?a.lineSizes[b]:c.lineSizes[b]};
function UserStorage(){}UserStorage.GetStorage=function(){return new UserStorage};UserStorage.prototype.Get=function(a){a=localStorage.getItem(a);if(null===a||void 0===a)return null;try{return JSON.parse(a)}catch(b){console.log(b)}return null};UserStorage.prototype.Set=function(a,b){localStorage.setItem(a,JSON.stringify(b))};
function UserStats(){this.points={};this.timesLow={};this.timesHigh={};this.bestGameStats={};this.totalGameStats={}}UserStats.prototype.SetMaxStat=function(a,b,c){if(this[c].hasOwnProperty(b))for(var d=0;d<this[c][b].length;d+=1){if(a>=this[c][b][d]){this[c][b].splice(d,0,a);this[c][b].splice(this[c][b].length-1,1);break}}else this[c][b]=[a,0,0,0,0];UserStorage.GetStorage().Set("UserStats_"+c,this[c])};
UserStats.prototype.SetMinStat=function(a,b,c){if(this[c].hasOwnProperty(b))for(var d=0;d<this[c][b].length;d+=1){if(a<=this[c][b][d]||-1===this[c][b][d]){this[c][b].splice(d,0,a);this[c][b].splice(this[c][b].length-1,1);break}}else this[c][b]=[a,-1,-1,-1,-1];UserStorage.GetStorage().Set("UserStats_"+c,this[c])};
UserStats.prototype.AddGame=function(a,b){var c=UserStorage.GetStorage();this.bestGameStats.hasOwnProperty(b)?GameStats.KeepBest(this.bestGameStats[b],a):this.bestGameStats[b]=a;c.Set("UserStats_bestGameStats",this.bestGameStats);this.totalGameStats.hasOwnProperty(b)?GameStats.Append(this.totalGameStats[b],a):this.totalGameStats[b]=a;c.Set("UserStats_totalGameStats",this.totalGameStats);this.SetMaxStat(a.score,b,"points");this.SetMinStat(a.time,b,"timesLow");this.SetMaxStat(a.time,b,"timesHigh")};
UserStats.prototype.GetBestGameStats=function(a){return this.bestGameStats.hasOwnProperty(a)?this.bestGameStats[a]:new GameStats(a)};UserStats.prototype.GetTotalGameStats=function(a){return this.totalGameStats.hasOwnProperty(a)?this.totalGameStats[a]:new GameStats(a)};UserStats.prototype.GetHighScore=function(a){return this.points.hasOwnProperty(a)?this.points[a]:[0,0,0,0,0]};UserStats.prototype.GetMinTime=function(a){return this.timesLow.hasOwnProperty(a)?this.timesLow[a]:[-1,-1,-1,-1,-1]};
UserStats.prototype.GetMaxTime=function(a){return this.timesHigh.hasOwnProperty(a)?this.timesHigh[a]:[0,0,0,0,0]};UserStats.GetUserStats=function(){var a=UserStorage.GetStorage(),b=a.Get("UserStats_points"),c=a.Get("UserStats_timesLow"),d=a.Get("UserStats_timesHigh"),f=a.Get("UserStats_bestGameStats"),a=a.Get("UserStats_totalGameStats"),e=new UserStats;null!==b&&(e.points=b);null!==c&&(e.timesLow=c);null!==d&&(e.timesHigh=d);null!==f&&(e.bestGameStats=f);null!==a&&(e.totalGameStats=a);return e};
