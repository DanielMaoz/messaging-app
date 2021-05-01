const {verifyToken} = require('../middlewares');

module.exports = app => {
    const messages = require("../controllers/message.controller");

    var router = require("express").Router();

    // Create a new Message
    router.post("/", messages.createMessage);
    router.get("/:id?", verifyToken, messages.getAllMessagesByUserId);
    router.get("/unread/:id", messages.getAllUnreadMessagesByUserId);
    router.get("/message/:id", messages.getMessageById);
    router.delete("/:messageId/:userId", messages.deleteMessageById);

    app.use('/api/messages', router);
};