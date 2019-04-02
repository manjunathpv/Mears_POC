'use strict';

const crypto = require('crypto');

const algorithm = 'aes-256-ctr'
const key = 'sample-key'


const encrypt = (text) => {
    var cipher = crypto.createCipher(algorithm, key)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

const decrypt = (text) => {
    var decipher = crypto.createDecipher(algorithm, key)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
};
