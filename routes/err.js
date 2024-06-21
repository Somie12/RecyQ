var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  //render error page
  res.render("err")
});

module.exports = router; 