---
id: aop-package
title: Aop包装请求和返回数据
sidebar_position: 2
tags:
  - Java
  - Aop
---

# Aop 包装请求和返回数据

## 导入依赖

```xml
<!--切面-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
    <version>3.1.0</version>
</dependency>
```

## 创建切面类

```java
package com.maoyan.ffcommunity.aspects;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

/**
 * 控制层记录处理
 *
 * @Author: 猫颜
 * @Date: 2023/6/11
 */
@Aspect
@Component
public class ControllerAspect {
    /**
     * 定义切入点，切入点为com.maoyan.ffcommunity.controller下的所有函数
     */
    @Pointcut("execution(public * com.maoyan.ffcommunity.controller.*.*(..))")
    public void log() {
    }

    /**
     * 记录请求日志
     * @param joinPoint
     */
    @Before("log()")
    public void beforeLog(JoinPoint joinPoint) {
        // 拿到Request
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 拿到请求的URL
        String url = request.getRequestURL().toString();
        // 拿到请求的方法
        String method = request.getMethod();
        // 拿到请求的IP地址
        String ip = request.getRemoteAddr();
        // 拿到请求的类名
        String className = joinPoint.getSignature().getDeclaringTypeName();
        // 拿到请求的方法名
        String methodName = joinPoint.getSignature().getName();
        // 拿到请求的参数
        Object[] args = joinPoint.getArgs();
        // 彩色打印日志
        System.out.println("\033[1;92m"+"URL: \033[0m"+url);
        System.out.println("\033[1;92m"+"METHOD: \033[0m"+method);
        System.out.println("\033[1;92m"+"IP: \033[0m"+ip);
        System.out.println("\033[1;92m"+"CLASS_METHOD: \033[0m"+className + "." + methodName);
        System.out.println("\033[1;92m"+"ARGS: \033[0m"+ Arrays.toString(args));
    }

    /**
     *
     * @param result
     */
    @AfterReturning(returning = "result", pointcut = "log()")
    public void afterLog(Object result) {
        System.out.println("\033[1;92m"+"RESPONSE: \033[0m"+result);
    }
}
```
