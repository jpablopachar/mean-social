const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Defines a database model

// An outline is created for the message model
const MessageSchema = new Schema({
  text: String,
  viewed: String,
  created_at: String,
  emitter: { type: Schema.ObjectId, ref: 'User' },
  receiver: { type: Schema.ObjectId, ref: 'User' },
});

// Export the message model
module.exports = mongoose.model('Message', MessageSchema);
