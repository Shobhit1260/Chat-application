const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["User", "Group"],
  },
  message: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Message', messageSchema);
