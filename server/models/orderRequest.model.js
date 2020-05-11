const mongoose = require('mongoose');

var orderRequestShema = new mongoose.Schema({
    warehouseId: {
        type: String,
    },
    farmerUsername: {
        type: String,
    },
    companyId: {
        type: String
    },
    producer: {
        type: String
    },
    products: [],
    date: {
        type: Date
    },
    status: {
        type: String
    }
});

var orderProductsShema = new mongoose.Schema({
    productId: {
        type: String
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    quantity: {
        type: Number
    }
});

mongoose.model('OrderRequest', orderRequestShema, 'orderRequests');
mongoose.model('OrderProduct', orderProductsShema, 'orderProducts');
