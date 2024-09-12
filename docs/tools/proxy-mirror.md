---
title: 代理与镜像
---

## Pip

使用清华镜像源

```bash
pip install some-package -i https://pypi.tuna.tsinghua.edu.cn/simple
```

使用 VPN 代理

```bash
pip install opencv-python --proxy=127.0.0.1:10809
```

## 终端

使用代理

```bash
export http_proxy=http://127.0.0.1:10809
export https_proxy=http://127.0.0.1:10809
```

## Docker

:::warning

Docker 已经无法使用镜像加速器，使用镜像源速度也很慢，推荐使用 GitHub Action 将镜像拉到自己的阿里云镜像服务器，然后再从自己的阿里云镜像服务器中拉取。详见-->[镜像加速](./docker/docker-operation/#docker-镜像加速)

:::

## Git

查看代理

```bash
git config --get http.proxy
git config --get https.proxy
```

设置代理

```bash
git config --global http.proxy http://127.0.0.1:10809
git config --global https.proxy http://127.0.0.1:10809
```

取消代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## npm

查看代理

```bash
npm config get proxy
npm config get https-proxy
```

设置代理

```bash
npm config set proxy http://127.0.0.1:10809
npm config set https-proxy http://127.0.0.1:10809
```

取消代理

```bash
npm config delete proxy
npm config delete https-proxy
```

## pnpm

查看代理

```bash
pnpm config get proxy
pnpm config get https-proxy
```

设置代理

```bash
pnpm config set proxy http://127.0.0.1:10809
pnpm config set https-proxy http://127.0.0.1:10809
```

取消代理

```bash
pnpm config delete proxy
pnpm config delete https-proxy
```
