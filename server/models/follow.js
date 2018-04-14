'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Defines a database model

// An outline is created for the follow model
const FollowSchema = new Schema({
  user: {type: Schema.ObjectId, ref: 'User'},
  followed: {type: Schema.ObjectId, ref: 'User'}
});

// Export the follow model
module.exports = mongoose.model('Follow', FollowSchema);