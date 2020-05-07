const mongoose = require('mongoose');

var orderRequestShema = new mongoose.Schema({
    warehouseId: {
        type: String,
        required: true
    },
    companyId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    producer: {
        type: String
    },
    type: {
        type: String
    },
    quantity: {
        type: Number
    },
    status : {
        type: String
    }
});

mongoose.model('OrderRequest', orderRequestShema, 'orderRequests');
