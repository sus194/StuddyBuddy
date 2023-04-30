const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// Chatroom model will keep track of everything needed for "study sessions"
// id: to keep track of the unique chat
// title: a user given title for the study session 
// users: an array of users that are in the study session
var chatroomSchema = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    type: {type: String, required: true},
    users: {type: [String], required: true},
    
    meetspot: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: false
        },
        coordinates: {
          type: [Number],
          required: false
        },
        required: false
    },

    meetTime: {type: String, required: false}
    
})

module.exports = mongoose.model("chatroom", chatroomSchema)
