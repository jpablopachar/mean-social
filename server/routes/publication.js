const express = require('express');
const multipart = require('connect-multiparty');

// const UserController = require('../controllers/user');
const PublicationController = require('../controllers/publication');
const mdAuth = require('../middlewares/authenticated');

const router = express.Router();
const md_upload = multipart({ uploadDir: './uploads/publications' });

router.post('/publication', mdAuth.ensureAuth, PublicationController.savePublication);
router.get('/publication/:id', mdAuth.ensureAuth, PublicationController.getPublication);
router.get('/publications/:page?', mdAuth.ensureAuth, PublicationController.getPublications);
// router.get('/publications-user/:user/:page?', mdAuth.ensureAuth, PublicationController.getPublicationsUser);
// router.delete('/publication/:id', mdAuth.ensureAuth, PublicationController.deletePublication);
// router.post('/upload-image-pub/:id', [mdAuth.ensureAuth, md_upload], PublicationController.uploadImage);
// router.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

module.exports = router;
