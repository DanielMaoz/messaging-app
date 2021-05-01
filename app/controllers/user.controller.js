const db = require("../models");
const User = db.users;
const _ = require('lodash');

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.first_name || !req.body.last_name) {
        res.status(400).send({ message: `Some information is missing from the request, req.body: ${JSON.stringify(req.body)}` });
        return;
    }

    // Create a User
    const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        full_name: _.trim(req.body.first_name) + _.trim(req.body.last_name)
    });

    // Save User in the database
    user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                user:
                    err.user || "Some error occurred while creating the User."
            });
        });
};