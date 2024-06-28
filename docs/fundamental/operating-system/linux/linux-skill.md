---
title: Linux常用小技巧
tags: [Linux]
---

## 操作系统是什么时候安装的

```bash
ls -lct /etc/ | tail -1 | awk '{print $6, $7, $8}'
```

如果是基于 RedHat 的发行版，例如 RedHat、CentOS、Fedora 等，可以使用如下命令：

```bash
rpm -qi basesystem
```

![alt text](./imgs/system-os-install-data.png)

## 对比文件差异

```bash
diff Caddyfile test.txt -y
```

## 查询登录 SSH 的 IP 次数

查看登录失败的 IP 次数

```bash
grep -i "Failed password" /var/log/secure | awk '{if ($11 ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) print $11 ; else print $13 }' | uniq -c | sort -nr -k1
```

查看登录成功的 IP 次数

```bash
grep -i "Accepted password" /var/log/secure | awk '{if ($11 ~ /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/) print $11 ; else print $13 }' | uniq -c | sort -nr -k1
```

## 配置 SSH 登录失败 3 次锁定 10 分钟

## tee 命令

三通命令，将收到的命令写入到标准输出，并输出到指定的地方。

例如：

```bash
ls | tee /tmp/saved_output | less
```

将 ls 命令的输出保存到文件，并使用 less 命令查看文件内容。

### 投影终端到其他的用户窗口

将标准输入重定向到`/dev/null`，并通过`tee`命令将输出定向到标准输出以及另外一个窗口。

```bash
script /dev/null | tee /dev/pts/3
```

### 记录登录服务器的所有操作

```bash
ssh <远程服务器> | tee ssh-$(data "+%F_%T").log
```
