var userObj = require('./../models/User');


// function to get all the users from the db
var getUsers = async function() {
    var usersList = [];
    await userObj.find().exec()
    .then((users) => {
        usersList = users;
        //console.log('users  list',usersList);
    })
    .catch((err) =>{
        console.log(err);
    });
 
    return usersList;
}


// function to get one user from db
var getUser = async function(userId) {
    var oneuser = await userObj.findOne({userId: userId}, function(err,user){
        oneuser = user;
        console.log('user is', oneuser);
    })
    .catch((err) => {
        console.log(err);
    });
    return oneuser;

}

module.exports.getUsers = getUsers;
module.exports.getUser = getUser;
