var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/new_card', function(req, res) {
	var data = require(__dirname + '/../config/json/nba_data.json');
	// make categories object
	var categories = {};
	var card = {};

	data.forEach(function(item) {
		if (!categories[item.category]) {
			categories[item.category] = [];
			card[item.category] = [];
		}
		categories[item.category].push(item);
	});
	// get random 3 from each category

	Object.keys(categories).forEach(function(category) {
		categories[category].sort(function() {
			return 0.5 - Math.random();
		});
		card[category].push(categories[category][0]);
		card[category].push(categories[category][1]);
		card[category].push(categories[category][2]);
	});



	res.send(card);
});


module.exports = router;
