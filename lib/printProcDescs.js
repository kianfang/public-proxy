const Table = require('cli-table-redemption');
const {get, defaultTo, pull} = require('lodash');
const {relative, resolve} = require('path');
const chalk = require('chalk');


module.exports = (procDescs) => {
    let head = [
        'pid',
        'name',
        'pm_id',
        'status',
        'start_time',
        'cpu',
        'memory',
        'restart',
        'cwd',
        'out_log',
        'err_log'
    ];

    let columns = process.stdout.columns;
    if(columns < 200) {
        pull(head, 'cwd', 'out_log', 'err_log')
    }

    let table = new Table({
        head: head.map((str) => chalk.blue.bold(str))
    });
    table.push(...procDescs.map(procDesc => {
        let status = get(procDesc, 'pm2_env.status');
        let start_time = procDesc.pm2_env && procDesc.pm2_env.pm_uptime && new Date(procDesc.pm2_env.pm_uptime).toLocaleString();
        let cpu = get(procDesc, 'monit.cpu', 0);
        let memory = `${Math.round(get(procDesc, 'monit.memory', 0) / 1024 / 1024)}M`;
        let restart = get(procDesc, 'pm2_env.restart_time', '');
        let cwd = get(procDesc, 'pm2_env.cwd', '');
        let out_log = get(procDesc, 'pm2_env.pm_out_log_path', '');
        let err_log = get(procDesc, 'pm2_env.pm_err_log_path', '');

        let row = [
            defaultTo(procDesc.pid, '-'),
            chalk.green(defaultTo(procDesc.name, '-')),
            defaultTo(procDesc.pm_id, '-'),
            status === 'online' ? status : chalk.red(defaultTo(status, '-')),
            defaultTo(start_time, '-'),
            cpu,
            memory,
            restart,
            cwd || '-',
            out_log || '-',
            err_log || '-'
        ];

        return row.splice(0, head.length);
    }));
    console.log(table.toString());

};

