const mongoose = require('mongoose')

var Schema = mongoose.Schema;

// Message model is for storing each message sent from each user to a unique study session
// chatId: a unique id for the study session the message was sent to
// fromUser: the username of the user who sent the message
// body: The chat the user has sent
// sent: The date and time that the chat message was sent (useful for getting a chronological list of messages)
var messageSchema = new Schema({
    chatId: {type: String, required: true},
    fromUser: {type: String, required: true},
    body: {type: String, required: true},
    sent: {type: Date, default: Date.now, required: true},
})

module.exports = mongoose.model("message", messageSchema)
