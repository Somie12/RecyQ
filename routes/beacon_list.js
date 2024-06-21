var express = require('express');

var router = express.Router();

var database = require('../database');

const username = "bhaukal";

// displaying beacon data on /beacon_list table

router.get("/", function(request, response, next){

	var query = "SELECT * FROM ble_beacons";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('beacon_list', {title:'i- Flasher Beacon table', action:'list', beaconList:data, message:request.flash('success')});
		}

	});

});

//query to delete existing data at /beacon_list/edit/:uuid (:uuid takes uuid from data table)

router.get('/delete/:uuid', function(request, response, next){

	var uuid = request.params.uuid; 

	var query = `
	DELETE FROM ble_beacons WHERE uuid = "${uuid}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Beacon Data Deleted');
			response.redirect("/beacon_list");
		}

	});

});

module.exports = router;