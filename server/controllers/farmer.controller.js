const mongoose = require('mongoose');
const _ = require('lodash');

const Nursery = mongoose.model('Nursery');
const Seedling = mongoose.model('Seedling');
const Warehouse = mongoose.model('Warehouse');
const Product = mongoose.model('Product');
const OrderRequest = mongoose.model('OrderRequest');

module.exports.getNurserys = (req, res, next) => {
    Nursery.find({ farmerId: req.body.id }).then(result => {
        res.status(200).send(result);
    })
        .catch(err => {
            console.log("error u get nurserys");
            res.status(400).json({ message: err });
        });
};

module.exports.getNursery = (req, res, next) => {
    Nursery.findOne({ _id: req.params.id }).then(result => {
        res.status(200).send(result);
    })
        .catch(err => {
            console.log("error u get nursery");
            res.status(400).json({ message: err });
        });
};

module.exports.addNursery = (req, res, next) => {
    var nursery = new Nursery();
    nursery.farmerId = req.body.id;
    nursery.name = req.body.name;
    nursery.place = req.body.place;
    nursery.temp = 18;
    nursery.water = 200;
    nursery.numSeedlings = 0;
    nursery.width = req.body.width;
    nursery.height = req.body.height;
    for (var i = 0; i < req.body.width * req.body.height; i++) {
        var seedling = new Seedling();
        seedling.name = '';
        seedling.producer = '';
        seedling.fullTime = '';
        seedling.progress = '';
        seedling.status = 'empty';
        nursery.seedlings.push(seedling);
    };

    nursery.save((err, doc) => {
        if (!err) {
            var warehouse = new Warehouse();
            warehouse.nurseryId = doc._id;
            warehouse.save((err, doc) => {
                if (!err)
                    res.send({ message: 'Successfully added new nursery!' });
                else {
                    console.log("error u add nursery, add warehous");
                    res.status(400).json({ message: err });
                }
            });
        }
        else {
            console.log("error u add nursery");
            res.status(400).json({ message: err });
        }
    });
};

module.exports.updateSeedling = (req, res, next) => {
    Nursery.findOne({ _id: req.body.id }).then(nursery => {
        const id = parseInt(req.body.seedling.id);
        nursery.seedlings[id].name = req.body.seedling.name;
        nursery.seedlings[id].producer = req.body.seedling.producer;
        nursery.seedlings[id].fullTime = req.body.seedling.fullTime;
        nursery.seedlings[id].progress = req.body.seedling.progress;
        nursery.seedlings[id].quantity = req.body.seedling.quantity;
        nursery.seedlings[id].status = req.body.seedling.status;

        if (req.body.seedling.status === 'full') {
            nursery.numSeedlings++;

            Nursery.updateOne({ _id: req.body.id }, nursery).then(success => {
                res.send({ message: 'Successfully added new seedling!' });
            }).catch(err => {
                console.log('error u update seedling, updateone');
                res.status(400).json({ message: err });
            });
        } else {
            nursery.numSeedlings--;

            Nursery.updateOne({ _id: req.body.id }, nursery).then(success => {
                res.send({ message: 'Successfully translated seedling!' });

            }).catch(err => {
                console.log('error u update seedling, updateone');
                res.status(400).json({ message: err });
            });
        }
    })
        .catch(err => {
            console.log("error u update seedling");
            res.status(400).json({ message: err });
        });
};


module.exports.updateNursery = (req, res, next) => {
    Nursery.updateOne({ _id: req.body.id }, { temp: req.body.temp, water: req.body.water }).then(success => {
        res.send({ message: 'Successfully saved nursery changes!' });
    }).catch(err => {
        console.log('error u update nursery');
        res.status(400).json({ message: err });
    });
}

module.exports.getWarehouse = (req, res, next) => {
    Warehouse.findOne({ nurseryId: req.params.nurseryId }).then(result => {
        res.status(200).send(result);
    })
        .catch(err => {
            console.log("error u get warehous");
            res.status(400).json({ message: err });
        });
};

module.exports.updateWarehouse = (req, res, next) => {

    Warehouse.findOne({ nurseryId: req.body.id }).then(warehouse => {
        warehouse.seedlings = [];
        req.body.seedlings.forEach(seed => {
            const seedling = new Seedling();
            seedling.name = seed.name;
            seedling.producer = seed.producer;
            seedling.fullTime = seed.fullTime;
            seedling.progress = seed.progress;
            seedling.quantity = seed.quantity;
            seedling.status = seed.status;
            warehouse.seedlings.push(seedling);
        });

        warehouse.products = [];
        req.body.products.forEach(product => {
            const prod = new Product();
            prod.name = product.name;
            prod.producer = product.producer;
            prod.power = product.power;
            prod.quantity = product.quantity;
            warehouse.products.push(prod);
        });
        Warehouse.updateOne({ _id: warehouse._id }, warehouse).then(success => {
            res.send({ message: 'Successfully updated warehouse!' });

        }).catch(err => {
            console.log('error u update warehouse, updateone');
            res.status(400).json({ message: err });
        });
    })
        .catch(err => {
            console.log("error u update warehous");
            res.status(400).json({ message: err });
        });
};

module.exports.getOrderRequests = (req, res, next) => {

    OrderRequest.find({ warehouseId: req.params.warehouseId }).then(doc => {
        res.status(200).send(doc);
    }).catch(err => {
        console.log("error u get orderRequests");
        res.status(400).json({ message: err });
    });
}

module.exports.calncelOrderRequest = (req, res, next) => {
    OrderRequest.findOne({_id: req.params.orderId})
    .then(doc => {
        if(doc.status.valueOf()=== new String("pending").valueOf()){
            OrderRequest.deleteOne({_id: req.params.orderId}).then(succsess => {
                res.status(200).json({ message: "Order successfully canceled!" });
            }).catch(err => {
                console.log("error u cancelRequest delete");
                res.status(400).json({ message: err });
            });
        } else {
            res.status(400).json({ message: "Order is delivering, please wait!" });
        }
    })
        .catch(err => {
            console.log("error u cancelRequest find");
            res.status(400).json({ message: err });
        });
}

module.exports.addOrderRequest = (req, res, next) => {
    var order = new OrderRequest();
    order.warehouseId = req.body.warehouseId;
    order.companyId = req.body.companyId;
    order.orderId = req.body.orderId;
    order.producer = req.body.producer;
    order.type = req.body.type;
    order.name = req.body.name;
    order.quantity = req.body.quantity;
    order.status = "pending";

    order.save((err, doc) => {
        if (!err)
            res.send({ message: 'Successfully added new order Request!' });
        else {
            console.log("error u add order requests");
            res.status(400).json({ message: err });
        }
    })
}