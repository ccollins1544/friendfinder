/**
 * @subpackage apiRoutes
 * @package friendfinder
 *****************************************/
// Load Data
var friends = require("../data/friends");
var questions = require("../data/questions");

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
    friends.push(req.body);
    res.json(true);
    // @todo Compatibility Logic 
  });
};