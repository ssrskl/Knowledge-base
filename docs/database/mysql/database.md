---
title: 数据库
tags:
  - 数据库
---

## 事物

### 隔离级别

事物并发带来的问题：

1. 脏读：读了别人没有提交的数据
2. 不可重复读：多次读取同一个数据发现数据不一致
3. 幻读：两次查询结果发现条数不一致
4. 数据丢失：

四种隔离级别：

1. 读取提交内容：

#### MySQL 的隔离级别

MySQL 默认隔离级别是可重复读，MySQL 通过 MVCC(多版本并发控制)的方式实现的，InnoDB 为每一行数据添加了一个事物 ID，当事物 ID 写入后，如果数据被修改了，版本号就会+1，事物就无法读取更新后的数据了。

## MySQL 的存储引擎

MySQL 中常用的存储引擎有 MyISAM，InnoDB，MEMORY，ARCHIVE，默认存储引擎为 InnoDB。支持 ACID，行锁和外键。

## 数据库的锁 🔒

在多个用户同时操作同一个数据时，可能会出现并发问题，需要对数据进行加锁，保证数据的一致性。

### 悲观锁

每次拿数据的时候都会认为数据会被修改，所以都上锁。

#### 共享锁

S 锁，读锁，用于所有的只读的数据操作。为了保证在读取这一页或者这个表的时候，其他事务不能对这一页或者这张表进行修改。

- 多个事物可以锁同一个共享页
- 任何事物不可修改
- 读取完毕后，S 锁立即释放

#### 排他锁

X 锁，写锁，用于对数据的写操作。

- 只有一个事物可以锁定此页
- 这个事物不解锁，其他事物无法访问
- X 锁到事物结束才释放

### 乐观锁

## 数据库索引

[一个动画搞懂 MySQL 索引原理！](https://www.bilibili.com/video/BV1pJ4m1j7Pm/?spm_id_from=333.337.search-card.all.click&vd_source=ebd98163213e8a772c16f0e50f1d313b)

### Hash 索引

### B Tree

### B+ Tree

### B Tree 与 B+ Tree 的区别

- B 树的叶子节点和非叶子节点都存储数据，时间复杂度为 O(1)到 O(logn)，不稳定，B+Tree 只有叶子节点存储数据，时间复杂度为固定 O(logn)。所以 B+Tree 的非叶子节点中能够存放更多的范围数据，使得数更加的扁平查找更快。查询效率更加稳定。
- B+Tree 的叶子节点使用链表连接，更适合使用范围查找，而 BTree 只能那个中序遍历。

### 哈希索引与 B+ Tree 索引的区别