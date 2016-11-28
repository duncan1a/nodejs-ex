var express = require('express');
var router = express.Router();
var User = require(__dirname + '/../models/user').User;
var firebaseAdmin = require("firebase-admin");


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});


router.get('/auth/:token', function(req, res, next) {
	firebaseAdmin.auth().verifyIdToken(req.params.token)
		.then(function(decodedToken) {
			var uid = decodedToken.uid;
			// save the user
			User.findOneAndUpdate({
					"uid": decodedToken.uid
				}, decodedToken, { upsert: true }, function(err, u) {
					if (err) {
						cosole.log('Save user error', err);
					}
					console.log('u', u)
					res.send(u);
				})
				// ...
		}).catch(function(error) {
			// Handle error
			console.log(error)
		});
});


module.exports = router;
