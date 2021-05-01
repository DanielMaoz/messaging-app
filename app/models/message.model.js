const {generateRandomString} = require('../utils/common-utils');

module.exports = mongoose => {
    return mongoose.model(
        "message",
        mongoose.Schema(
            {
                _id: {type: String, default: generateRandomString},
                senderName: String,
                senderId: String,
                receiverName: String,
                receiverId: String,
                message: String,
                subject: String,
                read: {type: Boolean, default: false},
                deletedBy: String
            },
            {timestamps: true}
        )
    );
};
