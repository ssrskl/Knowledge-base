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

### 单表单列重复

例如：[查找重复的电子邮箱](./exercises/duplicate-emails/#思考)

使用**自连接然后去重**的方式来解决。

```sql
select distinct p1.email as Email
from Person as p1
inner join Person as p2
on p1.id != p2.id and p1.Email = p2.Email
```

### 单表双列重复

[586. 订单最多的客户](https://leetcode.cn/problems/customer-placing-the-largest-number-of-orders/description/)

## 连续问题

### 连续出现的数字

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

### 连续的数据

这里的数据可以涵盖很多的例子，比如连续的 ID，连续的日期等，我们可以借助`row_number()`开窗函数与连续的数据斜率相同，通过两者相减，即可进行分组。

例如这个题目：[601. 体育馆的人流量](https://leetcode.cn/problems/human-traffic-of-stadium/description/)

```sql
with t1 as(
    select *,id - row_number() over(order by id) as rk
    from stadium
    where people >= 100
)

select id,visit_date,people
from t1
where rk in(
    select rk
    from t1
    group by rk
    having count(rk) >= 3
)
```

通过`id - row_number() over(order by id) as rk`来得到连续的数据，然后再分组，然后通过`having`来判断是否大于 3 即可。

那么假设我们需要求取连续的日期，我们只需要在原始的表上添加一个自增的字段即可。

## 行列转换

### 列转行

列转行：就是将列名作为数据存储在行中，列转行使用多个 select+union 来实现。

例如：[1795. 每个产品在不同商店的价格](./exercises/rearrange-products-table)

### 行转列

