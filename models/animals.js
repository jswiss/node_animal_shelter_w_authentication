var mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
	name: String,
	breed: String,
	dob: Date,
	gender: String,
	family: String,
	status: String,
	updatedAt: {type: Date, default: Date.now }
});

animalSchema.methods.availableActions = function(status) {
 var actions = {
    adopt: "adopted",
    abandon: "abadoned"
  };
  $.each(actions, function(x,y){
      if (y === status) delete actions[x];
      return actions;
  })
}

var Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;