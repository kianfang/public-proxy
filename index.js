const commander = require('commander');
const App = require('./App');
const pkg = require('./package.json');

commander
    .version(pkg.version, '-v, --version')

    .option('--no-socks', 'Close socks proxy server')

    .option('--socks-port <n>', 'Socks proxy server port', Number, 1080)

    .option('--socks-address [address]', 'Socks proxy server address', String, '127.0.0.1')

    .option('--socks-auth [filepath]', 'Socks auth file', String)

    .option('--no-http', 'Close http proxy server')

    .option('--http-port <n>', 'HTTP proxy server port', Number, 1088)

    .option('--http-address [address]', 'HTTP proxy server address', String, '127.0.0.1')

    .option('--http-auth [filepath]', 'HTTP auth file', String)

    .parse(process.argv)
;

const instance = new App(commander);
