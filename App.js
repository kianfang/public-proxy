const socks = require('socksv5');
const moment = require('moment');

module.exports = class {
    constructor(options = {}) {
        options.socks && this.startSocksProxy({
            port: options.socksPort,
            address: options.socksAddress,
            auth: !!(options.socksUser && options.socksPassword),
            user: options.socksUser,
            password: options.socksPassword
        });
    }

    startSocksProxy(config = {}) {
        console.log('[Socks Proxy Config]');
        console.log(JSON.stringify(config, null, 4));

        let server = socks.createServer((info, accept, deny) => {
            let startTime = new Date().toLocaleString();
            // console.log(info);
            console.log(`[${startTime}][Socks Proxy Info] ${info.srcAddr}:${info.srcPort} <===> ${info.dstAddr}:${info.dstPort}`);
            accept();
        });

        server.listen(config.port, config.address, () => {
            let startTime = new Date().toLocaleString();
            console.log(`[${startTime}][Socks Proxy Start] SOCKS server listening on host ${config.address}:${config.port}`);
        });

        // 账号认证
        server.useAuth(
            config.auth ? socks.auth.UserPassword((user, password, cb) => {
                console.log(user, password);
                cb(user === config.user && password === config.password);
            }) : socks.auth.None()
        );
    }

};
