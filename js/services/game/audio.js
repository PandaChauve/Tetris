angular.module('angularApp.factories')
    .factory('audio', [function audioFactory() {
        "use strict";
        function MyAudio(){
            this.audiochannels = [];
            this.ext = (document.createElement('audio').canPlayType('audio/mpeg;'))?'.mp3':'.wav';
        }
        MyAudio.prototype.play = function(sound){
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
                endTime : -1,
                channel: new Audio()
            };
            audio.endTime = thistime.getTime() + sound.duration;
            audio.channel.src = sound.path + this.ext;
            audio.channel.volume=0.1;
            audio.channel.load();
            audio.channel.play();
            this.audiochannels.push(audio);
            console.log("audio "+this.audiochannels.length);
        };

        MyAudio.prototype.ESounds = {
            swap : {path:'audio/jump', duration:1000},
            score : {path:'audio/pop', duration:1000},
            end : {path:'audio/shotgun', duration:2000}
        };

        return new MyAudio();
    }]);
