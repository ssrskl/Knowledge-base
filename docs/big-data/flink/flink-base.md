---
title: Flink 基础概念
tags: [大数据, Flink]
---

## Flink 中的 API

Flink 为流式/批式处理应用程序的开发提供了不同级别的抽象。

![alt text](./imgs/flink-api.png)

- Table API 提供了更高的抽象级别。它是基于表的概念，允许用户以声明性的方式处理数据，类似于 SQL。用户可以使用 SQL-like 语法进行数据转换和分析，这使得复杂的数据处理操作更易于理解和实现。
- DataStream API 提供了更低的抽象级别，直接处理数据流（events）。它允许用户通过编程方式详细控制每个数据项的处理逻辑，适合于需要精细操作的场景。
- Table API 适用于结构化数据处理，特别是当处理逻辑可以用 SQL 表达式清晰表达时。它适合进行聚合、连接、过滤等操作。
- DataStream API 适用于需要对数据流进行详细处理的场景，如对数据流进行复杂的转换、自定义的窗口操作或需要处理时间特性的场景。

## Flink Data Source

官方文档：

[DataStream Connectors](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/connectors/datastream/overview/)

[Data Sources](https://nightlies.apache.org/flink/flink-docs-release-1.14/zh/docs/dev/datastream/overview/#data-sources)

每个 Flink 数据流都以一个 Source（或可能多个）开始。这就是数据的由来。该数据可以通过**编程方式创建，可以从文件或数据库中读取，也可以来自 Apache Kafka 等流媒体平台**。根据源的性质，数据流可能是<span style={{color:'red',fontWeight:'bold'}}>有限的</span>，也可能是<span style={{color:'red',fontWeight:'bold'}}>无限的</span>。了解其中的差异对于在流中实现某些类型的操作非常重要。

一些比较基本的 Source 和 Sink 已经内置在 Flink 里，比如常见的基于文件，集合以及套接字，例子如下：

readTextFile(path) - 读取文本文件，例如遵守 TextInputFormat 规范的文件，逐行读取并将它们作为字符串返回。

```java
DataSource<String> stringDataSource = env.readTextFile("input/word.txt");
```

:::warning
但是 `readTextFile` 方法已经被弃用，现在新的 Source 架构推荐使用`FileSource`-->[FileSystem](https://nightlies.apache.org/flink/flink-docs-release-1.19/docs/connectors/datastream/filesystem/)
:::

readFile(fileInputFormat, path) - 按照指定的文件输入格式读取（一次）文件。

fromCollection(Collection) - 从 Java Java.util.Collection 创建数据流。集合中的所有元素必须属于同一类型。

fromElements(T ...) - 从给定的对象序列中创建数据流。所有的对象必须属于同一类型。

```java
DataSource<Integer> integerDataSource = env.fromElements(1, 2, 3, 4);
```

generateSequence(from, to) - 基于给定间隔内的数字序列*并行*生成数据流。

```java
 DataSource<Long> longDataSource = env.generateSequence(1, 10);
```

---

但是，当我们需要与第三方进行交互的时候，我们就需要使用到 DataStream Connectors 即数据流连接器。

### 数据生成器

Flink 从 1.11 开始提供了一个内置的 DataGen，用于生成一些随机数。

```java
        // 数据生成器
DataGeneratorSource<String> source =
        new DataGeneratorSource<>(
                index -> "String" + index,
                10,
                RateLimiterStrategy.perSecond(1),
                Types.STRING
        );
```

也可以使用这种写法

```java
DataGeneratorSource<String> source =
                new DataGeneratorSource<>(
                        new GeneratorFunction<Long, String>() {
                            @Override
                            public String map(Long aLong) throws Exception {
                                return "Number" + aLong;
                            }
                        },
                        10,
                        RateLimiterStrategy.perSecond(1),
                        Types.STRING
                );
```

- 第一个参数是`GeneratorFunction`方法，重写了 map 方法。
- 自增的范围
- 限速策略，比如每秒生成几条数据
- 返回类型

### 文件数据源

首先我们需要添加依赖：

```xml
<dependency>
    <groupId>org.apache.flink</groupId>
    <artifactId>flink-connector-files</artifactId>
    <version>1.19.0</version>
</dependency>
```

:::warning
1.19.0 似乎镜像没有更新，所以我先使用的是 1.18.1 版本
:::

```java
FileSource<String> source  = FileSource.forRecordStreamFormat(
                new TextLineInputFormat(),
                new Path("input/word.txt")
        ).build();
```

### Kafka 数据源

```java

```

## Flink 序列化

Flink 的序列化包含两种，分别是外部序列化和内部序列化。

![alt text](./imgs/flink-serialization.png)

- 当数据被拉入流，并从另一端推出的时候，有可能在中间使用了外部的系统，所以对象正在被外部系统使用，即为外部序列化。
- 但是当数据在 Flink 的算子之间传输的时候，也需要将其序列化，此时即为内部序列化。

如果一个类满足旧 Java 对象（POJO）的标准，那么 Flink 将会更有效的方式序列化它。

POJO 定义标准：

1. 类是公共的`public`
2. 要有默认构造函数
3. 所有的字段必须是公共的，或者有 getter 和 setter 方法。
4. 要有一个合适的序列化器。

否则，Flink 将会使用较慢的`Kryo`序列化器，可能使得性能降低 75%。可以通过序列化器注册自己的类型来改进`Kryo`序列化，但是仍然比不上 POJO 序列化器。

当然也可以禁用`kryo`序列化器，需要确保数据类型符合 POJO 要求，或者使用自定义的序列化器，一般使用`Avro`序列化器。

## 基本算子

### Map

Map 转换算子，接收一个元素，并返回一个元素。有三种写法，分别是使用匿名实现类，或者使用 lambda 表达式，也可以自定义一个自己的 MapFunction，然后使用我们自己的 Function 来对数据进行处理。

```java
// 数据处理
SingleOutputStreamOperator<String> map = datasource.map(new MapFunction<String, String>() {
    @Override
    public String map(String s) throws Exception {
        return "Number:" + s;
    }
});
SingleOutputStreamOperator<String> map1 = datasource.map(new MyMapFunction());
map1.print();
```

或者使用 lambda 表达式

```java
DataStream<String> map = source.map(s -> s.toUpperCase());
```

使用自己的 MapFunction，定义一个类`MyMapFunction`

```java
public class MyMapFunction implements MapFunction<String, String> {
        @Override
        public String map(String s) throws Exception {
            return "Number::" + s;
        }
    }
```

```java
SingleOutputStreamOperator<String> map = datasource.map(new MyMapFunction());
```

### Filter

fliter 转换算子，对每一个数据进行判断，为 true 则正常输出，为 false 则元素被过滤掉。

```java
// 数据过滤
        SingleOutputStreamOperator<String> filteredData = datasource.filter(new FilterFunction<String>() {
            @Override
            public boolean filter(String s) throws Exception {
                if (Long.parseLong(s) % 2 == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        });
```

### FlatMap

扁平映射，将数据流中的整体拆分为一个个的个体使用，一进多出。它与 map 算子的主要区别在于 map 每次处理一个元素，产生一个元素；而 flatMap 可以从每个输入元素产生任意多个输出元素（包括零个）。

例如如下的例子：将一个字符串拆分为一个一个一个的单词，使用 flatMap 算子。

```java
// 创建数据源
DataStreamSource<String> dataSource = env.fromElements("Hello,World", "Hello,Flink");
// 处理数据
    SingleOutputStreamOperator<String> words = dataSource.flatMap(new FlatMapFunction<String, String>() {
    @Override
    public void flatMap(String s, Collector<String> collector) throws Exception {
        for (String word : s.split(",")) {
            collector.collect(word);
        }
    }
});
// 打印数据
words.print();
```

:::tip
FlatMap 使用`Collector`来收集数据，调用几次就输出几条。
:::

## 聚合算子

### 分区与分组

### KeyBy

这里我们在 Flink 中使用的是 DataStream，即数据流的形式，其实可以参考 SQL 中的数据流的思想，所以这里的 KeyBy 操作，可以理解为 SQL 中的分组操作。即`group by`字段。

```java
DataStreamSource<User> userDataStreamSource = env.fromElements(
        new User(1, "猫颜", 22, 1),
        new User(1, "赵云", 23, 1),
        new User(2, "张飞", 24, 2),
        new User(2, "关羽", 25, 3)
)
// KeyBy分组
 KeyedStream<User, Integer> userIntegerKeyedStream = userDataStreamSource.keyBy(new KeySelector<User, Integer>() {
     @Override
    public Integer getKey(User user) throws Exception {
        return user.getGroupId();
    }
 });
```

keyBy 的语法即，使用一个`KeySelector`重写其中的 getKey 方法，来设定每个字段的 Key 是怎么来的，然后根据这个 Key 来进行分组。

### 简单聚合（sum/max/min/minBy/maxBy）

:::warning
简单聚合算子只有在 keyBy 之后才能使用，否则会报错。
:::

```java
// 创建DataStream。这里只是一个例子，实际上数据可能来自文件、数据库或消息队列等。
DataStreamSource<User> userDataStreamSource = env.fromElements(
        new User(1, "猫颜", 22, 1),
        new User(1, "赵云", 23, 1),
        new User(2, "张飞", 24, 2),
        new User(2, "关羽", 25, 3)
);

// KeyBy分组
KeyedStream<User, Integer> userIntegerKeyedStream = userDataStreamSource.keyBy(new KeySelector<User, Integer>() {
    @Override
    public Integer getKey(User user) throws Exception {
        return user.getGroupId();
    }
});
// 聚合
SingleOutputStreamOperator<User> age = userIntegerKeyedStream.sum("age");
```

输出如下：

![alt text](./imgs/sum-result.png)

### Reduce 规约聚合

用于将数据流中的元素组合成单一的结果。该操作通常在 KeyedStream 上执行，意味着数据会首先根据某个键进行分组。reduce 操作会对每个键对应的分组内的元素进行规约，通常用于计算总和、最大值、最小值等聚合操作。reduce 函数通过两个同类型的输入元素返回一个同类型的单个结果元素，这个过程会不断重复，直到每个分组中的所有元素被规约为一个元素。

:::tip

1. 通常在 KeyedStream 上执行，即在 KeyBy 后。
2. 输入和输出都是同一个类型。
   :::

```java
// 创建DataStream。这里只是一个例子，实际上数据可能来自文件、数据库或消息队列等。
DataStreamSource<User> userDataStreamSource = env.fromElements(
        new User(1, "猫颜", 22, 1),
        new User(1, "赵云", 23, 1),
        new User(1, "刘备", 24, 1),
        new User(2, "张飞", 24, 2),
        new User(2, "关羽", 25, 3)
);

// KeyBy分组
KeyedStream<User, Integer> userIntegerKeyedStream = userDataStreamSource.keyBy(new KeySelector<User, Integer>() {
    @Override
    public Integer getKey(User user) throws Exception {
        return user.getGroupId();
    }
});
// Reduce聚合
SingleOutputStreamOperator<User> reduce = userIntegerKeyedStream.reduce(new ReduceFunction<User>() {
    @Override
    public User reduce(User user, User t1) throws Exception {
        return new User(user.getGroupId(), user.getName() + t1.getName(), user.getAge() + t1.getAge(), user.getGroupId());
    }
});
// 打印结果
reduce.print();
```

输出结果如下：
![alt text](./imgs/reduce-result.png)

其实实现的思想即传递进去两个参数，然将这两个参数进行合并，然后返回合并后的结果，并且将这个过程不断重复于每一个分组中的元素。

