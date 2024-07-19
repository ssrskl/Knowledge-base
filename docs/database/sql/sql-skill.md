---
id: sql-skill
title: SQL 技巧
sidebar_position: 3
tags:
  - SQL
  - 数据库
  - 技巧
---

## 首字母大写

具体的思路为：可以配合字符串截取函数和字符串转大小写函数和，再配合字符串连接函数即可

```sql
SELECT
    id,
    CONCAT(UPPER(LEFT(name, 1)), LOWER(SUBSTRING(name, 2))) AS capitalized_name
FROM
    people;

```

## 对方没有的

对于两个格式相同的表，我们可以使用 union 或者 union all 来合并两个表，然后使用 not in 或者 not exists 来找到对方所没有的。

```sql {4-6} showLineNumbers
select
    employee_id
from
    Employees
where
    employee_id not in (select employee_id from Salaries)
union all
select
    employee_id
from
    Salaries
where
    employee_id not in (select employee_id from Employees)
    order by
    employee_id asc
```

但是对于格式不同的表，我们可以使用 **左连接+null** 的条件判断来实现。

```sql {2,4}
select c.name as Customers from Customers as c
left join Orders o
on c.id = o.customerId
where o.customerId is null
```

## 两表差异（补集）

由于 MySQL 中并没有 full outer join，所以求两个表的补集，**即对方所没有的**，可以先将两个表使用合并，然后再使用和找到只出现一次的。

```sql {4-6} showLineNumbers
select
    employee_id
from
(SELECT employee_id FROM Employees
UNION ALL
SELECT employee_id FROM Salaries) as t
group by
    employee_id
having
    count(*) = 1
order by
    employee_id asc
```

## 查询第几个

一般我们常见的都是查询第一个或者最后一个，而当我们需要查询第 n 个的时候，我们可以使用 limit 和 offset。offset 表示从第几行开始返回。如下表示返回第二行的数据，且只返回这一行。

```sql
select
	*
from
	tablename
limit
	1
offset
	1
-- 也可以简写为
limit 1,1
```

## 单表重复

例如：[查找重复的电子邮箱](./exercises/duplicate-emails/#思考)

使用**自连接然后去重**的方式来解决。

```sql
select distinct p1.email as Email
from Person as p1
inner join Person as p2
on p1.id != p2.id and p1.Email = p2.Email
```

## 连续问题

比如一个值连续出现了几次的问题：[连续出现的数字](./exercises/consecutive-numbers.md/#思考)

对于连续的问题，通过自连接 n 次，每次的连接都是与下一个字段进行连接来实现。

```sql
SELECT DISTINCT
    l1.Num AS ConsecutiveNums
FROM
    Logs l1,
    Logs l2,
    Logs l3
WHERE
    l1.Id = l2.Id - 1
    AND l2.Id = l3.Id - 1
    AND l1.Num = l2.Num
    AND l2.Num = l3.Num
```
