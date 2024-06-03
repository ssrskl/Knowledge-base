# Mysql数据库
## 安装
### Linux安装MySQL
卸载MySQL依赖，有些机器上自带的有mariadb数据库，所以需要先卸载MySQL依赖。
```bash
sudo yum remove mysql-libs
```
下载并安装依赖
```bash
sudo yum install libaio
sudo yum -y install autoconf
```
切换到root用户，执行`install_mysql.sh`文件

### Docker安装MySQL
Docker安装需要考虑如下的问题：
1. MySQL的数据持久化。
2. MySQL的配置文件。
3. MySQL的时区问题。

## MySQL常用操作
### 用户管理
查看MySQL中的所有用户
```bash
select user,host from mysql.user;
```

修改用户密码
```bash
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your-password';
```
:::warning
注意这里的`%`是允许所有IP地址连接，如果需要限制IP地址，则需要修改为具体的IP地址。可以通过下面的命令查看当前连接的IP地址
```bash
SELECT user,host FROM mysql.user;
```
:::


## 常见问题
### MySQL5与MySQL8的安全机制
两个版本的数据库密码验证机制不同，mysql5.x使用的是`mysql_native_password`，而Mysql8.x使用的是`caching_sha2_password`。

mysql5.x的密码验证机制是：

1. 客户端发送密码
2. 服务端将密码加密后与用户表中的密码进行比较
3. 如果密码正确，则允许连接

mysql8.x的密码验证机制是：

1. 客户端发送密码
2. 服务端将密码加密后与用户表中的密码进行比较
3. 如果密码正确，则生成一个随机字符串，并使用该字符串加密密码
4. 服务端将加密后的密码发送给客户端
5. 客户端将加密后的密码发送给服务端
6. 服务端将加密后的密码与用户表中的密码进行比较
7. 如果密码正确，则允许连接

所以使用客户端连接MySQL8.x时，需要修改客户端的密码验证机制为`mysql_native_password`，否则无法连接。我们先在MySQL的服务器中或者Docker容器中连接MySQL8.x，然后修改客户端的密码验证机制为`mysql_native_password`，再重新连接即可。

连接Mysql
```bash
mysql -h localhost -uroot -p<your-password>
```
修改用户的密码验证机制
```bash
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your-password';
```
:::warning
注意这里使用的是`%`而不是`localhost`，可以先通过下面的命令查看当前连接的IP地址
```bash
SELECT user,host FROM mysql.user;
```
:::
刷新权限
```bash
FLUSH PRIVILEGES;
```

## 参考资料
- [MySQL5与MySQL8区别](https://www.cnblogs.com/xiaohuochai/p/11166468.html)
