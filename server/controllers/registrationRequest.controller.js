const mongoose = require('mongoose');
const _ = require('lodash');
const https = require('https');
var request = require('request');
const secretKey = process.env.SECRET_KEY;

const RegistrationRequest = mongoose.model('RegistrationRequest');

module.exports.rechaptcha = (req, res, next) => {
    getRechaptchaResponse(req.body.request, (status, response) => {
        console.log('odgovorio sa');
        console.log(response);
        res.send(response.success);
    });
}

var getRechaptchaResponse = (clientReposnse, onResult) => {
    request.post(
        'https://www.google.com/recaptcha/api/siteverify',
        { json: { response: clientReposnse,
            secret: secretKey } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                onResult(body);
            }
        }
    );
};


module.exports.getRegistrationRequests = (req, res, next) => {
    RegistrationRequest.find().then(documents => {
        res.status(200).send(documents);
    });
}

module.exports.registrationRequest = (req, res, next) => {
    var registrationRequest = new RegistrationRequest();
    registrationRequest.fullName = req.body.fullName;
    registrationRequest.email = req.body.email;
    registrationRequest.password = req.body.password;
    registrationRequest.username = req.body.username;
    registrationRequest.date = req.body.date;
    registrationRequest.place = req.body.place;
    registrationRequest.phone = req.body.phone;
    registrationRequest.userType = req.body.userType;
    registrationRequest.save((err, doc) => {
        if (!err)
            res.send({ message: 'Successfully sent registration request!' });
        else {
            if (err.code == 11000)
                res.status(400).send({ message: 'Duplicate username found.' });
            else
                return next(err);
        }

    });
}

module.exports.deleteRegistrationRequests = (req, res, next) => {
    RegistrationRequest.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: "Request rejected" });
    })
        .catch(err => {
            console.log("error u deleteRegistrationRequests");
            res.status(400).json({ message: err });
        });
}