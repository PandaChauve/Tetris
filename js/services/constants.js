angular.module('angularApp.base')
    .constant("TIC_PER_SEC", 60)
    .constant("SEC_PER_MIN", 60)
    .constant("EGameActions",  {
            swap: 0,//0num
            down: 1,
            up: 2,
            left: 3,
            right: 4,
            speed: 5,
            home : 6
        });
