const mongoose = require('mongoose');
const _ = require('lodash');

const OrderRequest = mongoose.model('OrderRequest');
const Product = mongoose.model('CompanyProduct');

module.exports.getOrders = (req, res, next) => {
    OrderRequest.find({ companyId: req.params.companyId }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log("error u get orderRequests");
        res.status(400).json({ message: err });
    });
}

module.exports.rejectOrder = (req, res, next) => {
    deleteOne({ _id: req.params.orderId }).then(succsess => {
        res.status(200).json({ message: "Order successfully rejected!" });
    }).catch(err => {
        console.log("error u rejectOrder delete");
        res.status(400).json({ message: err });
    });
}

module.exports.acceptOrder = (req, res, next) => {
    // TO DO
}



module.exports.addProduct = (req, res, next) => {
    var product = new Product();
    product.companyId = req.body.companyId;
    product.producer = req.body.producer;
    product.type = req.body.type;
    product.name = req.body.name;
    product.quantity = req.body.quantity;
    product.price = req.body.price;
    product.power = req.body.power;
    product.description = req.body.description;

    product.save((err, doc) => {
        if (!err)
            res.send({ message: 'Successfully added new product!' });
        else {
            console.log("error u add product");
            res.status(400).json({ message: err });
        }
    })
}

module.exports.getProducts = (req, res, next) => {
    Product.find({ companyId: req.params.companyId }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log("error u get orderRequests");
        res.status(400).json({ message: err });
    });
}

module.exports.updateProduct = (req, res, next) => {
    Product.findOne({ _id: req.params.productId }).then(product => {
        product.quantity = req.body.quantity;
        product.description = req.body.description;
        product.price = req.body.price;

        Product.updateOne({ _id: req.params.productId }, product).then(success => {
            res.send({ message: 'Successfully updated product!' });
        }).catch(err => {
            console.log('error u update product, updateone');
            res.status(400).json({ message: err });
        });
    }).catch(err => {
        console.log("error u update product");
        res.status(400).json({ message: err });
    });
}


module.exports.deleteProduct = (req, res, next) => {
    Product.deleteOne({ _id: req.params.productId }).then(succsess => {
        res.status(200).json({ message: "Successfully deleted Product!" });
    }).catch(err => {
        console.log("error u deleteProduct");
        res.status(400).json({ message: err });
    });
}
