const mongoose = require('mongoose');

var soldOrderShema = new mongoose.Schema({
    companyId: {
        type: String
    },
    date: {
        type: Date
    },
});

mongoose.model('SoldOrder', soldOrderShema, 'soldOrders');
