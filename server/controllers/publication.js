const path = require('path');
const fs = require('fs');
const moment = require('moment');

const Publication = require('../models/publication');
const User = require('../models/user');
const Follow = require('../models/follow');

// Method that stores publications
function savePublication(req, res) {
  const publication = new Publication();
  const params = req.body;

  if (!params.text) return res.status(200).send({ message: 'You must send a text!' });

  publication.text = params.text;
  publication.file = 'null';
  publication.user = req.user.sub; // Save the id of the user who creates the publication
  publication.createdAt = moment().unix(); // We assign the creation date

  publication.save((err, publicationStored) => {
    if (err) return res.status(500).send({ message: 'Error saving the publication' });

    if (!publicationStored) return res.status(404).send({ message: 'The publication has not been registered' });

    return res.status(200).send({ publication: publicationStored });
  });
}

// Method that returns a publication
function getPublication(req, res) {
  const publicationId = req.params.id;

  // Search for publications that have publicationId
  Publication.findById(publicationId, (err, publication) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    if (!publication) return res.status(404).send({ message: 'No publications' });

    return res.status(200).send({ publication });
  });
}

// Method that returns the publications of the users that I follow
function getPublications(req, res) {
  let page = 1;
  const itemsPerPage = 4;

  if (req.params.page) {
    page = req.params.page;
  }

  // Find all the users that we follow and populate with the property followed
  Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    const followsClean = [];

    follows.forEach((follow) => {
      followsClean.push(follow.followed);
    });

    followsClean.push(req.user.sub);

    // Search for all publications whose user is in a sorted list
    // from the oldest to the newest and we populate with the user object
    // and returns us in a paged form
    Publication.find({ user: { '$in': followsClean } }).sort('-createdAt').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
      if (err) return res.status(500).send({ message: 'Error returning publications' });

      if (!publications) return res.status(404).send({ message: 'No publications' });

      return res.status(200).send({
        publications,
        totalItems: total,
        page,
        pages: Math.ceil(total / itemsPerPage),
        itemsPerPage,
      });
    });
  });
}

function getPublicationsUser(req, res) {
  let page = 1;
  const itemsPerPage = 4;
  let user = req.user.sub;

  if (req.params.page) {
    page = req.params.page;
  }

  if (req.params.user) {
    user = req.params.user;
  }

  Publication.find({ user: user }).sort('-createdAt').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    if (!publications) return res.status(404).send({ message: 'No publications' });

    return res.status(200).send({
      publications,
      totalItems: total,
      page: page,
      pages: Math.ceil(total / itemsPerPage),
      itemsPerPage: itemsPerPage,
    });
  });
}

// Method to delete a publication
function deletePublication(req, res) {
  const publicationId = req.params.id;

  // Find a publication based on your Id and remove it
  Publication.find({ 'user': req.user.sub, '_id': publicationId }).remove(err => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    return res.status(200).send({ message: 'Publication deleted successfully' });
  });
}

// Method to delete a file uploaded
function removeFilesOfUploads(res, filePath, message) {
  fs.unlink(filePath, (err) => {
    return res.status(200).send({ message: message });
  });
}

// Method to upload images to the publication
function uploadImage(req, res) {
  const publicationId = req.params.id;

  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split('/');
    const fileName = fileSplit[2];
    const extSplit = fileName.split('\.');
    const fileExt = extSplit[1];

    if (fileExt === 'png' || fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'gif') {

      // Find the user's publication based on publicationId
      Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {
        if (publication) {
          // Find the publication and update it
          Publication.findByIdAndUpdate(publicationId, { file: fileName }, { new: true }, (err, publicationUpdated) => {
            if (err) return res.status(505).send({ message: 'Error in the request' });

            if (!publicationUpdated) return res.status(404).send({ message: 'The user could not be updated' });

            return res.status(200).send({ publicationUpdated });
          });
        } else {
          return removeFilesOfUploads(res, filePath, 'You do not have permission to update this publication');
        }
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
  const pathFile = './uploads/publications/' + imageFile;

  fs.exists(pathFile, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(pathFile));
    } else {
      res.status(200).send({ message: 'There is no image' });
    }
  });
}

module.exports = {
  savePublication,
  getPublication,
  getPublications,
  getPublicationsUser,
  deletePublication,
  uploadImage,
  getImageFile,
};
