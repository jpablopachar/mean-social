const express = require('express');
const multipart = require('connect-multiparty');

const UserController = require('../controllers/user');
const mdAuth = require('../middlewares/authenticated');

const router = express.Router();
const mdUpload = multipart({ uploadDir: './uploads/users' });

router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.get('/user/:id', mdAuth.ensureAuth, UserController.getUser);
router.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers);
/* router.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters); */
router.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser);
router.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload], UserController.uploadImage);
router.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = router;
