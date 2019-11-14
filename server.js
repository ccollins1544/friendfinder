/**
 * @package friendfinder
 * @subpackage server
 * @author Christopher Collins
 * @version 1.1.1
 * @license none (public domain)
/* ===============[ Dependencies  ]========================*/
var express = require("express");
var path = require("path");

/* ===============[ Express Config ]===================*/
var app = express();
var PORT = process.env.PORT || 7000;

// Use features
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('app/public'));

// Router
require("./app/routing/apiRoutes")(app); 
require("./app/routing/htmlRoutes")(app);

// Listener
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
