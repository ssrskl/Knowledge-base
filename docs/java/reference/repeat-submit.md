---
title: 重复提交
sidebar_position: 4
tags:
  - Java
---

[重复提交](https://smartadmin.vip/views/v3/back/RepeatSubmit.html#_4-1、切面)

## 背景与问题

很多时候，我们需要限制用户针对某个接口的请求次数，例如最常见的对于短信验证码，60 秒才能请求一次，对于登陆方法，10 秒钟才能请求一次。

## 架构设计

那么，根据上述的问题，我们需要记录请求的信息，请求的信息包含了

1. 是谁请求的
2. 请求的是哪个接口
3. 什么时候请求的

## 具体实现

我们先分析一下实现的原理，首先我们先大致梳理一下实现的逻辑，即 AOP 层的处理逻辑。

1. 获取请求的路径作为`ticketToken`
2. 然后通过这个`ticketToken`来获得`ticket`和时间戳
3. 然后检查注解来判断时间间隔，防止重复提交。
4. 执行原方法前后处理`ticket`

我们先看一下 AOP 层的代码实现：

```java showLineNumbers
// 这行代码表明该方法是一个环绕通知（Around Advice），会在所有标注了@RepeatSubmit注解的方法执行前后执行。
@Around("@annotation(net.lab1024.sa.base.module.support.repeatsubmit.annoation.RepeatSubmit)")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        // 获得请求的信息，并且将请求路径作为ticketToken
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        String ticketToken = attributes.getRequest().getServletPath();
        // 通过repeatSubmitTicket的getTicket方法获得ticket
        String ticket = this.repeatSubmitTicket.getTicket(ticketToken);
        if (StringUtils.isEmpty(ticket)) {
            return point.proceed();
        }
        // 通过getTicketTimestamp方法通过ticket来获得时间戳
        Long timeStamp = this.repeatSubmitTicket.getTicketTimestamp(ticket);
        // 如果时间戳不为空，则获得方法与注解
        if (timeStamp != null) {
            Method method = ((MethodSignature) point.getSignature()).getMethod();
            RepeatSubmit annotation = method.getAnnotation(RepeatSubmit.class);

            // 如果注解
            if (annotation != null) {
                return point.proceed();
            }
            // 计算时间间隔
            int interval = Math.min(annotation.value(), RepeatSubmit.MAX_INTERVAL);
            if (System.currentTimeMillis() < timeStamp + interval) {
                // 提交频繁
                return ResponseDTO.error(UserErrorCode.REPEAT_SUBMIT);
            }

        }
        Object obj = null;
        try {
            // 先给 ticket 设置在执行中
            this.repeatSubmitTicket.putTicket(ticket);
            obj = point.proceed();
        } catch (Throwable throwable) {
            log.error("", throwable);
            throw throwable;
        } finally {
            this.repeatSubmitTicket.removeTicket(ticket);
        }
        return obj;
    }
```

那我们再来看一看`repeatSubmitTicket`的实现

## 手动实现

那么我们可以使用自己的方式来实现，我们再梳理一下主要内容：

1. 拦截请求信息
2. 看在缓存中是否包含本用户发起的这个请求
3. 如果有的话则拦截，否则放行

那么，我们可以先定义一个自己的缓存

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RepeatSubmit {
    long interval() default 5000; // 间隔时间，单位毫秒，默认5秒
}
```

配置 Caffenie

```java
@Configuration
public class CaffeineConfig {

    @Bean
    public Cache<String, Boolean> cache() {
        return Caffeine.newBuilder()
                       .expireAfterWrite(5, TimeUnit.SECONDS) // 设置过期时间
                       .build();
    }
}
```

使用 AOP 拦截请求并处理

```java
@Aspect
@Component
public class RepeatSubmitAspect {

    @Autowired
    private Cache<String, Boolean> cache;

    @Pointcut("@annotation(repeatSubmit)")
    public void pointcut(RepeatSubmit repeatSubmit) {}

    @Around("pointcut(repeatSubmit)")
    public Object around(ProceedingJoinPoint pjp, RepeatSubmit repeatSubmit) throws Throwable {
        long interval = repeatSubmit.interval();
        String key = getKey(pjp);

        // 使用Caffeine进行防重复提交判断
        if (cache.getIfPresent(key) != null) {
            throw new RuntimeException("请勿重复提交");
        }

        // 设置缓存键值，防止重复提交
        cache.put(key, Boolean.TRUE);

        // 执行目标方法
        return pjp.proceed();
    }
    private String getKey(ProceedingJoinPoint pjp) {
        // 生成唯一键的方法，可以根据实际需求调整
        return pjp.getSignature().toString();
    }
}
```
使用注解
```java
@RestController
public class MyController {

    @RepeatSubmit(interval = 3000)
    @PostMapping("/submit")
    public ResponseEntity<String> submit(@RequestBody MyRequest request) {
        // 处理提交逻辑
        return ResponseEntity.ok("提交成功");
    }
}
```