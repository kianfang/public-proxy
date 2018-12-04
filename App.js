const http = require('http');
const socks = require('socksv5');
const proxy = require('proxy');

module.exports = class {
    constructor(options = {}) {
        options.socks && this.startSocksProxy({
            port: options.socksPort,
            address: options.socksAddress,
            auth: !!(options.socksUser && options.socksPassword),
            user: options.socksUser,
            password: options.socksPassword
        });

        options.http && this.startHttpProxy({
            port: options.httpPort,
            address: options.httpAddress,
            auth: !!(options.httpUser && options.httpPassword),
            user: options.httpUser,
            password: options.httpPassword
        })
    }

    /**
     * 启动socks5代理
     * @param config
     */
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
                // console.log(user, password);
                cb(user === config.user && password === config.password);
            }) : socks.auth.None()
        );
    }

    /**
     * 启动HTTP代理
     * @param config
     */
    startHttpProxy(config = {}) {
        console.log('[Http Proxy Config]');
        console.log(JSON.stringify(config, null, 4));

        let server = http.createServer();

        if (config.auth) {
            server.authenticate = function (req, cb) {
                // 标记验证状态
                req.authStatus = false;
                let proxyAuthorization = req.headers['proxy-authorization'];

                if (proxyAuthorization) {
                    let tokens = proxyAuthorization.split(' ');
                    // 获取认证信息
                    if(tokens[0] === 'Basic') {
                        // 获取 username:password 格式中的验证信息
                        let splitHash = new Buffer(tokens[1], 'base64').toString('utf8').split(':');
                        // console.log(splitHash);
                        if(splitHash[0] === config.user && splitHash[1] === config.password) {
                            req.authStatus = true;
                        }
                    }
                }

                cb(null, req.authStatus);
            };
        }
        server = proxy(server);

        server.listen(config.port, config.address, () => {
            let startTime = new Date().toLocaleString();
            console.log(`[${startTime}][HTTP Proxy Start] HTTP server listening on host ${config.address}:${config.port}`);
        });

        server.on('connect', (req, socket, head) => {
            // console.log(req.authStatus);
            // req.connection === socket
            let startTime = new Date().toLocaleString();
            // 开启认证检查是否认证成功
            let extraInfo = config.auth && !req.authStatus ? '[Auth Failed]': '';
            console.log(`[${startTime}][HTTP Proxy Info]${extraInfo} ${socket.remoteAddress}:${socket.remotePort} <===> ${req.headers.host}`);
        });

    }
};
