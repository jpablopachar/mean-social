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
  publication.created_at = moment().unix(); // We assign the creation date

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
    Publication.find({ user: { '$in': followsClean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
      if (err) return res.status(500).send({ message: 'Error returning publications' });

      if (!publications) return res.status(404).send({ message: 'No publications' });

      return res.status(200).send({
        publications,
        totalItems: total,
        page: page,
        pages: Math.ceil(total / itemsPerPage),
        itemsPerPage: itemsPerPage,
      });
    });
  });
}

/* function getPublicationsUser(req, res) {
  let page = 1;
  let itemsPerPage = 4;
  let user = req.user.sub;

  if (req.params.page) {
    page = req.params.page;
  }

  if (req.params.user) {
    user = req.params.user;
  }

  Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
    if (err) return res.status(500).send({message: 'Error en la petición'});

    if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

    return res.status(200).send({
      publications,
      total_items: total,
      page: page,
      pages: Math.ceil(total / itemsPerPage),
      items_per_page: itemsPerPage
    });
  });
} */

// Method to delete a publication
function deletePublication(req, res) {
  const publicationId = req.params.id;

  // Find a publication based on your Id and remove it
  Publication.find({ 'user': req.user.sub, '_id': publicationId }).remove(err => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    return res.status(200).send({ message: 'Publication deleted successfully' });
  });
}

/* function uploadImage(req, res) {
  let publicationId = req.params.id;

  if (req.files) {
    let file_path = req.files.image.path;
    // console.log(file_path);
    let file_split = file_path.split('/');
    // console.log(file_split);
    let file_name = file_split[2];
    // console.log(file_name);
    let ext_split = file_name.split('\.');
    // console.log(ext_split);
    let file_ext = ext_split[1];
    // console.log(file_ext);

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
      Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {
        if (publication) {
          Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new: true}, (err, publicationUpdated) => {
            if (err) return res.status(505).send({message: 'Error en la petición'});

            if (!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

            // return res.status(200).send({
            //   image: file_name,
            //   publication: publicationUpdated
            // });
            return res.status(200).send({publicationUpdated});
          });
        } else {
          return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar esta publicación');
        }
      });
    } else {
      return removeFilesOfUploads(res, file_path, 'Extensión no válida');
    }
  } else {
    res.status(200).send({message: 'No se ha subido ninguna imagen'});
  }
} */

/* function getImageFile(req, res) {
  let imageFile = req.params.imageFile;
  let path_file = './uploads/publications/' + imageFile;

  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({message: 'No existe la imagen'});
    }
  });
} */

module.exports = {
  savePublication,
  getPublication,
  getPublications,
  // getPublicationsUser,
  deletePublication,
  // uploadImage,
  // getImageFile
};
