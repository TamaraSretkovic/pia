const mongoose = require('mongoose');
const _ = require('lodash');
const { fork } = require("child_process");

const OrderRequest = mongoose.model('OrderRequest');
const Product = mongoose.model('CompanyProduct');
const SoldOrder = mongoose.model('SoldOrder');
const User = mongoose.model('User');

module.exports.getOrders = (req, res, next) => {
    OrderRequest.find({ companyId: req.params.companyId }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log("error u get orderRequests");
        res.status(400).json({ message: err });
    });
}

module.exports.rejectOrder = (req, res, next) => {
    OrderRequest.deleteOne({ _id: req.params.orderId }).then(succsess => {
        res.status(200).json({ message: "Order successfully rejected!" });
    }).catch(err => {
        console.log("error u rejectOrder delete");
        res.status(400).json({ message: err });
    });
}

module.exports.acceptOrder = (req, res, next) => {
    OrderRequest.findOne({ _id: req.body.orderId }).then(orderRequest => {
        User.findOne({ _id: orderRequest.companyId }).then(company => {
            if (company.courier > 0) {
                Product.find({ companyId: company._id }).then(companyProducts => {
                    orderRequest.products.forEach(product => {
                        companyProducts.forEach(cp => {
                            if (cp._id == product.productId) {
                                if ((cp.quantity - product.quantity) < 0) {
                                    res.status(400).json({ message: 'Not enough items for this order!' });
                                }
                            }
                        });
                    }); // ima svih artikala
                    orderRequest.products.forEach(product => {
                        Product.updateOne({ _id: product.productId }, { $inc: { quantity: - product.quantity } }).then().catch(err => {
                            console.log("error u update company product");
                            console.log(err);
                            res.status(400).json({ message: err });
                        });
                    });
                    company.courier = company.courier - 1;
                    User.updateOne({ _id: company._id }, company).then(ress => {
                        var sold = new SoldOrder();
                        sold.companyId = orderRequest.companyId;
                        sold.date = orderRequest.date;
                        var companyIdSaved = orderRequest.companyId;
                        var nurseryIdSaved = orderRequest.nurseryId;

                        sold.save().then(ress => {
                            // TO DO POKRENI PROCES
                            const childProcess = fork('./curir.js');
                            childProcess.send({ "companyId": companyIdSaved, "nurseryId": nurseryIdSaved, "orderId": req.body.orderId});
                            
                           OrderRequest.updateOne({ _id: req.body.orderId }, {status: 'delivering'}).then(ress => {
                                res.status(200).json({ message: 'Courier is on the way!' });
                            }).catch(err => {
                                console.log("error u deleteone orderReq");
                                console.log(err);
                                res.status(400).json({ message: err });
                            });
                        }).catch(err => {
                            console.log("error u save u --");
                            console.log(err);

                            res.status(400).json({ message: err });
                        });
                    }).catch(err => {
                        console.log("error u updateone user --");
                        console.log(err);
                        res.status(400).json({ message: err });
                    });
                }).catch(err => {
                    console.log('ko zna koji err');
                    res.status(400).json({ message: err });
                });

            } else {
                OrderRequest.updateOne({ _id: req.body.orderId }, { status: 'important' }).then(succsess => {
                    res.status(400).json({ message: 'No avilable couriers, try again later!' });
                }).catch(err => {
                    console.log("error u updateone orderrequest");
                    console.log(err);

                    res.status(400).json({ message: err });
                });
            }
        }).catch();
    }).catch();
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


module.exports.getSoldItemsPerDay = (req, res, next) => {
    SoldOrder.find({ companyId: req.params.companyId }).then(items => {
        var today = Date.now(); // milisekunde        
        var dayBefore30days = today - (1000 * 30 * 24 * 60 * 60); // milis dan sat minut sekund

        var numberOfSoldItemsPerDAy = {
            dates: getDates(dayBefore30days),
            items: Array(30).fill(0)
        }

        items.forEach(item => {
            const position = getPosition(item.date, dayBefore30days);
            if (position > -1) {
                numberOfSoldItemsPerDAy.items[position]++;
            }
        });

        res.status(200).send(numberOfSoldItemsPerDAy);
    }).catch(err => {
        console.log("error u get sold items");
        res.status(400).json({ message: err });
    });
}


var getDates = function (dayBefore30days) {
    var step = 1000 * 24 * 60 * 60;
    var dates = Array(30);

    for (var i = 0; i < 30; i++) {
        dates[i] = new Date(dayBefore30days + i * step);
    }
    return dates;
};

var getPosition = function (checkDate, before30Days) {
    var step = 1000 * 24 * 60 * 60;

    var position = (checkDate.getTime() - before30Days) / step;
    position = position - (position % 1); // ako se dobije ne-ceo broj

    if (position > 30 || position < 0) return -1;
    return position;
}