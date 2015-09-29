var mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
	name: String,
	breed: String,
	dob: Date,
	gender: String,
	family: String,
	status: String,
	createdAt: Date,
	updatedAt: {type: Date, default: Date.now }
});

var Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;