const pm2 = require('pm2');
const throwError = require('./throwError');

module.exports = () => {
    return new Promise((resolve, reject) => {
        pm2.list((err, procDescs) => {
            throwError(err);
            resolve(procDescs);
        });
    })
};

