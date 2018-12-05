## Reference
- [https://github.com/mscdex/socksv5](https://github.com/mscdex/socksv5)
- [https://github.com/sequoiar/socks5](https://github.com/sequoiar/socks5)
- [https://github.com/TooTallNate/proxy](https://github.com/TooTallNate/proxy)


## 使用HTTP代理
```shell
./start http
```

## 使用Socks代理
```shell
./start socks
``` 

## 添加代理认证用户
- 安装htpasswd工具
```shell
npm install -g htpasswd
```

- 添加/修改用户
```shell
htpasswd -b ./config/htpasswd username password
```

- 删除用户
```shell
htpasswd -D ./config/htpasswd username
```
