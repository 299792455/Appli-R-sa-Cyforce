const mongoose = require ('mongoose');

const userSchema = mongoose.Schema ({
    name: {type:String},
    bio: {type:String},
    profileImage: {type:String}, //url img
    socialLinks: [{type:String}],
});

module.exports = mongoose.model('User',userSchema );