angular.module('angularApp.factories')
    .factory('audio', [function audioFactory() {
        "use strict";
        function MyAudio(){
            this.audiochannels = [];
            this.ext = !(document.createElement('audio').canPlayType('audio/mpeg;'))?'wav':'mp3';
            this.preloaded = this.preload(); //canplaythrough on each element to check if finished
        }

        MyAudio.prototype.preload = function(){
            var ret = [];
            var tmp;
            for (var prop in MyAudio.ESounds) {
                if( MyAudio.ESounds.hasOwnProperty( prop ) ) {
                    tmp = new Audio();
                    tmp.src = MyAudio.ESounds[prop].path + this.ext;
                    tmp.oncanplaythrough = function(){
                        console.log("audio loaded : "+ this.src);
                    };
                    ret.push(tmp);
                }
            }
            return ret;
        };

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
            console.log("simultaneous audio : "+this.audiochannels.length);
        };

        MyAudio.ESounds = {
            swap : {path:'Resources/audio/jump.', duration:1000},
            score : {path:'Resources/audio/pop.', duration:1000},
            end : {path:'Resources/audio/shotgun.', duration:2000}
        };
        MyAudio.prototype.ESounds = MyAudio.ESounds;
        return new MyAudio();
    }]);
