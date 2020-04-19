const mongoose = require('mongoose');

var registrationRequestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty'
    },
    username: {
        type: String,
        required: 'Username can\'t be empty',
        unique: true
    },
    password: {
        type: String,
        required: 'Password can\'t be empty'
    },
    date: {
        type: Date,
        required: 'Date can\'t be empty'
    },
    place: {
        type: String,
        required: 'Place can\'t be empty'
    },
    phone: {
        type: String
    },
    userType: {
        type: String,
        required: 'User type can\'t be empty'
    },
    saltSecret: String
});

// Custom validation for email
registrationRequestSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Custom validation for password
registrationRequestSchema.path('password').validate((val) => {
    passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-z].[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(val);
}, 'Invalid password.');


mongoose.model('RegistrationRequest', registrationRequestSchema, 'registrationRequests');