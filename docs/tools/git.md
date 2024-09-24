---
title: Git
tags: [Git，GitHub]
---

## 常用操作

### 分支信息

查看分支

```bash
# 查看所有分支
git branch -a
# 查看本地分支
git branch
# 查看远程分支
git branch -r
```

### 本地与远程信息

查看远程仓库信息

```bash
# 查看远程仓库信息
git remote -v
```

查看提交记录

```bash
# 查看提交记录
git log
# 查看云端提交记录
git log <远程仓库名，一般为origin>/<远程分支名，一般为main>
git log origin/main
```

## 案例：将本地的更新推送到远程仓库

```bash
git add .
git commit -m "update"
git push origin main
```

## 案例：将本地 main 分支推送到远程 dev 分支

确保本地仓库与远程仓库连接

```bash
git remote add origin <your-repository-url>
```

查看远程仓库的信息

```bash
git remote -v
```

将本地 main 分支推送到远程 dev 分支

```bash
git push origin main:dev
```

- origin：远程仓库名
- main：本地分支名
- dev：远程分支名

:::note
如果远程仓库不存在，则会创建一个新的远程仓库。
:::

也可以先在本地创建一个 dev 分支，然后推送到远程仓库

```bash
git checkout -b dev
git push origin dev
```

确认推送结果

```bash
git branch -r
```
