---
title: Hive
sidebar_position: 1
tags: [大数据, Hive]
---

# Hive

## 概述

分布式统计分析的需求非常的大，而主要使用的是 MapReduce，但是 MapReduce 只支持程序（Java，Python 等）开发，而不支持 SQL 开发。

本质：**将 SQL 语句翻译成 MapReduce 程序**。

用处：**可以快速方便的统计分析 HDFS 中的数据**。

## 架构

- MateStore（元数据存储）
- SQL 解析器（Driver 驱动）
- 用户界面（用户和 Hive 交互）

## MateStore

**Metadata** 即元数据。元数据包含用 Hive 创建的 database、table、表的字段等元信息。元数据存储在关系型数据库中。如 Hive 内置的 Derby、第三方如 MySQL 等。

![alt text](./imgs/matestore.png)
Metastore 有三种配置方式，分别是内嵌模式、本地模式、远程模式。

### 内嵌模式

内嵌模式（Embedded Metastore）是 Metastore 默认部署模式。此种模式下，元数据存储在内置的 Derby 数据库，并且 Derby 数据库和 metastore 服务都嵌入在主 HiveServer 进程中，当启动 HiveServer 进程时，Derby 和 Metastore 都会启动。不需要额外起 Metastore 服务。但是一次只能支持一个活动用户，适用于测试体验，不适用于生产环境。

### 本地模式

本地模式（Local Metastore）下，Hive Metastore 服务与主 HiveServer 进程在同一进程中运行，但是存储元数据的数据库在单独的进程中运行，并且可以在单独的主机上。Metastore 服务将通过 JDBC 与 Metastore 数据库进行通信。 本地模式采用外部数据库来存储元数据，推荐使用 MySQL。Hive 根据 hive.metastore.uris 参数值来判断，如果为空，则为本地模式。缺点是每启动一次 Hive 服务，都内置启动了一个 Metastore 服务。

### 远程模式

远程模式（Remote Metastore）下，Metastore 服务在其自己的单独 JVM 上运行，而不在 HiveServer 的 JVM 中运行。如果其他进程希望与 Metastore 服务器通信，则可以使用 Thrift Network API 进行通信。在生产环境中，建议用远程模式来配置 Hive Metastore。在这种情况下，其他依赖 Hive 的软件都可以通过 Metastore 访问 Hive。由于还可以完全屏蔽数据库层，因此这也带来了更好的可管理性/安全性。**远程模式下，需要配置 hive.metastore.uris 参数来指定 Metastore 服务运行的机器 ip 和端口，并且需要单独手动启动 Metastore 服务**。

## 基础安装

更新时间：2024-08-25

---

官方文档：[GettingStarted](https://cwiki.apache.org/confluence/display/Hive/GettingStarted#GettingStarted-ConfigurationManagementOverview)

即用最简单可行的方式进行安装，不做过多的操作。

首先配置三个环境变量

```bash
export HADOOP_HOME=/opt/module/hadoop
export HIVE_CONF_DIR=/opt/module/hive/conf
export HIVE_HOME=/opt/module/hive
```

其次，必须要在 HDFS 中创建/tmp 和/user/hive/warehouse，并设置权限之后，才可以在 Hive 中创建表。

```bash
$HADOOP_HOME/bin/hadoop fs -mkdir       /tmp
$HADOOP_HOME/bin/hadoop fs -mkdir  -p   /user/hive/warehouse
$HADOOP_HOME/bin/hadoop fs -chmod g+w   /tmp
$HADOOP_HOME/bin/hadoop fs -chmod g+w   /user/hive/warehouse
```

初始化数据库，这里使用 derby 作为数据库。

```bash
$HIVE_HOME/bin/schematool -dbType derby -initSchema
```

然后即可正常的使用 Hive 了

```bash
$HIVE_HOME/bin/hive
```

但是我们还需要进行远程连接 Hive，所以还需要如下的配置

首先将当前用户加入到 Hadoop 的配置中，见-->[配置 Hadoop](./#配置-hadoop)

然后再更新一下 Hive 的配置文件`hive-site.xml`

```xml
<configuration>
<!-- 配置hiveserver2端口 -->
  <property>
    <name>hive.server2.thrift.port</name>
    <value>10000</value>
  </property>
  <!-- 关闭安全验证 -->
  <property>
    <name>hive.metastore.event.db.notification.api.auth</name>
    <value>false</value>
  </property>
</configuration>
```

后台启动 hive 服务

:::danger
注意 ⚠️：这里的`$HIVE_HOME/bin/hiveserver2`命令一定要先 cd 到`$HIVE_HOME/bin`目录下执行，否则会无法启动，不清楚是为什么。
:::

```bash
$HIVE_HOME/bin/hiveserver2
```

:::warning
在连接 Hive 的时候，要将用户设置为 root！！，密码不用填写，否则默认的是用户是`user=anonymous`在 hadoop 中没有权限。
:::

![alt text](./imgs/hive-link.png)

## 安装

:::tip
如果你只是为了练习 HQL，需要搭建 Hive 环境，那么我建议你直接使用 Docker 来搭建 Hive 环境，比自己搭建要便捷太多了！！！-->[docker-安装-hive](./#docker-安装-hive)
:::

:::tip
Hive 是单机工具，只需要部署在一台服务器即可。Hive 虽然是单机的，但是它可以提交分布式运行的 MapReduce 程序运行.Hive 需要使用元数据服务，即需要提供一个关系型数据库，我们也选择一台服务器安装关系型数据库即可
:::

![](./imgs/configration-review.png)

### 配置 Hadoop

Hive 控制的数据实际上是存储在 HDFS 中的，所以需要配置 Hadoop，使得 Hive 可以操作 HDFS 中的数据。在`core-site.xml`配置文件中配置。

```xml
<property>
	<name>hadoop.proxyuser.maoyan.hosts</name>
	<value>*</value>
</property>
<property>
	<name>hadoop.proxyuser.maoyan.groups</name>
	<value>*</value>
</property>
<!--这里建议把maoyan和root都添加上去-->
<property>
	<name>hadoop.proxyuser.root.hosts</name>
	<value>*</value>
</property>
<property>
	<name>hadoop.proxyuser.root.groups</name>
	<value>*</value>
</property>
```

:::warning
注意这里的 hadoop.proxyuser.maoyan.hosts，中见的 maoyan 是用户名！！！
:::

### 下载解压 Hive

使用 Hadoop 的用户来下载并解压，保证 Hive 的所属组以及用户是 Hadoop 用户。

### 配置 MySQL 驱动包

下载对应版本的 MySQL 驱动包，并将其放到 Hive 的 lib 目录下。[MySQL 驱动包](https://repo1.maven.org/maven2/mysql/mysql-connector-java/)

### 配置 Hive 的环境变量

在`/etc/profile.d`目录下创建 hive_env.sh，在其中写入

```bash
export HIVE_HOME=/opt/module/hive
export PATH=$HIVE_HOME/bin:$PATH
```

刷新环境变量

```bash
source /etc/profile.d/hive_env.sh
```

检测是否安装成功

```bash
hive --version
```

### 关联 Hadoop

可以在 Hive 的 conf 目录下，也可以在/etc/profile.d 目录下，新建一个 hive-env.sh 文件，写入如下的环境变量内容。（建议在 hive 的 conf 下创建 hive-env.sh 文件）

```bash
export HADOOP_HOME=/opt/module/hadoop
export HIVE_CONF_DIR=/opt/module/hive/conf
export HIVE_AUX_JARS_PATH=/opt/module/hive/lib
```

### 配置 Hive

官方推荐的数据库如下：
![alt text](./imgs/recommendation-database.png)
配置文件详解：[AdminManual Metastore 3.0 Administration - Apache Hive - Apache Software Foundation](https://cwiki.apache.org/confluence/display/Hive/AdminManual+Metastore+3.0+Administration "AdminManual Metastore 3.0 Administration - Apache Hive - Apache Software Foundation")

在 Hive 的 conf 目录下，新建 hive-site.xml 文件,写入如下的内容.
:::warning
`<!--高版本Mysql使用的驱动是com.mysql.cj.jdbc.Driver-->`

`<value>com.mysql.cj.jdbc.Driver</value>`
:::

```xml
<configuration>
<!--连接的数据库，我这里使用的是云服务器额数据库-->
  <property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://110.41.50.108:3306/hive</value>
  </property>
<!--使用的Mysql驱动-->
  <property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <!-- <value>com.mysql.jdbc.Driver</value> -->
<!--高版本Mysql使用的驱动是com.mysql.cj.jdbc.Driver-->
	  <value>com.mysql.cj.jdbc.Driver</value>
  </property>
  <!--访问mysql数据库的用户名-->
  <property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>root</value>
  </property>
  <!--访问mysql数据库的密码-->
  <property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>ar352878987</value>
  </property>
  <property>
		<name>hive.metastore.warehouse.dir</name>
		<value>/user/hive/warehouse</value>
    <discription>指定数据仓库的位置</discription>
	</property>
  <property>
    <name>hive.server2.thrift.bind.host</name>
    <value>hadoop101</value>
  </property>
  <!-- 设置元数据库的端口地址 -->
  <property>
    <name>hive.metastore.uris</name>
    <value>thrift://hadoop101:9083</value>
  </property>
  <!-- 设置HiveServer2的端口 -->
  <property>
    <name>hive.server2.thrift.port</name>
    <value>10000</value>
  </property>
  <property>
    <name>hive.metastore.event.db.notification.api.auth</name>
    <value>false</value>
  </property>
</configuration>
```

如下是配置解释：
![alt text](./imgs/configuration-interpretation.png)

### Docker 安装 Hive

因为我们需要使用 Hive 来做联系，但是 Hive 的安装极其的麻烦，所以我们可以使用 Docker 来快捷安装 Hive，然后再连接 Hive 容器来进行练习 HQL，安装之前我们需要配置 Docker，详见-->[docker 镜像加速](../../tools/docker/docker-operation/#docker镜像加速)。

独立启动 Metastore

```bash
docker run -d -p 9083:9083 --env SERVICE_NAME=metastore --name metastore-standalone hive:3.1.3
```

:::warning
由于 Docker 中的 Metastore 在重新启动的时候会自动执行初始化方法，所以我们可以将其挂在云服务器上防治其随机器重启。
:::

使用 MySQL 的 Metastore，独立启动

```bash
docker run -d -p 9083:9083 --env SERVICE_NAME=metastore --env DB_DRIVER=postgres \
--env SERVICE_OPTS="-Djavax.jdo.option.ConnectionDriverName=com.mysql.cj.jdbc.Driver -Djavax.jdo.option.ConnectionURL=jdbc:mysql://110.41.50.108:3306/hive -Djavax.jdo.option.ConnectionUserName=root -Djavax.jdo.option.ConnectionPassword=ar352878987" \
--mount source=warehouse,target=/opt/hive/data/warehouse \
--name metastore-standalone hive:3.1.3
```

:::danger
MySQL8+需要`com.mysql.cj.jdbc.Driver`驱动，但是似乎容器中并没有，对于 MySQL5 的版本我暂时还没有试验。
:::

安装 HiveServer2 并使用挂载用于持久化数据，**使用云服务器的 Metastore**。

```bash
docker run -d -p 10000:10000 -p 10002:10002 --env SERVICE_NAME=hiveserver2 \
--env SERVICE_OPTS="-Dhive.metastore.uris=thrift://110.41.50.108:9083" \
--mount source=warehouse,target=/opt/hive/data/warehouse \
--env IS_RESUME="true" \
--name hiveserver2 hive:3.1.3
```

`source=warehouse`在本地的路径为：`/var/lib/docker/volumes/warehouse`

## 常见的其他的配置元素

### 数据仓库位置修改

Hive 的默认仓库在 HDFS 的/user/hive/warehouse 路径下，可以在 hive-site.xml 配置文件中更改

```xml
 <property>
    <name>hive.metastore.metadb.dir</name>
    <value><地址></value>
  </property>
```

### HiveCLI 中显示数据库的，名称及列名

显示数据库：

```xml
 <property>
    <name>hive.cli.print.current.db</name>
    <value>true</value>
  </property>
```

显示列的名称

```xml
 <property>
    <name>hive.cli.print.header</name>
    <value>true</value>
  </property>
```

### 更改 Hive 配置目录的位置

通过设置`HIVE_CONF_DIR`环境变量来更改。

## 初始化元数据库

在启动 Hive 之前，以及**更改了 Hive 的配置文件之后**，需要初始化 Hive 所需的元数据库。

在 Mysql 中新建一个数据库：hive

```sql
CREATE DATABASE hive CHARSET utf8mb4;
```

执行元数据库初始化的命令：

```bash
cd /opt/module/hive
bin/schematool -initSchema -dbType mysql -verbos
```

![alt text](./imgs/init-database.png)

## 启动 Hive

我们知道 Hive 控制的是 Hadoop 中的数据，所以我们同样的需要 Hadoop 用户才能启动 Hive，并且在启动 Hive 之前需要已经启动了 Hadoop。Hadoop 的启动见-->[Hadoop](../hadoop)

### 启动 MetaStore

那么我们知道，Hive 中的 MetaStore 是元数据，保存了 Hive 创建的数据库、表、视图、函数等信息，所以我们需要启动 Hive 的 MetaStore 服务，才能让 Hive 正常工作。

启动 Hive 的 MetaStore 服务：

前台启动：

```bash
bin/hive --service metastore
```

后台启动：

```bash
nohup /opt/module/hive/bin/hive --service metastore >> /opt/module/hive/logs/metastore.log 2>&1 &
```

:::tip
后台启动将 Hive 的日志输出到指定的文件中，方便查看。
:::

### 启动 Hive

Hive Shell 方式：

```bash
bin/hive
```

Hive ThriftServer 方式（可以使用第三方的客户端，比如 DataGrip）：

```bash
bin/hive --service hiveserver2
```

## DataGrip 链接 Hive

:::warning
这里无需输入密码，直接使用 Hadoop 用户即可连接。
:::

![alt text](./imgs/datagrip-hive.png)

## 测试 Hive

官方文档中表明：
![alt text](./imgs/hive-create-table.png)
由于目录已经存在，所以设置一下权限即可

```bash
hadoop fs -chmod g+w /tmp
hadoop fs -chmod g+w /user/hive/warehouse
```

创建测试表

```sql
CREATE TABLE test(id INT, name STRING, gender STRING);
```

插入测试数据

```sql
INSERT INTO test VALUES(1,'maoyan','男');
```

Hive 第一次插入数据会非常的慢。

查询数据

```sql
SELECT gender, COUNT(*) AS cnt FROM test GROUP BY gender;
```

## Hive 脚本

## Hive On Spark

首先，我们需要理解两个概念：

- Hive on Spark： Hive 作为元数据存储，且负责 SQL 的解析与优化，语法是 HQL 语法，执行引擎是 Spark。
- Spark on Hive： Hive 只作为元数据村吃，Spark 作为执行引擎，且负责 SQL 的解析与优化，语法是 Spark SQL 语法。

将 Spark-3.3.1-bin-without-hadoop.tgz 解压到 /opt/module/spark 目录下。

在 /opt/module/spark/conf 目录下创建 spark-env.sh 文件，并添加以下内容：

```bash
export JAVA_HOME=/opt/module/jdk
export HADOOP_HOME=/opt/module/hadoop
export HIVE_HOME=/opt/module/hive
```

配置 Spark 的环境变量

```bash
vim /etc/profile.d/spark.sh
```

添加以下内容：

```bash
export SPARK_HOME=/opt/module/spark
export PATH=$PATH:$SPARK_HOME/bin:$SPARK_HOME/sbin
```

生效环境变量

```bash
source /etc/profile.d/spark.sh
```

在 hive 的配置文件目录 `/opt/module/hive/conf` 中创建 spark 的配置文件 `spark-defaults.conf`，并添加以下内容：

```bash
spark.master                    yarn
spark.eventLog.enabled           true
spark.eventLog.dir               hdfs://hadoop101:8020/spark-logs
spark.yarn.jars                  hdfs://hadoop101:8020/spark-jars/*
spark.executor.memory            1g
spark.driver.memory              1g
```

在 HDFS 中创建 `spark-logs` 和 `spark-jars` 目录

```bash
hadoop fs -mkdir -p /spark-logs
hadoop fs -mkdir -p /spark-jars
```

将 `/opt/module/spark/jars` 目录下的所有 jar 包上传到 `/spark-jars` 目录下。

```bash
hadoop fs -put /opt/module/spark/jars/* /spark-jars
```

在 hive 的配置文件目录 `/opt/module/hive/conf` 中创建 spark 的配置文件 `hive-site.xml`，并添加以下内容：

```xml
<property>
	<name>hive.execution.engine</name>
	<value>spark</value>
</property>
<property>
```

然后即可快乐的使用 Spark 来代替 MapReduce 来执行 Hive 的查询任务了。

## 常见问题

### JsonSerDe 异常

在 ODS 层使用了 JsonSerDe 的序列化器，当时有的表字段无法显示，需要在 Hive 中的配置文件中添加此序列化器。

在 hive-site.xml 中添加

```xml
<property>
	<name>metastore.storage.schema.reader.impl</name>
	<value>org.apache.hadoop.hive.metastore.SerDeStorageSchemaRead
 er</value>
</property>
```

### 使用 load 加载数据之后，原数据消失

[【Hive】使用load导入文件数据却导致文件消失](https://blog.csdn.net/heiren_a/article/details/122456624)