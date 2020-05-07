const mongoose = require('mongoose');

var warehouseShema = new mongoose.Schema({
    nurseryId: {
        type: String,
        required: true
    },
    seedlings: [],
    products: []
});

mongoose.model('Warehouse', warehouseShema, 'warehouses');
