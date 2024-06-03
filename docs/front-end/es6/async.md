---
title: Async
date: 2024-05-29
sidebar: 8
tags:
  - 前端
  - Async
  - ES6
---
# Async函数
简单来说就是给一个普通函数加上一个async关键字，就可以将这个函数变成一个异步函数。例如：
```ts
async function myFunction(){
    // 这是一个异步函数    
}
```
我们还是来举一个例子，当我们执行一个耗时的方法：
```ts
function func1(){
    // 这是一个耗时的方法
    return <返回的内容>;
}
```
我们想要将其变为异步执行，即不会造成阻塞，我们使用上回讲的Promise对象来实现，即返回一个Promise对象，例如：
```ts
function func1(){
    return new Promise((resolve,reject)=>{
        // 这是一个耗时的方法
        resolve(<返回的内容>);
    });
}
```
但是这样写起来太麻烦了，我们使用async函数来实现，即加上async关键字，例如：
```ts
async function func1(){
    // 这是一个耗时的方法
    return <返回的内容>;
}
```
但是我们知道返回的Promise对象有then和catch两个方法，那么怎么在async函数中使用这两个方法呢？我们可以通过正常返回来返回then的内容，通过抛出异常来返回catch的内容，例如：
```ts
async function func1(){
    let x = 101;
    if(x%2 === 0){
        return x;
    }else{
        throw new Error("x不是偶数");
    }
}

func1()
    .then(res=>{
        console.log(res);
    })
    .catch(err=>{
        console.log(err);
    });
```
这样我们就实现了在async函数中使用then和catch方法。
