var express = require('express');
var router = express.Router();
var database = require('../database');

//array for data from database
productList = [];
router.get('/', function (req, res, next) {
	var query = "SELECT * FROM products";
	database.query(query, function (error, data) {
		// productList=data;
		console.log(productList)
		if (error) {
			throw error;
		}
		else {

			res.render('home', { productList: data, login: req.session.loggedin, username: req.session.username });
			console.log(productList.length);
		}
		console.log(req.session.loggedin);
		console.log(req.session.username);

	});
});

router.get('/detail/:uid', function (req, res, next) {
	var uid = req.params.uid;
	var query = "SELECT * FROM products WHERE id = $(uid)";
	database.query(query, [req.params.uid], function (error, data) {

	});
})


module.exports = router;