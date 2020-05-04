const mongoose = require('mongoose');

var productShema = new mongoose.Schema({
    name: {
        type: String
    },
    producer: {
        type: String
    },
    power: {
        type: Number
    },
    quantity: {
        type: Number
    }
});

mongoose.model('Product', productShema, 'products');


