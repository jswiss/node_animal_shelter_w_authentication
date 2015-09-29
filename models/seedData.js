var seeder = require('mongoose-seed');

	// Connect to MongoDB via Mongoose 
seeder.connect('mongodb://localhost/animal-shelter', function() {
    
    // Load Mongoose models 
    seeder.loadModels([
        './models/animals.js'
    ]);
 
    // Clear specified collections 
    seeder.clearModels(['Animal'], function() {
 
        // Callback to populate DB once collections have been cleared 
        seeder.populateModels(data);
 
    });
});

var data = [
    { 
        'model': 'Animal',
        'documents': [
            {
                'name': 'Fido',
                'breed': 'Terrier'
            },
            {
                'name': 'Gene',
                'breed': 'Tabby'
            }
        ]
    }
];  
