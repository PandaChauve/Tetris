angular.module('angularApp.factories')
    .factory('audio', ['systemConfig', function audioFactory(systemConfig) {
        "use strict";

        var tmpNode = document.createElement('audio');
        var audioSupported = Object.prototype.toString.call(tmpNode) !== '[object HTMLUnknownElement]';

        var ext = 'wav';
        if (audioSupported && tmpNode.canPlayType('audio/mpeg;')) //ie ...
            ext = "mp3";

        function MyAudio() {
            if (!audioSupported)
                return;
            this.audiochannels = [];
            this.ext = ext;
            this.preload(); //canplaythrough on each element to check if finished
            this.play = function () {
            };
        }

        MyAudio.prototype.preload = function () {
            if (!systemConfig.get(systemConfig.Keys.sound) || !audioSupported) {
                return;
            }
            var ret = [];
            var tmp;
            for (var prop in MyAudio.ESounds) {
                if (MyAudio.ESounds.hasOwnProperty(prop)) {
                    tmp = new Audio();
                    tmp.src = MyAudio.ESounds[prop].path + this.ext;
                    tmp.oncanplaythrough = function () {
                        console.log("audio loaded : " + this.src);
                    };
                    ret.push(tmp);
                }
            }
            return ret;
        };

        MyAudio.prototype.resetConfig = function () {
            this.play = ret.playFactory(systemConfig.get(systemConfig.Keys.sound));
        };

        MyAudio.prototype.playFactory = function playFactory(play) {
            if (!play || !audioSupported) {
                return function () {
                };
            }
            else {
                return function (sound) {
                    var thistime = new Date();
                    for (var i = 0; i < this.audiochannels.length; i += 1) {
                        if (this.audiochannels[i].endTime < thistime.getTime()) {
                            this.audiochannels[i].endTime = thistime.getTime() + sound.duration;
                            this.audiochannels[i].channel.src = sound.path + this.ext;
                            this.audiochannels[i].volume = 0.1;
                            this.audiochannels[i].channel.load();
                            this.audiochannels[i].channel.play();
                            return;
                        }
                    }
                    //no space in the buffer
                    var audio = {
                        endTime: -1,
                        channel: new Audio()
                    };
                    audio.endTime = thistime.getTime() + sound.duration;
                    audio.channel.src = sound.path + this.ext;
                    audio.channel.volume = 0.1;
                    audio.channel.load();
                    audio.channel.play();
                    this.audiochannels.push(audio);
                };
            }
        };

        MyAudio.ESounds = {
            swap: {path: 'resources/audio/jump.', duration: 1000},
            score: {path: 'resources/audio/pop.', duration: 1000},
            end: {path: 'resources/audio/shotgun.', duration: 2000}
        };
        MyAudio.prototype.ESounds = MyAudio.ESounds;
        var ret = new MyAudio();
        ret.resetConfig();
        return ret;
    }]);
