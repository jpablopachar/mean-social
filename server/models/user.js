'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Defines a database model

// An outline is created for the user model
const UserSchema = new Schema({
  name: String,
  surname: String,
  nick: String,
  email: String,
  password: String,
  role: String,
  image: String
});

// Export the user model
module.exports = mongoose.model('User', UserSchema);