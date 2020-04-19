const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connection succeeded.');
  })
  .catch((err) => {
    console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2));
  });;

require('./user.model');
require('./registrationRequest.model');