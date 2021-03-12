// ====================================================
//      Hash
// ====================================================

var crypto = require('crypto');

let createHas = (password) => {
    let hash = crypto.createHash(process.env.HASH)
        .update(password)
        .digest(process.env.DIGEST);
    return hash;
}

let compareHash = (password, userPassword) => {
    let hash = crypto.createHash(process.env.HASH)
        .update(password)
        .digest(process.env.DIGEST);
    if (hash == userPassword)
        return true;
    else return false;
}

let encrypt = (password) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(process.env.ALGORITHM, process.env.SEED, iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);

    let pass = {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
    return `${pass.iv}.${pass.content}`;
}

const decrypt = (hash) => {
    let encoded = hash.split('.');
    iv = encoded[0];
    encoded.splice(0, 1)
    let content = encoded.join('.');

    const decipher = crypto.createDecipheriv(process.env.ALGORITHM, process.env.SEED, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);

    result = decrpyted.toString();
    return result;
};

module.exports = {
    createHas,
    compareHash,
    encrypt,
    decrypt
}