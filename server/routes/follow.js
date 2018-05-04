const express = require('express');
// const multipart = require('connect-multiparty');

const FollowController = require('../controllers/follow');
const mdAuth = require('../middlewares/authenticated');

const router = express.Router();
// const md_upload = multipart({ uploadDir: './uploads/users' });

router.post('/follow', mdAuth.ensureAuth, FollowController.saveFollow);
/* router.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);
router.get('/following/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowingUsers);
router.get('/followed/:id?/:page?', mdAuth.ensureAuth, FollowController.getFollowedUsers);
router.get('/get-my-follows/:followed?', mdAuth.ensureAuth, FollowController.getMyFollows); */

module.exports = router;
