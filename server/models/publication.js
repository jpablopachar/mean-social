const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Defines a database model

// An outline is created for the publication model
const PublicationSchema = new Schema({
  text: String,
  file: String,
  createdAt: String,
  user: { type: Schema.ObjectId, ref: 'User' },
});

// Export the publication model
module.exports = mongoose.model('Publication', PublicationSchema);
