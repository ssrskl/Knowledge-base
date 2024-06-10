---
title: Hive的使用
sidebar_position: 3
tags: [大数据, Hive]
---

# Hive 的使用

## 数据类型

### 原生数据类型

### 复杂数据类型

### 类型转换

## 加载数据

### 原始加载数据

原始的方式是通过`hadoop fs –put|-mv`等方式直接将数据移动到表文件夹下，例如：

```bash
hadoop fs -put /opt/module/datas/student.txt /user/hive/warehouse/student
```

### load 加载数据

语法规则：

```sql
LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)]

LOAD DATA [LOCAL] INPATH 'filepath' [OVERWRITE] INTO TABLE tablename [PARTITION (partcol1=val1, partcol2=val2 ...)] [INPUTFORMAT 'inputformat' SERDE 'serde'] (3.0 or later)
```

- LOCAL

1. 指定了 LOCAL，将在本地的文件目录查找文件路径。
2. 没有指定 LOCAL：将在 HDFS 中查找文件路径，即 hadoop 中的 fs.default.name 参数。

- OVERWRITE：目标表（或者分区）中的已经存在的数据会被删除

## 插入数据

本质上是使用 MapReduce 将数据写入到 Hive 表中的。

## 拉链表

## Hive 函数

### 自定义函数

用户的自定义函数分为三类：

1. UDF（User Defined Function）：输入输出为一行，返回一个值。
2. UDAF（User Defined Aggregation Function）：用户聚合函数，类似于 count 等，输入输出为多进一出。
3. UDTF（User Defined Table-Generating Function）：用户自定义表生成函数，输入为一行，输出为多行。

自定义函数的实现方式大致如下：

1. 继承 Hive 提供的类

```java
org.apache.hadoop.hive.ql.udf.generic.GenericUDF
org.apache.hadoop.hive.ql.udf.generic.GenericUDTF
```

2. 实现类中的抽象方法
3. 在 Hive 中使用自定义的函数
4. 在 Hive 中删除自定义函数

### 创建 UDF 自定义函数

我们以一个计算字符串长度的函数为例，来演示如何创建一个自定义函数，函数名称为：`get_string_len`。

1. **创建一个 Maven 项目，并在 pom.xml 中添加依赖。**

```xml
<dependency>
    <groupId>org.apache.hive</groupId>
    <artifactId>hive-exec</artifactId>
    <version>3.1.3</version>
</dependency>
```

2. **创建一个类，继承 org.apache.hadoop.hive.ql.udf.generic.GenericUDF。**

```java
public class GetStringLen extends GenericUDF {

    public GetStringLen() {
    }

    @Override
    public ObjectInspector initialize(ObjectInspector[] arguments) throws UDFArgumentException {
        return ObjectInspectorFactory.getStandardListObjectInspector(

)
```

3. **创建临时函数**

   临时函数指的是这个函数只跟会话相关，<span style={{color:'red',fontWeight:'bold'}}>跟库没有关系，当会话结束之后，临时函数就自动被删除了</span>。

- 首先将函打包为`jar`包，并上传到`hive`的`datas`目录下
- 然后进入 hive 中，使用 add 命令将`jar`包添加到`hive`的`classpath`中

```sql
add jar /opt/module/hive/datas/GetStringlen.jar;
```

- 创建临时函数，并与开发好的 Java Class 相关联。

```sql
create temporary function get_string_len as "com.maoyan.hive.udf.GetStringLen";
```

- 然后即可使用自定义的函数

```sql
select get_string_len('abcd')
```

- 删除临时函数

```sql
drop temporary function get_string_len;
```

4. **创建永久函数**

在 Hive 的主目录下，我这里使用的是`/opt/module/hive`，在此目录下创建`auxlib`目录。然后将 jar 包上传到此目录下，然后重启 Hive。

接下来就可以创建我们的永久函数了。

```sql
create function get_string_len as 'com.maoyan.hive.udf.GetStringLen'
```

删除永久函数

```sql
drop function get_string_len;
```

### 创建 UDTF 自定义函数

### 总结

#### 创建 UDF 自定义函数

Q：UDF 函数是什么？

A：输入输出一进一出的函数。

Q：UDF 函数的实现方式？

A：继承 org.apache.hadoop.hive.ql.udf.generic.GenericUDF 类。

## Hive 的数据压缩

## Hive 调优

Hive 的优化需要与业务需求相结合，根据数据类型，分布，质量等实际情况来进行优化。Hive 的底层是 mapReduce，所以 Hadoop 的优化也是 Hive 优化的基础。Hive 的优化包含 Hive 的参数优化，数据倾斜的解决，HQL 优化等方面。

## 题目练习
