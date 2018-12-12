const {readFileSync, appendFile} = require('fs');
const http = require('http');
const socks = require('socksv5');
const proxy = require('proxy');
const htpasswd = require('htpasswd-auth');

module.exports = class {
    constructor(options = {}) {
        options.socks && this.startSocksProxy({
            port: options.socksPort,
            address: options.socksAddress,
            auth: options.socksAuth
        });

        options.http && this.startHttpProxy({
            port: options.httpPort,
            address: options.httpAddress,
            auth: options.httpAuth
        })
    }

    /**
     * 启动socks5代理
     * @param config
     */
    startSocksProxy(config = {}) {
        console.log('[Socks Proxy Config]');
        console.log(JSON.stringify(config, null, 4));
        this.createAuthFile(config.auth);

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
            config.auth ? socks.auth.UserPassword((user, pwd, cb) => {
                // console.log(user, password);
                htpasswd.authenticate(user, pwd, readFileSync(config.auth, 'utf-8')).then(cb);
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
        this.createAuthFile(config.auth);

        let server = http.createServer();

        if (config.auth) {
            server.authenticate = async function (req, cb) {
                // 标记验证状态
                req.authStatus = false;
                let proxyAuthorization = req.headers['proxy-authorization'] || req.headers['authorization'];

                if (proxyAuthorization) {
                    let tokens = proxyAuthorization.split(' ');
                    // 获取认证信息
                    if (tokens[0] === 'Basic') {
                        // 获取 username:password 格式中的验证信息
                        let splitHash = new Buffer(tokens[1], 'base64').toString('utf8').split(':');

                        req.authStatus = await htpasswd.authenticate(splitHash[0], splitHash[1], readFileSync(config.auth, 'utf-8'));
                        console.log(req.authStatus);
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
            let extraInfo = config.auth && !req.authStatus ? '[Auth Failed]' : '';
            console.log(`[${startTime}][HTTP Proxy Info]${extraInfo} ${socket.remoteAddress}:${socket.remotePort} <===> ${req.headers.host}`);
        });

    }

    createAuthFile(path) {
        if (!path) return;
        appendFile(path, '', 'utf8', (err) => {
            if (err) console.error(err);
            else console.log('[Auth File] Auth file created.');
        });
    }
};
