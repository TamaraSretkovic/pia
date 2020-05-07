const mongoose = require('mongoose');
const _ = require('lodash');

const OrderRequest = mongoose.model('OrderRequest');

module.exports.getOrderRequests = (req, res, next) => {
    OrderRequest.find({ companyId: req.params.companyId }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log("error u get orderRequests");
        res.status(400).json({ message: err });
    });
}