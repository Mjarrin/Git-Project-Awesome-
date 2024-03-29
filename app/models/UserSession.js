const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
    // document #

    userId : {
        type : String,
        default : ""
    },

    username : {
        type : String,
        default : ""
    },

    timestamp : {
        type : Date,
        default : Date.now()
    },

    isDeleted : {
        type : Boolean,
        default : false

    }
})


const UserSession = mongoose.model('UserSession', UserSessionSchema);

module.exports = UserSession;