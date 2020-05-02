const mongoose = require('mongoose');
const _ = require('lodash');

const Nursery = mongoose.model('Nursery');
const Seedling = mongoose.model('Seedling');

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

module.exports.updateNursery = (req, res, next) => {
    // TO DO
    // Nursery.find({_id: req.params.id}).then(result => {
    //     res.status(200).send(result);
    // })
    //     .catch(err => {
    //         console.log("error u get nursery");
    //         res.status(400).json({ message: err });
    //     });
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
        seedling.date = new Date();
        nursery.seedlings.push(seedling);
    };

    nursery.save((err, doc) => {
        if (!err)
            res.send({ message: 'Successfully added new nursery!' });
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
    Nursery.updateOne({ _id: req.body.id }, {temp: req.body.temp, water: req.body.water}).then(success => {
        res.send({ message: 'Successfully saved nursery changes!' });
    }).catch(err => {
        console.log('error u update nursery');
        res.status(400).json({ message: err });
    });
}