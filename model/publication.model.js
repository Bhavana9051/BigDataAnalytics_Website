//publication.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

var publication = new Schema({
    username: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: [true, 'Provide Email.']
    },
    topic: {
        type: String
    },
    keywords: {
        type: String
    },
    url: {
       type: String,
       required: 'pdf url not provided.'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
 {
    timestamps: true
  });

// Custom validation for email
publication.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

publication.plugin(passportLocalMongoose);
module.exports = mongoose.model('Publication', publication);

