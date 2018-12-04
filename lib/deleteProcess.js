const pm2 = require('pm2');
const throwError = require('./throwError');

module.exports = (name) => {
    return new Promise((resolve, reject) => {
        pm2.delete(name, (err) => {
            throwError(err);
            console.log(`Process ${name} deleted.`);
            resolve();
        })
    });
};