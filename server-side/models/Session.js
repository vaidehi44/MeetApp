const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const messageSchema = new Schema({
    author: {
        type: String
    },
    message: {
        type: String
    }
});

const sessionInfoSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    session_title: {
        type: String,
        default: "Untitled Session"
    },
    chats: [messageSchema],
    notes: {
        type: Array
    }
}, { timestamps: true });


const Session = mongoose.model('Session', sessionInfoSchema);
module.exports = Session;