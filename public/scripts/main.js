var Animal = Animal || {};
var View   = View   || {};

View = {
	initialize: function() {
		$('#create-animal-form').on('submit', function(e) {
			e.stopPropagation();
			e.preventDefault();
			Animal.create($(this).serialize())
			.done($(this).trigger("reset"));
		})
	
	$('body').on("click", ".js-delete", function(e) {
		e.stopPropagation();
		e.preventDefault();
		Animal.kill($(this).data('id'));
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
	}

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
		}
		var availableAction = Object.keys(Animal.availableActions(status))[0];
		this.request('/animals/' + animalId, "put", data).done(function(response) {
			animalId = "#" + animalId;
			var toBeUpdated = $(animalId).children(".js-update");
			toBeUpdated.data("actions", availableAction);
			toBeUpdated.children().html(availableAction);
		})
	}
}

function request(url, method, data) {
	return $.ajax({
		url: url,
		method: method,
		dataType: "json",
		data: data
	})
}

appendAnimals: function(animals) {
	$.each(animals, function(index, animal) {
		animalTemplate = '<h1 class="animal-name">' + animal.name + '</h1>';
		animalTemplate += '<ul class="animal-details">';
		animalTemplate += '<li class="breed">' + animal.breed + '</li>';
		animalTemplate += '<li class="dob">' + animal.dob + '</li>';
		animalTemplate += '<li class="gender">' + animal.gender + '</li>';
		animalTemplate += '<li class="family">' + animal.family + '</li>';
		animalTemplate += '</ul>';

   $('#show-animals').append(animalTemplate);
    })
    // .done(function() {
    //   $('#create-animal').trigger('reset');
    // })
	})
}


$(document).on('ready', function() {
	Animal.all();
	View.initialize();
})