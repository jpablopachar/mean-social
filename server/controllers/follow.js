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

    if (!followStored) return res.status(404).send({ message: 'Tracking has not been saved' });

    return res.status(200).send({ follow: followStored });
  });
}

/* function deleteFollow(req, res) {
  let userId = req.user.sub;
  let followId = req.params.id;

  Follow.find({'user': userId, 'followed': followId}).remove(err => {
    if (err) return res.status(500).send({message: 'Error al dejar de seguir'});

    return res.status(200).send({message: 'El follow se ha eliminado'});
  });
} */

// Lista los usuarios que seguimos de forma paginada
/* function getFollowingUsers(req, res) {
  let userId = req.user.sub;
  let page = 1;
  let itemsPerPage = 4;

  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  if (req.params.page) {
    page = req.params.page;
  } else {
    page = req.params.id;
  } */

/* Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
    if (err) return res.status(505).send({message: 'Error en la petición'});

    if (!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

    followUserIds(req.user.sub).then((value) => { */
      /* return res.status(200).send({
        follows,
        users_following: value.following,
        users_follow_me: value.followed,
        total: total,
        pages: Math.ceil(total / itemsPerPage)
      });
    });
  });
} */

// Lista los usuarios que nos siguen de forma paginada
/* function getFollowedUsers(req, res) {
  let userId = req.user.sub;
  let page = 1;
  let itemsPerPage = 4;

  if (req.params.id && req.params.page) {
    userId = req.params.id;
  }

  if (req.params.page) {
    page = req.params.page;
  } else {
    page = req.params.id;
  }

  Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
    if (err) return res.status(505).send({message: 'Error en la petición'});

    if (!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

    followUserIds(req.user.sub).then((value) => {
      return res.status(200).send({
        follows,
        users_following: value.following,
        users_follow_me: value.followed,
        total: total,
        pages: Math.ceil(total / itemsPerPage)
      });
    });
  });
} */

// Lista los usuarios que seguimos o de los usuarios que nos siguen  de forma no paginada
/* function getMyFollows(req, res) {
  let userId = req.user.sub;
  let find = Follow.find({user: userId});

  if (req.params.followed) {
    find = Follow.find({followed: userId});
  }

  find.populate('user followed').exec((err, follows) => {
    if (err) return res.status(505).send({message: 'Error en la petición'});

    if (!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

    return res.status(200).send({follows});
  });
}

async function followUserIds(user_id) {
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
    followed: followed_clean
  }
} */

module.exports = {
  saveFollow,
  /* deleteFollow,
  getFollowingUsers,
  getFollowedUsers,
  getMyFollows */
};
