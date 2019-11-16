/**
 * @subpackage apiRoutes
 * @package friendfinder
 *****************************************/
// Load Data
var friends = require("../data/friends.js");
var questions = require("../data/questions.js");

// Models
var tarot = require("../models/tarot.js");

// Routing
module.exports = function(app) {
  // GET Routes
  app.get("/api/friends", function(req, res){
    res.json(friends);
  });

  app.get("/api/questions", function(req, res){
    res.json(questions);
  });

  // POST Routes
  app.post("/api/friends", function(req, res){
    
    tarot.add_friend(req.body);
    console.log("POST FRIENDS");
    console.log(friends);

    var matchedFriend = tarot.compatibility_check(req.body.name);
    res.json({
      ok: true,
      matched: matchedFriend
    });
  });
};