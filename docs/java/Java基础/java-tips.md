---
title: Java 小技巧
tags: [Java, 技巧]
---

## Map

### 合并两个 HashMap --> merge 方法

例如如下的数据：

```java
hashMap1.put("a", 1L);
hashMap1.put("b", 2L);
hashMap1.put("c", 3L);
hashMap2.put("a", 4L);
hashMap2.put("b", 5L);
hashMap2.put("d", 6L);
```

将两个 Map 合并，即遍历 hashMap2，如果 hashMap1 中存在相同的 key，则将 hashMap2 中的 value 值加到 hashMap1 中，如果不存在，则直接添加到 hashMap1 中。

我们可以有如下的写法：

```java
hashMap2.forEach((key, value) -> {
    if (hashMap1.containsKey(key)) {
        hashMap1.put(key, hashMap1.get(key) + value);
    } else {
        hashMap1.put(key, value);
    }
});
```

当然我们也可以使用`merge`方法来实现：

```java
HashMap<String, Long> hashMap1 = new HashMap<>();
HashMap<String, Long> hashMap2 = new HashMap<>();
hashMap1.put("a", 1L);
hashMap1.put("b", 2L);
hashMap1.put("c", 3L);
hashMap2.put("a", 4L);
hashMap2.put("b", 5L);
hashMap2.put("d", 6L);
hashMap2.forEach((k, v) -> {
    hashMap1.merge(k, v, Long::sum);
});
System.out.println(hashMap1);
```
