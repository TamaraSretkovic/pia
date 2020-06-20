const mongoose = require('mongoose');
var nodemailer = require('nodemailer');

const Nursery = mongoose.model('Nursery');
const User = mongoose.model('User');

let counter = 0; // count hours

let update = function () {
    counter++;
    Nursery.find().then(doc => {
        doc.forEach(nursery => {
            nursery.temp = nursery.temp - 0.5;
            nursery.water = (nursery.water - 1) > 0 ? nursery.water - 1 : 0;
            if(counter === 24){
                nursery.seedlings.forEach(seed => {
                    if (seed.status === 'full' && seed.progress < seed.fullTime) {
                        seed.progress = seed.progress + 1;
                    }
                    if(seed.status === 'notReady'){
                        seed.status = 'empty';
                    }
                });
            }
            if(nursery.temp < 12 || nursery.water < 75) {
                sendMail(nursery.farmerId);
            }
            Nursery.updateOne({_id: nursery._id}, nursery).then(ress => {
            }).catch(err => {
                console.log("error u update nurserys u updater-u");
                console.log(err);
            });
        });

    })
        .catch(err => {
            console.log("error u get nurserys u updater-u");
            console.log(err);
        });

    if(counter === 24){
        counter = 0;
    }
}

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'sretkovictamara@gmail.com',
      pass: 'jxggteumtliefxow'
    }
});

let sendMail = function(farmerId){
    console.log('sedn mail to ' + farmerId);
    User.findOne({_id: farmerId}).then(doc => {
        var mailOptions = {
            from: 'sretkovictamara@gmail.com',
            to: doc.email,
            subject: 'Nursery',
            text: 'The nursery requires maintenance! Please check your ' + 'nursery.'
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }).catch(err => {
        console.log("error u get user u sendmail-u");
        console.log(err);
    });
}


setInterval(update, 3600000); // 1h