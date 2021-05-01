const config = require("../config/auth.config");
const db = require("../models");
const User = db.users;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {
    const {username, email, password} = req.body;
    const user = new User({
        username,
        email,
        password: bcrypt.hashSync(password, 8)
    });

    user.save((err, user) => {
        if (err) {res.status(500).send({ message: err });}
        else res.send(user);
    });
};

exports.signin = (req, res) => {
    User.findOne({username: req.body.username})
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: token
            });
        });
};