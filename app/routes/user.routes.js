module.exports = app => {
    const messages = require("../controllers/user.controller");

    var router = require("express").Router();

    // Create a new Message
    router.post("/", messages.create);

    app.use('/api/user', router);
};