---
title: Linux 服务管理
sidebar_position: 3
tags: [Linux]
---

## 配置 SSH

### 禁止 SSH 的 root 登录

SSH 服务的配置文件在/etc/ssh/sshd_config 文件中，对其进行编辑。

将其中的

```bash
PermitRootLogin yes
```

更改为 no，保存并关闭文件。

重新启动 SSH 服务

```bash
sudo service ssh restart
# 或者
sudo systemctl restart sshd
```

### 禁止 Tcp 端口转发和 X11 转发

同样的在/etc/ssh/sshd_config 文件中，找到

- X11Forwarding yes
- AllowTcpForwarding yes

都将其改为 no，然后再重启 SSH 服务即可。

## 配置防火墙

Linux 上管理防火墙的工具主要有两种，分别是`firewalld` 和 `iptables`。

### Firewalled 和 Iptables 的区别

在某些 Linux 发行版中，`firewalld` 可以看作是对 `iptables` 的一种封装和简化，提供了更易于使用的界面。 **（所以推荐使用 firewalled）**

### **查看当前防火墙的状态**

```bash
systemctl status firewalld
```

### **关闭防火墙，以及关闭防火墙的自启动**

```bash
systemctl stop firewalld
systemctl disable firewalld.service
```

### **启动防火墙**

```bash
systemctl start firewalld
```

### **查看当前防火墙放行的端口**

```bash
# 使用firewall-cmd命令查看（推荐）
firewall-cmd --list-all
```

```bash
# 使用iptables命令查看
sudo iptables -L
```

### **放行指定的端口**

使用`firewall`命令放行端口（**推荐**）

```bash
firewall-cmd --zone=public --add-port=<端口号>/<协议> --permanent
firewall-cmd --reload
```

- 协议：如`tcp`或者`udp`
- 端口号：就是端口号

## 时间同步

参考-->[阿里云帮助中心](https://help.aliyun.com/zh/ecs/user-guide/alibaba-cloud-ntp-server)

首先我们需要先安装`chrony`

```bash
yum install chrony
```

### 配置时间服务器

```bash
sudo vim /etc/chrony.conf
```

注释掉其他的 server，新增一个阿里云的 ntp 服务器

```bash
server ntp.aliyun.com minpoll 4 maxpoll 10 iburst
```

重启 chronyd 服务，并设置为自启动

```bash
sudo systemctl restart chronyd.service
sudo systemctl enable chronyd.service
```

检查时间同步

```bash
sudo chronyc tracking
```

执行如下命令查看时间同步服务器列表

```bash
sudo chronyc -n sources -v
```

当配置完成后，可以查看当前的系统时间

```bash
date
```
