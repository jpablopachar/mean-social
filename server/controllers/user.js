const bcrypt = require('bcrypt-nodejs');
const mongoosePagination = require('mongoose-pagination');
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Follow = require('../models/follow');
const Publication = require('../models/publication');
const jwt = require('../services/jwt');

// Method for registering a new user
function saveUser(req, res) {
  const user = new User(); // We create a user object
  const params = req.body; // All fields that arrive by post are stored

  // If all the parameters arrive
  if (params.name && params.surname && params.nickname && params.email && params.password) {
    // We set a value for each property of the user object
    user.name = params.name;
    user.surname = params.surname;
    user.nickname = params.nickname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    // Control duplicate users
    User.find({ $or: [{ email: user.email.toLowerCase() }, { nickname: user.nickname.toLowerCase() }] }).exec((err, users) => {
      if (err) return res.status(500).send({ message: 'Error in user request' });

      if (users && users.length >= 1) {
        return res.status(200).send({ message: 'The user you are trying to register already exists!' });
      }
      // Encrypt the password and save the data
      bcrypt.hash(params.password, null, null, (err, hash) => {
        user.password = hash;

        user.save((err, userStored) => {
          if (err) return res.status(500).send({ message: 'Error saving the user' });

          if (!userStored) {
            res.status(404).send({ message: 'The user has not registered' });
          } else {
            res.status(200).send({ user: userStored });
          }
        });
      });
    });
  } else { // Not all the parameters arrive
    res.status(200).send({ message: 'Complete all fields' });
  }
}

// Method that allows users to log in
function loginUser(req, res) {
  const params = req.body;
  const email = params.email;
  const password = params.password;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    if (user) {
      // Check password
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          // Returns the data of the connected user
          if (params.getToken) {
            // Generates and returns a token of jwt
            res.status(200).send({
              token: jwt.createToken(user),
            });
          } else {
            user.password = undefined;
            res.status(200).send({ user });
          }
        } else {
          res.status(404).send({ message: 'The user could not log in' });
        }
      });
    } else {
      res.status(404).send({ message: 'The user does not exist' });
    }
  });
}

// Synchronous function
async function followThisUser(identityUserId, userId) {
  // Store if we follow a user
  const following = await Follow.findOne({ user: identityUserId, followed: userId }).exec().then((following) => {
    return following;
  }).catch((err) => {
    return handleError(err);
  });

  // Store if the identified user follows
  const followed = await Follow.findOne({ user: userId, followed: identityUserId }).exec().then((followed) => {
    return followed;
  }).catch((err) => {
    return handleError(err);
  });

  return {
    following: following,
    followed: followed,
  };
}

// Method that returns the data of a user
function getUser(req, res) {
  const userId = req.params.id; // Stores a parameter that reaches us by url

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error in user request' });

    if (!user) return res.status(404).send({ message: 'The user does not exist' });

    followThisUser(req.user.sub, userId).then((value) => {
      user.password = undefined; // No devuelve password

      return res.status(200).send({ user, following: value.following, followed: value.followed });
    });
  });
}

async function followUserIds(userId) {
  // Stores an array of users that I am following
  // Find my userId and deactivate the fields that do not interest me
  const following = await Follow.find({ 'user': userId }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec().then((following) => {
    // Process following ids
    const followingClean = [];

    following.forEach((following) => {
      followingClean.push(following.followed);
    });

    return followingClean;
  }).catch((err) => {
    return handleError(err);
  });

  //
  const followed = await Follow.find({ 'followed': userId }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec().then((followed) => {
    // Process followed ids
    const followedClean = [];

    followed.forEach((followed) => {
      followedClean.push(followed.user);
    });

    return followedClean;
  }).catch((err) => {
    return handleError(err);
  });

  return {
    following: following,
    followed: followed,
  };
}

// List all users stored by page blocks
function getUsers(req, res) {
  const identityUserId = req.user.sub; // Stores the id of the logged in user
  let page = 1;
  const itemsPerPage = 5; // Number of users displayed per page

  if (req.params.page) {
    page = req.params.page;
  }

  User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
    if (err) return res.status(505).send({ message: 'Error in user request' });

    if (!users) return res.status(404).send({ message: 'There are no users' });

    followUserIds(identityUserId).then((value) => {
      return res.status(200).send({
        users,
        usersFollowing: value.following,
        usersFollowMe: value.followed,
        total,
        pages: Math.ceil(total / itemsPerPage),
      });
    });
  });
}

async function getCountFollow(userId) {
  // Users that we follow
  const following = await Follow.count({ 'user': userId }).exec().then((count) => {
    return count;
  }).catch((err) => {
    return handleError(err);
  });

  // Users that follow us
  const followed = await Follow.count({ 'followed': userId }).exec().then((count) => {
    return count;
  }).catch((err) => {
    return handleError(err);
  });

  // Count the posts the user has made
  const publications = await Publication.count({ 'user': userId }).exec().then((count) => {
    return count;
  }).catch((err) => {
    return handleError(err);
  });

  return {
    following: following,
    followed: followed,
    publications: publications,
  };
}

// Method that returns the counter of how many people follow us?
// How many people do I follow? How many publications do I have?
function getCounters(req, res) {
  let userId = req.user.sub;

  if (req.params.id) {
    userId = req.params.id;
  }

  getCountFollow(userId).then((value) => {
    return res.status(200).send(value);
  });
}

// Method that allows updating a user's data
function updateUser(req, res) {
  const userId = req.params.id; // Pick up the url id
  const update = req.body; // Pick up the query

  delete update.password; // Delete the password property

  if (userId !== req.user.sub) {
    return res.status(500).send({ message: 'You do not have permission to update user data' });
  }

  User.find({ $or: [{ email: update.email.toLowerCase() }, { nickname: update.nickname.toLowerCase() }] }).exec((err, users) => {
    let userIsset = false;

    users.forEach((user) => {
      if (user && user._id !== userId) userIsset = true;
    });

    if (userIsset) return res.status(404).send({ message: 'The data is already in use' });

    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
      if (err) return res.status(505).send({ message: 'Error in user request' });

      if (!userUpdated) return res.status(404).send({ message: 'The user could not be updated' });

      userUpdated.password = undefined;

      return res.status(200).send({ user: userUpdated });
    });
  });
}

function removeFilesOfUploads(res, filePath, message) {
  fs.unlink(filePath, (err) => {
    return res.status(200).send({ message: message });
  });
}

function uploadImage(req, res) {
  const userId = req.params.id;

  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split('/');
    const fileName = fileSplit[2];
    const extSplit = fileName.split('.');
    const fileExt = extSplit[1];

    if (userId !== req.user.sub) {
      return removeFilesOfUploads(res, filePath, 'You do not have permission to update user data');
    }

    if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {
      // Update user data logged in
      User.findByIdAndUpdate(userId, { image: fileName }, { new: true }, (err, userUpdated) => {
        if (err) return res.status(505).send({ message: 'Error in user request' });

        if (!userUpdated) return res.status(404).send({ message: 'The user could not be updated' });

        userUpdated.password = undefined;

        return res.status(200).send({ userUpdated });
      });
    } else {
      return removeFilesOfUploads(res, filePath, 'Invalid extension');
    }
  } else {
    res.status(200).send({ message: 'No image has been uploaded' });
  }
}

function getImageFile(req, res) {
  const imageFile = req.params.imageFile;
  const pathFile = './uploads/users/' + imageFile;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'There is no image' });
    }
  });
}

module.exports = {
  saveUser,
  loginUser,
  getUser,
  getUsers,
  getCounters,
  updateUser,
  uploadImage,
  getImageFile,
};
