---
title: Mybatis代码生成器
tags:
  - Java
  - Mybatis
---

## 遇到的问题

### longtext/text 类型无法映射

例如我的 Blog 的见表语句为:

```sql
drop table if exists t_blog;
create table t_blog
(
    id            bigint(0)    not null auto_increment comment '主键ID',
    title         varchar(255) not null comment '标题',
    content       longtext     not null comment '内容',
    first_picture varchar(255) comment '首图',
    description   varchar(255) not null comment '描述',
    status        int(0)       not null default 1 comment '状态',
    create_time   datetime(0)           default now() comment '创建时间',
    update_time   datetime(0)           default now() comment '更新时间',
    type_id       bigint(0) comment '分类ID',
    author_id     bigint(0)    not null comment '作者ID',
    primary key (id)
) engine = innodb
  auto_increment = 1
  character set = utf8mb4
    comment = '博客表';
```

可以看到 content 的字段为 longtext，但是正常生成代码之后，在 TBlogExample.java 文件中没有 content 字段，因为 Mybatis-Generator 默认不支持 longtext/text 类型的映射，需要手动修改。

所以我们可以将配置文件更改为：

```xml {25-27} showLineNumbers
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <!--连接数据库-->
    <context id="simple" targetRuntime="MyBatis3">
        <!-- 配置MBG要连接的数据库信息 -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://110.41.50.108:3306/blog?useUnicode=true&amp;characterEncoding=utf-8&amp;serverTimezone=Asia/Shanghai"
                        userId="root"
                        password="ar352878987">
            <!-- 解决mysql驱动升级到8.0后不生成指定数据库代码的问题 -->
            <property name="nullCatalogMeansCurrent" value="true"/>
        </jdbcConnection>
        <!-- 用于控制实体类的生成 -->
        <javaModelGenerator targetPackage="com.maoyan.model" targetProject="src/main/java"/>
        <!-- 用于控制Mapper.xml文件的生成 -->
        <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>
        <!-- 用于控制Mapper接口的生成 -->
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.maoyan.mapper"
                             targetProject="src/main/java"/>
        <!-- 配置需要生成的表，生成全部表tableName设为% -->
        <table tableName="%"/>
        <table tableName="t_blog">
            <columnOverride column="content" javaType="java.lang.String" jdbcType="VARCHAR"/>
        </table>
    </context>
</generatorConfiguration>
```

:::tip
先使用%对应所有的表，再单独对 content 字段进行修改。
:::
