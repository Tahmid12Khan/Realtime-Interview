const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    roomName: String,
    problemId: {
        type: String,
        required: true
    },
    setterName: String,
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', RoomSchema);