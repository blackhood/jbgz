// this is one of the best way to creat model
// require some kind of db - mongodb for example
// var mangodb = require('mongodb');

// constructor
function USER(){
    // some internal variables
    // this.username = username;
}


USER.prototype.some_function_name = function(argument, callback){
    var result;

    // do something...

    callback(result);
};

USER.prototype.update_user = function(para){

};

USER.prototype.some_var = "";



module.exports = USER;