/**
 * Created by panda on 28/04/2015.
 */

//one day i'll do the db accès from here
function UserStorage(){
    "use strict";

}

UserStorage.GetStorage = function(){
    "use strict";
    return new UserStorage();
};


UserStorage.prototype.Get = function(key){
    "use strict";
    var val = localStorage.getItem(key);
    if(val === null) {
        return null;
    }

    return JSON.parse(val);
};

UserStorage.prototype.Set = function(key, value){
    "use strict";
    localStorage.setItem(key,JSON.stringify(value));
};