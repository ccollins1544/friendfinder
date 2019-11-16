/**
 * @subpackage tarot
 * @package friendfinder
 ******************************************************/
// Load Data
var friends = require("../data/friends.js");

var tarot = {
  compatibility_check: function(name){
    var user1 = this.get_friend(name);
    var user2 = false;
    var all_differences = new Array(friends.length);

    // Match Logic
    if(user1){
      for(var i=0; i<friends.length; i++){
        for(var property in friends[i]){
          if(friends[i].hasOwnProperty(property)){

            // check differences
            var sumDiff = 0;
            if(property === "scores"){
              for(var j=0; j < friends[i].scores.length; j++){
                user2 = friends[i];
                sumDiff += Math.abs(user1.scores[j] - user2.scores[j]);
                
                if(friends[i].name === user1.name){
                  sumDiff += 999; // make so your own score is high so you don't match to yourself. 
                }
              }
            }

            all_differences[i] = sumDiff;
          }
        }
      }
    }

    var lowest = 0;
    for(var k=1; k < all_differences.length; k++){
      if(all_differences[k] < all_differences[lowest]) lowest = k;
    }

    return friends[lowest];
  },

  add_friend: function(newFriend){
    // Update if friend already exists
    for(var f=0; f<friends.length; f++){
      for(var property in friends[f]){
        if(friends[f].hasOwnProperty(property)){
          if(property === "name" && newFriend.hasOwnProperty("name")){
            if(friends[f][property] === newFriend[property]){
              friends[f] = newFriend;
              return;
            }
          }
        }
      }
    };

    // Add New Friend
    friends.push(newFriend);
  },

  get_friend: function(name){
    for(var i=0; i<friends.length; i++){
      for(var prop in friends[i]){
        if(prop === "name"){
          if(friends[i][prop] === name){
            return friends[i];
          }
        }
      }
    }

    return false;
  }
}

module.exports = tarot;