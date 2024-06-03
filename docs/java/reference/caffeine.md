---
title: Caffeine 缓存
sidebar_position: 5
tags:
  - Java
---

[Spring Boot and Caffeine Cache](https://www.baeldung.com/spring-boot-caffeine-cache)

## 概述

## 导入依赖

我们首先添加 spring-boot-starter-cache 和 caffeine 依赖项，它们导入了基本的 Spring 缓存支持以及 Caffeine 库。

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    <dependency>
        <groupId>com.github.ben-manes.caffeine</groupId>
        <artifactId>caffeine</artifactId>
    </dependency>
</dependencies>
```

## 配置 Caffenie

首先我们创建一个配置类，用于控制缓存的主要配置，例如过期时间，缓存大小等。

```java
@Bean
public Caffeine caffeineConfig() {
    return Caffeine.newBuilder().expireAfterWrite(60, TimeUnit.MINUTES);
}
```
