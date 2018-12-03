const program = require('commander');
const App = require('./App');
const pkg = require('./package.json');

program
    .version(pkg.version, '-v, --version')

    .option('--no-socks', 'Close socks proxy server')

    .option('--socks-port <n>', 'Socks proxy server port', Number, 1080)

    .option('--socks-address [address]', 'Socks proxy server address', String, '127.0.0.1')

    .option('--socks-user [username]', 'Socks auth user', String)

    .option('--socks-password [password]', 'Socks auth password', String)

    .parse(process.argv)
;

const instance = new App(program);
