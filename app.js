var express        = require('express');
var path           = require('path');
var debug          = require("debug");
var logger         = require('morgan');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app            = express();
var router         = express.Router();

var Animal         = require('./models/animals')

var moongoose = require('mongoose');
moongoose.connect('mongodb://localhost/animal-shelter');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json());

//sets static page -- magic line of code
app.use(express.static(__dirname));

//root path
app.get('/', function(req, res){
  res.render(path.join(__dirname + '/views/index.ejs'));
})

//animals index path
app.get('/animals', function(req, res) {
  // res.sendFile(path.join(__dirname + './views/index.html'));
  
  Animal.find({}, function(err, animals) {
  	if (err) console.log(err);
  	res.json(animals);
  })
})

//create
app.post('/animals', function(req, res) {
	console.log(req.body);
  var animal = Animal({
  	name: req.body.name,
  	breed: req.body.breed,
  	dob: req.body.dob,
  	gender: req.body.gender,
  	family: req.body.family,
  	status: req.body.status,
  	createdAt: req.body.createdAt
  	})

  animal.save(function(err, createdAnimal) {
  	if (err) console.log(err);
  	console.log('Animal has been added');
  	res.json([createdAnimal])
  })
})

app.put("/animals/:id", function(req, res) {
	console.log(req.body.status);
	Animal.update({_id: req.params.id}, {status: req.body.status}, function(err, updatedAnimal) {
			if (err) console.log(err);
			res.json(updatedAnimal);
	})
})

//Delete
app.delete("/animals/:id", function (req, res) {
	console.log(req.params.id);
	Animal.remove({_id: req.params.id}, function(err, removedAnimal) {
		console.log("Delete animal");
		if (err) console.log(err);
		res.json(removedAnimal);
	})
})

app.use('/animals', router);

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.listen(3000)