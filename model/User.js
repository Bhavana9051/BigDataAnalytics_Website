// User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
},
studentId: {
  type: String,
  unique: true 
},
dob: {
  type: String
},
gender: {
  type: String,
  enum: ['male', 'female', 'other']
},
bloodGroup: {
  type: String,
  enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-','other']
},
yearOfGraduation: {
  type: Number
},
religion: {
  type : String
},
rollNo : {
  type: String
}
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)

