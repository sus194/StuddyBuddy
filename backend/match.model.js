const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// Only two required fields
// userSent is the user who sent the request
// userTo is the user who received the request
// Users are buddies when they each have an entry
// for each other in the database
var matchSchema = new Schema({
    userSent: {type: String, required: true},
    userTo: {type: String, required: true},
})

module.exports = mongoose.model("match", matchSchema)
