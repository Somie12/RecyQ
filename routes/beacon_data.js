var express = require('express');

var router = express.Router();

var database = require('../database');

// displaying beacon data on /beacon_data table

router.get("/", function(request, response, next){

	var query = "SELECT * FROM ble_beacons";

	database.query(query, function(error, data){

		if(error)
		{
			throw error; 
		}
		else
		{
			response.render('beacon_data', {title:'i- Flasher Beacon table', action:'list', beaconData:data, message:request.flash('success')});
		}

	});

});

//function to add data on /beacon_data/add route (adding data to data table)

router.get("/add", function(request, response, next){

	response.render("beacon_data", {title:'Insert Beacon Data', action:'add'});

});

//query to add data

router.post("/add_beacon_data", function(request, response, next){

	var uuid = request.body.uuid;

	var name = request.body.name;

	var location = request.body.location;

	var url = request.body.url;

	// check if the UUID already exists in the database
	var selectQuery = `
	SELECT * FROM ble_beacons WHERE uuid = "${uuid}"
	`;

	database.query(selectQuery, function(error, results){

		if(error)
		{
			throw error;
		}	
		else if(results.length > 0) // if UUID already exists, cancel the operation
		{
			request.flash('success', 'Beacon with this UUID already exists');
			response.redirect("/beacon_data");
		}
		else // if UUID does not exist, proceed with inserting data
		{
            var query = `
            INSERT INTO ble_beacons 
            (uuid, name, location, url) 
            VALUES ('${uuid}', '${name}', '${location}', '${url}')
            `;
        
            database.query(query, function(error, data){
        
                if(error)
                {
                    throw error;
                }	
                else
                {
                    request.flash('success', 'Beacon Data Inserted');
                    response.redirect("/beacon_data");
                }
        
            });
		}

	});

});

//function to edit existing data at /beacon_data/edit/:uuid (:uuid takes uuid from data table)

router.get("/edit/:uuid", function(request, response, next){

	var uuid = request.params.uuid;

	var query = `SELECT * FROM ble_beacons WHERE uuid = "${uuid}"`;

	database.query(query, function(error, data){

		response.render('beacon_data', {title: 'Edit Beacon Data', action:'edit', beaconData:data[0]});

	});

});

//query to edit existing data
router.post("/edit/:uuid", function(request, response, next){

	var uuid = request.params.uuid;

	var name = request.body.name;

	var location = request.body.location;

	var url = request.body.url;

	var status= request.body.status;

	var query = `
	UPDATE ble_beacons 
	SET name ='${name}', 
	location = '${location}', 
	url = '${url}',
	status = '${status}'
	WHERE uuid = '${uuid}'
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			response.redirect('/beacon_data');
		}

	});

});

//query to delete existing data at /beacon_data/edit/:uuid (:uuid takes uuid from data table)

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
			response.redirect("/beacon_data");
		}

	});

});

module.exports = router;