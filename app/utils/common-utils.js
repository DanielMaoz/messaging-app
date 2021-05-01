const crypto = require('crypto');

module.exports = {
    generateRandomString: (size = 20) => {
        let chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz' +
            '0123456789');
        let objectId = '';
        let bytes = crypto.randomBytes(size);
        for (let i = 0; i < bytes.length; ++i) {
            objectId += chars[bytes.readUInt8(i) % chars.length];
        }
        return objectId;
    }
}