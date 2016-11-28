var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	email: String,
	name: String,
	email_verified: Boolean,
	picture: String,
	sub: String,
	uid: String,
	user_id: String,
	exp: Number,
	modified: {
		type: Date,
		default: Date.now
	}
}, {
	toJSON: {
		virtuals: true
	}
});

UserSchema.pre('save', function(next) {
	var now = new Date();
	this.modified = now;
	console.log('pre save');
	next();
});

UserSchema.virtual("created").get(function() {
	return this._id.getTimestamp()
});



var User = mongoose.model('User', UserSchema);
User.ObjectId = mongoose.Types.ObjectId;
module.exports.User = User;
