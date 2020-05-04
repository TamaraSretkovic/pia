const mongoose = require('mongoose');

var warehouseShema = new mongoose.Schema({
    nurseryId: {
        type: String,
        required: true
    },
    seedlings: [],
    products: [],
    waitingSeedlings: [],
    waithingProducts: []

});

mongoose.model('Warehouse', warehouseShema, 'warehouses');
