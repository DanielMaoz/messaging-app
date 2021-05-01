const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const routesConfig = require("../config/routes.config");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token && req.baseUrl !== routesConfig.getMessagesBaseUrl) {
        return res.status(403).send({ message: "No token provided!" });
    }

    if(token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(401).send({message: "Unauthorized!"});
            }
            req.userId = decoded.id;
            next();
        });
    }
    else {
        next();
    }
};

module.exports = verifyToken;