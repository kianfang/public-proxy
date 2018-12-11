# public-proxy


## Install
```shell
npm install -g public-proxy
```

## Get help
```shell
public-proxy --help
public-proxy start|restart|stop --help
```

## Use HTTP proxy
```shell
public-proxy start http
```

## Use Socks proxy
```shell
public-proxy start socks
``` 

## Run status
```shell
# Get socks server and http server status.
public-proxy status

# Get socks server status only.
public-proxy status socks

# Get http server status only.
public-proxy status http
```

## Add proxy auth
- Install htpasswd
```shell
npm install -g htpasswd
```

- Add/Modify user
```shell
htpasswd -b ./config/htpasswd username password
```

- Delete user
```shell
htpasswd -D ./config/htpasswd username
```

## Reference
- [https://github.com/mscdex/socksv5](https://github.com/mscdex/socksv5)
- [https://github.com/sequoiar/socks5](https://github.com/sequoiar/socks5)
- [https://github.com/TooTallNate/proxy](https://github.com/TooTallNate/proxy)

