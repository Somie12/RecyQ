var express = require('express');
var router = express.Router();


router.get('/sell', function(req, res, next) {
  res.render('/sell');
});

module.exports = router;