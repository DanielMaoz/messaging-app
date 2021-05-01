const db = require("../models");
const Message = db.messages;

// Create and Save a new Message
exports.createMessage = (req, res) => {
    const {senderName, senderId, receiverName, receiverId, message, subject} = req.body
    if (!senderName || !senderId || !receiverName || !receiverId || !message || !subject) {
        res.status(400).send({ message: "One or more properties is missing from the request" });
        return;
    }

    const messageObj = new Message({
        senderName,
        senderId,
        receiverName,
        receiverId,
        message,
        subject
    });

    messageObj.save(messageObj).then(data => { res.send(data);})
        .catch(err => { res.status(500).send({
                message: err.message || "Some error occurred while creating the Message."
            });
        });
};

// Retrieve all Messages from a user.
exports.getAllMessagesByUserId = (req, res) => {
    const userId = req.params.id;
    Message.find({senderId: userId})
        .then(data => {res.send(data);})
        .catch(err => {res.status(500).send({
                message: err.message || `Some error occurred while retrieving messages for user : ${userId}`
            });
        });
};

// Retrieve all unread Messages from a user.
exports.getAllUnreadMessagesByUserId = (req, res) => {
    const userId = req.params.id;
    Message.find({senderId: userId, read: false})
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({
                message: err.message || `Some error occurred while retrieving messages for user : ${userId}`
            });
        });
};

// Find a single Message with an id
exports.getMessageById = (req, res) => {
    const messageId = req.params.id;
    Message.findOne({_id: messageId}).lean()
        .then(async message => {
            if(message._id && !message.read) message = await Message.findOneAndUpdate({_id: messageId}, {read: true}, {new: true});
            res.send(message)
        })
        .catch(err => { res.status(500).send({
                message: err.message || `Some error occurred while retrieving messages for user : ${messageId}`
            });
        });
};

// Delete a Message with a specified id
exports.deleteMessageById = (req, res) => {
    const {messageId, userId} = req.params;
    Message.findOne({_id: messageId}).then(messageToDelete => {
        if(messageToDelete.deletedBy) {
            Message.deleteOne({_id: messageId})
                .then( deletedMessage => { res.send(deletedMessage); })
                .catch( err => { res.status(500).send({
                        message: err.message || `Some error occurred while retrieving messages for user : ${messageId}`
                    })
                })
        }
        else{
            Message.findOneAndUpdate({_id: messageId}, {deletedBy: userId})
                .then( deletedMessage => { res.send(deletedMessage) })
                .catch( err => { res.status(500).send({
                        message: err.message || `Some error occurred while retrieving messages for user : ${messageId}`
                    })
                })
        }
    });
};
