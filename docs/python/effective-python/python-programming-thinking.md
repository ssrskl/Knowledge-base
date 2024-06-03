---
title: 培养Python编程思维
sidebar_position: 1
tags: [Python]
---

# 培养Python编程思维
## 1.6 把数据结构直接拆分到多个变量中，不通过下标访问

## 1.7 尽量使用enumerate取代range
使用range的例子
```python
for i in range(len(lst)):
    print(lst[i])
```
使用enumerate的例子
```python
for i, item in enumerate(lst):
    print(item)
```
enumerate对比range的优点：
- enumerate会返回一个迭代器，而range返回的是一个列表。
- enumerate可以**同时获取索引和对应的值**。
enumerate的第二个参数可以指定起始值：
```python
for i, item in enumerate(lst, 1):
    print(item)
```
## 1.8 使用zip函数同时遍历两个迭代器

:::warning
如果两个迭代器的长度不一致，则只遍历到**较短的那个迭代器**的长度。
如果想按照最长的迭代器来遍历，则需要使用`itertools.zip_longest`函数。
:::

在迭代的过程中，每次生成一个元组，包含两个迭代器中的对应元素。
```python
list1 = [1, 2, 3]
list2 = ['a', 'b', 'c', 'd']
for x, y in zip(list1, list2):
    print(x, y)
# 1 a
# 2 b
# 3 c
```