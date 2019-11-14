/**
 * @subpackage apiRoutes
 * @package friendfinder
 *****************************************/
// Load Data

var friends = require("../data/friends");

// Routing
module.exports = function(app) {
  app.get("/api/friends", function(req, res){
    res.json(friends);
  });

  app.post("/api/friends", function(req, res){
    friends.push(req.body);
    res.json(true);
    // @todo Compatibility Logic 
  });
};