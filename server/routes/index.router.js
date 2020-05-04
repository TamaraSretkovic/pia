
const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');
const ctrlRegisterRequest = require('../controllers/registrationRequest.controller');
const ctrlFarmer = require('../controllers/farmer.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/login', ctrlUser.authenticate);
router.post('/registration_request', ctrlRegisterRequest.registrationRequest);


// private routes

// registration requests
router.get('/registration_request',jwtHelper.verifyJwtToken, ctrlRegisterRequest.getRegistrationRequests);
router.delete('/registration_request/:id',jwtHelper.verifyJwtToken, ctrlRegisterRequest.deleteRegistrationRequests);
router.post('/register_user',jwtHelper.verifyJwtToken, ctrlUser.register);

// user menagment
router.get('/users',jwtHelper.verifyJwtToken, ctrlUser.getUsers);
router.delete('/users/:id',jwtHelper.verifyJwtToken, ctrlUser.deleteUser);
router.post('/users',jwtHelper.verifyJwtToken, ctrlUser.updateUser);

// user
router.post('/change_password',jwtHelper.verifyJwtToken, ctrlUser.changePassword);

// farmer
router.post('/nurserys', jwtHelper.verifyJwtToken, ctrlFarmer.getNurserys);
router.get('/nursery/:id', jwtHelper.verifyJwtToken, ctrlFarmer.getNursery);
router.post('/nursery/:id', jwtHelper.verifyJwtToken, ctrlFarmer.updateNursery);
router.post('/nursery', jwtHelper.verifyJwtToken, ctrlFarmer.addNursery);

router.post('/updateSeedling', jwtHelper.verifyJwtToken, ctrlFarmer.updateSeedling);
router.post('/updateNursery', jwtHelper.verifyJwtToken, ctrlFarmer.updateNursery);

router.get('/warehouse/:nurseryId', ctrlFarmer.getWarehouse);
router.post('/warehouse', ctrlFarmer.updateWarehouse);

module.exports = router;