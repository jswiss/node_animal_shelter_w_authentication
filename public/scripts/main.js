var Animal = Animal || {};
var View   = View   || {};

View = {
	initialize: function() {
		$('#create-animal-form').on('submit', function(e) {
			e.stopPropagation();
			e.preventDefault();
			Animal.create($(this).serialize())
			$(this).trigger("reset");
		})
	
	$('body').on("click", ".js-delete", function(e) {
		e.stopPropagation();
		e.preventDefault();
		Animal.destroy($(this).data('id'));
	})

	$('body').on("click", "js-update", function(e) {
		e.stopPropagation();
		e.preventDefault();
		Animal.updateStatus($(this).parent().attr("id"), $(this).data("action"));
	})

	}
}

Animal = {
	actions: {
		adopt: "adopted",
		abandon: "abandoned"
	},

	availableActions: function(status) {
		var availableActions = $.extend(true, {}, Animal.actions);
		$.each(availableActions, function(x, y) {
			if (y === status) delete availableActions[x];
		})
		return availableActions;
	},

	all: function() {
		this.request("/animals", "get").done(this.appendAnimals);
	},

	create: function(animal) {
		this.request("/animals", "post", animal).done(this.appendAnimals);
	},

	destroy: function(animalId) {
		console.log('euthanize!');
		this.request("/animals/" + animalId, "delete").done(function(response) {
			animalId = "#" + animalId;
			$(animalId).remove();
		})
	},

	updateStatus: function(animalId, action) {
		var status = this.actions[action];
		var data = {
			status: status
		};
		var availableAction = Object.keys(Animal.availableActions(status))[0];
		this.request('/animals/' + animalId, "put", data).done(function(response) {
			animalId = "#" + animalId;
			var toBeUpdated = $(animalId).children(".js-update");
			toBeUpdated.data("actions", availableAction);
			toBeUpdated.children().html(availableAction);
		})
	},

request: function(url, method, data) {
	return $.ajax({
		url: url,
		method: method,
		dataType: "json",
		data: data
	})
},

  appendAnimals: function (animals){
    $.each(animals, function(index, animal){
      var availableActions = $.extend(true, {}, Animal.actions);
      availableAction = Object.keys(Animal.availableActions(animal.status))[0];
      animalTemplate = "<tr id='" + animal._id + "'>";
      animalTemplate += "<td>" + animal.name + "</td>";
      animalTemplate += "<td>" + animal.breed + "</td>";
      animalTemplate += "<td>" + (new Date(animal.dob).toDateString()) + "</td>";
      animalTemplate += "<td>" + animal.gender + "</td>";
      animalTemplate += "<td>" + animal.family + "</td>";
      animalTemplate += "<td class='js-update' data-action=" + availableAction + "><a href='#'>" + availableAction + "</a></td>";
      animalTemplate += "<td><button class='js-delete' data-id=" + animal._id + ">bye bye!</button></td>";
      animalTemplate += "</tr>";
      $("#show-animals").append(animalTemplate);
    })
  }
}


$(document).on('ready', function() {
	Animal.all();
	View.initialize();
})