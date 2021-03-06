const mongoose = require('mongoose');

var seedling = new mongoose.Schema({
    name: {
        type: String
    },
    productId: {
        type: String
    },
    producer: {
        type: String
    },
    fullTime: {
        type: Number
    },
    progress: {
        type: Number
    },
    quantity: {
        type: Number
    },
    status: {
        type: String
    }
});

mongoose.model('FarmerSeedling', seedling, 'farmerSeedlings');


