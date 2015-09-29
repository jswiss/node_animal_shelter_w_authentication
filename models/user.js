var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var userSchema = new mongoose.Schema({
	name: String,
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true}
})


userSchema.pre('save', function(next) {
	var user = this;

	//Only has the password if it is new or has been modified
	if(!user.isModified('password')) return next()

	//Generate a salt with a salt_work_factor of 5
	bcrypt.genSalt(5, function(err, salt){
		if (err) return next(err)

		//Has the password with our salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err)

			//Override the plaintext password with the hashed version
			user.password = hash
			next()
		})
	})
})

userSchema.methods.authenticate = function(password, callback) {
	// 'compare' is a bcrypt function that will return a boolean
	bcrypt.compare(password, this.password, function(err, isMatch) {
		callback(null, isMatch)
	})
}

var User = mongoose.model('User', userSchema);

module.exports = User;
