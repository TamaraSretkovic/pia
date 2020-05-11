require('./config/config');
require('./models/db');

const mongoose = require('mongoose');
const _ = require('lodash');
const User = mongoose.model('User');

var args = {companyId: String, mils: Number};

process.on("message", message => {
    console.log('updateCurir');
    
    args.companyId = message.companyId;
    args.mils = message.mils;
    console.log(args);
    
    timeOut();
})

var updateCourier = function() {
    console.log('update');

    User.findOne({ _id: args.companyId }).then(doc => {
        User.updateOne({ _id: args.companyId }, { courier: doc.courier + 1 }).then(success => {
            process.send({message: 'Successfully updated company user\' courier!'});
            process.exit();
        }).catch(err => {
            process.send({message: 'err updateone', error: err});
            process.exit();
        });
    }).catch(err => {
        process.send({message: 'err findteone', error: err});
    process.exit();

    });
}

var timeOut = function () {
    console.log('timer');
    setTimeout(updateCourier, args.mils);
}
