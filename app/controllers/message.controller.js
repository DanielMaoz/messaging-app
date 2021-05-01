const db = require("../models");
const Message = db.messages;
const User = db.users;

// Create and Save a new Message
exports.createMessage = async (req, res) => {
    const {senderId, receiverId, message, subject} = req.body;
    if (!senderId || !receiverId || !message || !subject) {
        res.status(400).send({ message: "One or more properties is missing from the request" });
        return;
    }

    const sender = await User.findOne({_id: senderId});
    const receiver = await User.findOne({_id: receiverId});

    if(senderId === receiverId){
        res.status(500).send({ message: "you cannot message yourself"});
        return;
    }

    const messageObj = new Message({
        senderEmail: sender.email,
        senderId,
        receiverEmail: receiver.email,
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
exports.getAllMessagesByUserId = (req, res, next) => {
    const userId = req.userId || req.params.id;

    if(!userId){
        res.status(400).send({ message: "userId is missing from the request" });
        return;
    }

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

    if(!userId){
        res.status(400).send({ message: "userId is missing from the request" });
        return;
    }

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

    if(!messageId){
        res.status(400).send({ message: "messageId is missing from the request" });
        return;
    }

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

    if (!messageId || !userId) {
        res.status(400).send({message: "One or more properties is missing from the request"});
        return;
    }

    Message.findOne({_id: messageId}).then(messageToDelete => {
        //delete if both sides deleted
        if(messageToDelete.deletedBy && messageToDelete.deletedBy !== userId) {
            Message.deleteOne({_id: messageId})
                .then( deletedMessage => { res.send(deletedMessage); })
                .catch( err => { res.status(500).send({
                        message: err.message || `Some error occurred while retrieving messages for user : ${messageId}`
                    })
                })
        }
        //delete only for one user
        else{
            Message.findOneAndUpdate({_id: messageId}, {deletedBy: userId})
                .then( deletedMessage => { res.send(deletedMessage); })
                .catch( err => { res.status(500).send({
                        message: err.message || `Some error occurred while retrieving messages for user : ${messageId}`
                    })
                })
        }
    });
};
