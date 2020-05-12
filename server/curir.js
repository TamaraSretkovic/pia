require('./config/config');
require('./models/db');

const https = require('https');

const mongoose = require('mongoose');
const _ = require('lodash');
const User = mongoose.model('User');
const Nursery = mongoose.model('Nursery');
const OrderRequest = mongoose.model('OrderRequest');
const Warehouse = mongoose.model('Warehouse');
const CompanyProduct = mongoose.model('CompanyProduct');
const Seedling = mongoose.model('FarmerSeedling');
const Product = mongoose.model('Product');



var args = { companyId: String, nurseryId: String, orderId: String };
var key = process.env.KEY;
var locations = [[], []];

process.on("message", message => {
    console.log('process message');
    args.companyId = message.companyId;
    args.nurseryId = message.nurseryId;
    args.orderId = message.orderId;
    console.log(args);

    getTime();
})

var updateCourier = function () {
    console.log('update courier');

    User.updateOne({ _id: args.companyId }, { $inc: { courier: 1 } }).then(success => {
        OrderRequest.findOne({ _id: args.orderId }).then(order => {
            Warehouse.findOne({ nurseryId: order.nurseryId }).then(warehouse => {
                order.products.forEach(product => {
                    if (product.type === 'seed') {
                        var faund = false;
                        warehouse.seedlings.forEach(seed => {
                            if (seed.productId == product.productId) {
                                seed.quantity += Number(product.quantity);
                                faund = true;
                            }
                        });
                        if (!faund) {
                            const savedProdut = product;
                            CompanyProduct.findOne({ _id: savedProdut.productId }).then(doc => {
                                var seedling = new Seedling();
                                seedling.name = doc.name;
                                seedling.productId = doc._id;
                                seedling.producer = doc.producer;
                                seedling.fullTime = doc.power;
                                seedling.progress = 0;
                                seedling.quantity = Number(savedProdut.quantity);
                                seedling.status = 'full';
                                warehouse.seedlings.push({ seedling });
                            });
                        }
                    } else {
                        var faund = false;
                        warehouse.products.forEach(seed => {
                            if (seed.productId == product.productId) {
                                seed.quantity += Number(product.quantity);
                                faund = true;
                            }
                        });
                        if (!faund) {
                            const savedProdut = product;
                            CompanyProduct.findOne({ _id: savedProdut.productId }).then(doc => {
                                var productNew = new Product();
                                productNew.name = doc.name;
                                productNew.productId = doc._id;
                                productNew.producer = doc.producer;
                                productNew.fullTime = doc.power;
                                productNew.quantity = Number(savedProdut.quantity);
                                warehouse.products.push({ productNew });
                                
                            });
                        }
                    }
                });
                OrderRequest.deleteOne({ _id: args.orderId }).then(ress => {
                    Warehouse.updateOne({ _id: warehouse._id }, warehouse).then(success => {
                        console.log({ message: 'Sve proslo kako treba' });
                        process.exit();
                    }).catch(err => {
                        console.log("error u Warehouse update");
                        console.log(err);
                        process.exit();
                    });
                }).catch(err => {
                    console.log("error u Warehouse farmer");
                    console.log(err);
                    process.exit();
                });

            }).catch(err => {
                console.log("error u Warehouse farmer");
                console.log(err);
                process.exit();

            });
        }).catch(err => {
            console.log("error u deleteone orderReq");
            console.log(err);
            process.exit();

        });
    }).catch(err => {
        console.log({ message: 'err updateone', error: err });
        process.exit();
    });
}

var timeOut = function (mils) {
    console.log('timer: ' + mils);
    setTimeout(updateCourier, mils);
}

var getTime = function () {
    User.findOne({ _id: args.companyId }).then(company => {
        var companyPlace = company.place;
        Nursery.findOne({ _id: args.nurseryId }).then(nursery => {
            var nurseryPlace = nursery.place;
            // poziv apija i izracunavanje vremena
            console.log('usla u 2. findone');
            console.log(companyPlace);
            console.log(nurseryPlace);

            getLocation(companyPlace, (status, data) => {
                let mojekoo = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
                locations[0] = mojekoo;
                getLocation(nurseryPlace, (status, data) => {
                    let mojekoo = data.resourceSets[0].resources[0].geocodePoints[0].coordinates;
                    locations[1] = mojekoo;
                    getDistance((status, data) => {
                        console.log('travel duration in minutes: ' + data.resourceSets[0].resources[0].results[0].travelDuration);
                        var milis = data.resourceSets[0].resources[0].results[0].travelDuration * 60 * 1000;
                        timeOut(milis);
                    });
                });
            });

        }).catch(err => {
            console.log(err);
            console.log('curir find farmer');
        });
    }).catch(err => {
        console.log(err);
        console.log('curir find company');

    });
}

var getLocation = (place, onResult) => {
    let output = '';
    const req = https.get(`https://dev.virtualearth.net/REST/v1/Locations?locality=${place}&maxResults=1&key=${key}`, (res) => {
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            let obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
    });

    req.end();
};

var getDistance = (onResult) => {
    let output = '';
    const req = https.get(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${locations[0][0]},${locations[0][1]}&destinations=${locations[1][0]},${locations[1][1]}&travelMode=driving&key=${key}`, (res) => {
        res.on('data', (chunk) => {
            output += chunk;
        });
        res.on('end', () => {
            let obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
    });

    req.end();
};
