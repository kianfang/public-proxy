const pm2 = require('pm2');
const throwError = require('./throwError');

module.exports = () => {
    return new Promise((resolve, reject) => {
        pm2.killDaemon((err) => {
            throwError(err);
            console.log(`[Success] all process stoped and daemon killed.`);
            resolve();
        })
    });
};
