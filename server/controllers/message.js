const moment = require('moment');
const mongoosePagination = require('mongoose-pagination');

const User = require('../models/user');
const Follow = require('../models/follow');
const Message = require('../models/message');

// Method to save a message
function saveMessage(req, res) {
  const message = new Message();
  const params = req.body;

  if (!params.text || !params.receiver) return res.status(200).send({ message: 'Send the necessary data' });

  message.emitter = req.user.sub;
  message.receiver = params.receiver;
  message.text = params.text;
  message.created_at = moment().unix();
  message.viewed = 'false';

  // Save the message
  message.save((err, messageStored) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    if (!messageStored) return res.status(500).send({ message: 'Error sending the message \'' });

    return res.status(200).send({ message: messageStored });
  });
}

// The save message function is implemented...
function getReceivedMessages(req, res) {
  const userId = req.user.sub;
  let page = 1;
  const itemsPerPage = 4;

  if (req.params.page) {
    page = req.params.page;
  }

  // Look for the messages we receive and populate with the data of the user who sent the message
  // It is ordered in descending order and we present them in a paged form
  Message.find({ receiver: userId }).populate('emitter', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
    if (err) return res.status(500).send({ message: 'Error in the request' });

    if (!messages) return res.status(404).send({ message: 'No messages' });

    return res.status(200).send({
      messages,
      total: total,
      pages: Math.ceil(total / itemsPerPage),
    });
  });
}

/* function getEmittMessages(req, res) {
  console.log('Estoy aqui');
  let userId = req.user.sub;
  let page = 1;
  let itemsPerPage = 4;

  if (req.params.page) {
    page = req.params.page;
  }

  Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
    if (err) return res.status(500).send({message: 'Error en la petición'});

    if (!messages) return res.status(404).send({message: 'No hay mensajes'});

    return res.status(200).send({
      messages,
      total,
      pages: Math.ceil(total / itemsPerPage)
    });
  });
} */

/* function getUnviewedMessages(req, res) {
  let userId = req.user.sub;

  Message.count({receiver: userId, viewed: 'false'}).exec((err, count) => {
    if (err) return res.status(500).send({message: 'Error en la petición'});

    return res.status(200).send({'unviewed': count});
  });
} */

/* function setViewedMessages(req, res) {
  let userId = req.user.sub;

  Message.update({receiver: userId, viewed: 'false'}, {viewed: 'true'}, {'multi': true}, (err, messagesUpdated) => {
    if (err) return res.status(500).send({message: 'Error en la petición'});

    return res.status(200).send({messages: messagesUpdated});
  });
} */

module.exports = {
  saveMessage,
  getReceivedMessages,
  // getEmittMessages,
  // getUnviewedMessages,
  // setViewedMessages,
};
