var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create user schema
var userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    // userFirstName: {
    //     type: String
    //     // required: true
    // },

    // userLastName: {
    //     type: String
    //     //required: true
    // },

    userEmail: {
        type: String,
        required: true
    },

    userPassword: {
        type: String,
        required: true
    }
});

var User = mongoose.model('User', userSchema,'user');

module.exports = User;
