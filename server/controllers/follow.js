/* const bcrypt = require('bcrypt-nodejs');
const fs = require('fs');
const path = require('path'); */

// const User = require('../models/user');
const Follow = require('../models/follow');
// const jwt = require('../services/jwt');

// Method to follow a user
function saveFollow(req, res) {
  const follow = new Follow();
  const params = req.body;

  // User ID that is obtained through logging
  follow.user = req.user.sub;
  follow.followed = params.followed;

  // Save the tracking data
  follow.save((err, followStored) => {
    if (err) return res.status(500).send({ message: 'Error saving tracking' });
    console.log(followStored);

    if (!followStored) return res.status(404).send({ message: 'Tracking has not been saved' });

    return res.status(200).send({ follow: followStored });
  });
}

// Method that lets you stop following a user
function deleteFollow(req, res) {
  const userId = req.user.sub;
  const followId = req.params.id;

  // Find the records that have as user: userId and that have followed: followId and are deleted
  Follow.find({ 'user': userId, 'followed': followId }).remove(err => {
    if (err) return res.status(500).send({ message: 'Failed to stop following' });

    return res.status(200).send({ message: 'The follow has been removed' });
  });
}

// List the users that we follow in a paged form
function getFollowingUsers(req, res) {
  let userId = req.user.sub; // Get the userId of the logged in user
  let page = 1;
  const itemsPerPage = 4; // List 4 users per page

  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  // If we get page by url
  if (req.params.page) {
    page = req.params.page;
  } else {
    page = req.params.id;
  }

  // Find all the follows where the user is following another user
  // Populates the data indicating the field to be replaced and performs paging
  Follow.find({ user: userId }).populate({ path: 'followed' }).paginate(page, itemsPerPage, (err, follows, total) => {
    if (err) return res.status(505).send({ message: 'Error in the request' });

    if (!follows) return res.status(404).send({ message: 'You are not following any user' });

    // followUserIds(req.user.sub).then((value) => {
      return res.status(200).send({
        follows,
        // users_following: value.following,
        // users_follow_me: value.followed,
        total: total,
        pages: Math.ceil(total / itemsPerPage), // Calculate the number of pages to present data
      });
    // });
  });
}

// List the users that follow us in a paged form
function getFollowedUsers(req, res) {
  let userId = req.user.sub; // Id of the logged in user
  let page = 1;
  const itemsPerPage = 4;

  // If we get the parameters by url
  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  if (req.params.page) {
    page = req.params.page;
  } else {
    page = req.params.id;
  }

  // We find in all the following fields the artibuto of a userId
  // we populate the data and present it in a paged form
  Follow.find({ followed: userId }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
    if (err) return res.status(505).send({ message: 'Error in the request' });

    if (!follows) return res.status(404).send({ message: 'No user follows you' });

    // followUserIds(req.user.sub).then((value) => {
      return res.status(200).send({
        follows,
        // users_following: value.following,
        // users_follow_me: value.followed,
        total: total,
        pages: Math.ceil(total / itemsPerPage), // Calculate the number of pages to present data
      });
    // });
  });
}

// List the users that we follow or the users who follow us in a non-paged form
function getMyFollows(req, res) {
  const userId = req.user.sub; // Id of the logged in user
  let find = Follow.find({ user: userId }); // Users that we follow

  if (req.params.followed) {
    find = Follow.find({ followed: userId }); // Users that follow me
  }

  // Find and populate the user properties and followed
  find.populate('user followed').exec((err, follows) => {
    if (err) return res.status(505).send({ message: 'Error in the request' });

    if (!follows) return res.status(404).send({ message: 'You are not following any user' });

    return res.status(200).send({ follows });
  });
}

/* async function followUserIds(user_id) {
  let following = await Follow.find({'user': user_id}).select({'_id': 0, '__v': 0, 'user': 0}).exec((err, follows) => {
    return follows;
  });

  let followed = await Follow.find({'followed': user_id}).select({'_id': 0, '__v': 0, 'followed': 0}).exec((err, follows) => {
    return follows;
  }); */

  // Procesar following ids
  /* let following_clean = [];

  following.forEach((follow) => {
    following_clean.push(follow.followed);
  });

  // Procesar followed ids
  let followed_clean = [];

  followed.forEach((follow) => {
    followed_clean.push(follow.user);
  });

  return {
    following: following_clean,
    followed: followed_clean,
  };
} */

module.exports = {
  saveFollow,
  deleteFollow,
  getFollowingUsers,
  getFollowedUsers,
  getMyFollows,
};
