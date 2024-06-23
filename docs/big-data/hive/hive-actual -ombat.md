---
title: Hive实战
sidebar_position: 4
tags: [大数据, Hive]
---

## 初级

### 环境准备

#### 建表语句

```sql
-- 创建学生表
DROP TABLE IF EXISTS student_info;

create table if not exists student_info(
    stu_id string COMMENT '学生id',
    stu_name string COMMENT '学生姓名',
    birthday string COMMENT '出生日期',
    sex string COMMENT '性别'
)
row format delimited fields terminated by ','
stored as textfile;

-- 创建课程表
DROP TABLE IF EXISTS course_info;

create table if not exists course_info(
    course_id string COMMENT '课程id',
    course_name string COMMENT '课程名',
    tea_id string COMMENT '任课老师id'
)
row format delimited fields terminated by ','
stored as textfile;

-- 创建老师表
DROP TABLE IF EXISTS teacher_info;
create table if not exists teacher_info(
    tea_id string COMMENT '老师id',
    tea_name string COMMENT '学生姓名'
)
row format delimited fields terminated by ','
stored as textfile;

-- 创建分数表
DROP TABLE IF EXISTS score_info;
create table if not exists score_info(
    stu_id string COMMENT '学生id',
    course_id string COMMENT '课程id',
    score int COMMENT '成绩'
)
row format delimited fields terminated by ','
stored as textfile;
```

#### 数据准备

#### 加载数据

```sql
load data local inpath '/opt/module/hive/test/data/student_info.txt' into table student_info;
load data local inpath '/opt/module/hive/test/data/course_info.txt' into table course_info;
load data local inpath '/opt/module/hive/test/data/teacher_info.txt' into table teacher_info;
load data local inpath '/opt/module/hive/test/data/score_info.txt' into table score_info;
```

验证是否插入数据成功

```sql
select * from student_info limit 5;
select * from course_info limit 5;
select * from teacher_info limit 5;
select * from score_info limit 5;
```

### 简单查询

#### 查询姓名中带“山”的学生名单

```sql
SELECT  * FROM student_info WHERE stu_name LIKE "%山%";
```

#### 查询姓“王”老师的个数

```sql
SELECT COUNT(*) FROM teacher_info ti WHERE tea_name LIKE "王%";
```

#### 检索课程编号为“04”且分数小于 60 的学生的课程信息，结果按分数降序排列

```sql
select
    stu_id,
    course_id,
    score
from score_info
where course_id ='04' and score<60
order by score desc;
```

#### 查询数学成绩不及格的学生和其对应的成绩，按照学号升序排序

```sql
SELECT stu_id,score FROM score_info si
WHERE si.course_id = (SELECT course_id FROM course_info ci WHERE ci.course_name = "数学")
AND score < 60
ORDER BY stu_id;
```

### 汇总分析

#### 查询编号为“02”的课程的总成绩

```sql
SELECT SUM(si.score) FROM course_info ci
left join score_info si on si.course_id = ci.course_id
WHERE ci.course_id = 02;
```

#### 查询参加考试的学生个数

```sql
SELECT COUNT(DISTINCT stu_id) FROM score_info si2 ;
```

考察 `distinct` 去重

### 分组

#### 查询各科成绩最高和最低的分

```sql
SELECT MAX(score),MIN(score)  FROM score_info si
left join course_info ci on ci.course_id = si.course_id
GROUP BY si.course_id
```

- 考察`group by`分组
- `MAX`和`MIN`函数的使用

:::tip
在使用`group by`分组之后，select 查询的字段，只能是分组字段，或者使用聚合函数
:::

#### 查询每门课程有多少学生参加了考试（有考试成绩）

```sql
select
    course_id,
    count(stu_id) stu_num
from score_info
group by course_id;
```

