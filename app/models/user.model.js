const {generateRandomString} = require('../utils/common-utils');

module.exports = mongoose => {
    return mongoose.model(
        "user",
        mongoose.Schema(
            {
                _id: {type: String, default:generateRandomString},
                username: String,
                email: String,
                password: String
            },
            {timestamps: true}
        )
    );
};