module.exports = app => {
    const Users = require("../controllers/user.controller");

    var router = require("express").Router();

    // Create a new User
    router.post("/", Users.create);

    app.use('/api/user', router);
};