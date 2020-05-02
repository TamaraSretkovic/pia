const mongoose = require('mongoose');

const Seedling = mongoose.model('Seedling');

var nurserySchema = new mongoose.Schema({
    farmerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    place: {
        type: String
    },
    temp: {
        type: Number,
        required: true
    },
    water: {
        type: Number,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    seedlings: [],
    numSeedlings: {
        type: Number
    }

});

mongoose.model('Nursery', nurserySchema, 'nurserys');
