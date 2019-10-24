const jwt = require('jsonwebtoken');
const publicKey = '0mrqFnsYGMjW2MPrclzvFa';

const token = jwt.sign({
    "keyId": "5ZwwwIbjjRyvZePEGbduxp",
    "name": "sandi sunandar",
}, publicKey);

console.log(token);
