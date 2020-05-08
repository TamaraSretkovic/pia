const mongoose = require('mongoose');

var product = new mongoose.Schema({
    name: {
        type: String
    },
    producer: {
        type: String
    },
    power: {
        type: Number
    },
    type: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    companyId: {
        type: String
    },
    description: {
        type: String
    },
    comments: []
});

mongoose.model('CompanyProduct', product, 'companyProducts');


