const express = require('express');
const multipart = require('connect-multiparty');

const MessageController = require('../controllers/message');
const mdAuth = require('../middlewares/authenticated');

const router = express.Router();

router.post('/message', mdAuth.ensureAuth, MessageController.saveMessage);
router.get('/my-messages/:page?', mdAuth.ensureAuth, MessageController.getReceivedMessages);
router.get('/messages/:page?', mdAuth.ensureAuth, MessageController.getEmmitMessages);
router.get('/unviewed-messages', mdAuth.ensureAuth, MessageController.getUnviewedMessages);
router.get('/set-viewed-messages', mdAuth.ensureAuth, MessageController.setViewedMessages);

module.exports = router;
