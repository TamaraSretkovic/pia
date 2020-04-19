const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const User = mongoose.model('User');
const RegistrationRequest = mongoose.model('RegistrationRequest');

module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.username = req.body.username;
    user.date = req.body.date;
    user.place = req.body.place;
    user.phone = req.body.phone;
    user.userType = req.body.userType;
    user.save((err, doc) => {
        if (!err) {
            if (req.body.id !== undefined) {
                RegistrationRequest.deleteOne({ _id: req.body.id }).then(result => {
                    res.status(200).json({ message: "Successfully registrated user!" });
                })
                    .catch(err => {
                        console.log("error u register");
                        res.status(400).json({ message: err });
                    });
            }
            res.status(200).send({ message: "Successfully registrated user!" });
        }
        else {
            if (err.code == 11000)
                res.status(422).send({ message: 'Duplicate username found.' });
            else
                return next(err);
        }
    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt(), "userType": user.userType });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.getUsers = (req, res, next) => {
    User.find().then(documents => {
        res.status(200).send(documents);
    });
}

module.exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({ message: "User deleted!" });
    })
        .catch(err => {
            console.log("error u deleteUser");
            res.status(400).json({ message: err });
        });
}

module.exports.updateUser = (req, res, next) => {
    var user = {
        fullName: req.body.fullName,
        email: req.body.email,
        date: req.body.date,
        place: req.body.place,
        phone: null
    }
    if (req.body.phone) {
        user.phone = req.body.phone;
    }

    User.updateOne({ username: req.body.username }, user).then(documents => {
        res.status(200).json({
            message: 'Successfully apdated user!'
        });
    });
}

module.exports.changePassword = (req, res, next) => {
    var newPassword = req.body.password;
    var newSalt = '';
    User.findOne({ username: req.body.username }).then(user => {
        if (!user.verifyPassword(req.body.oldPassword)) {
            res.status(400).json({
                message: 'Old password is not correct!'
            });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    newPassword = hash;
                    newSalt = salt;
                    User.updateOne({ username: req.body.username }, { password: newPassword, saltSecret: newSalt }).then(documents => {
                        res.status(200).json({
                            message: 'Successfully apdated user!'
                        });
                    });
                });
            });
        }
    })
}