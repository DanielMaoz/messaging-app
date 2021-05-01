const {generateRandomString} = require('../utils/common-utils');

module.exports = mongoose => {
    return mongoose.model(
        "user",
        mongoose.Schema(
            {
                _id: {type: String, default:generateRandomString},
                first_name: String,
                last_name: String,
                full_name: String
            },
            {timestamps: true}
        )
    );
};