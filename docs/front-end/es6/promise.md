---
title: Promise
date: 2024-05-29
sidebar: 7
categories:
  - 前端
  - ES6
tags:
  - ES6
  - Promise
publish: true
---

# Promise

承诺，通俗的来理解就是：**比如我承诺给你一个东西，但是什么时候会给则不一定，所以在还没有给你东西的时候，你可以先去做其他的事情，而不应该阻塞当前的业务。**

## 常规使用

我们看一个例子:

```ts
let url = "http://www.baidu.com";
let promise = fetch(url);
promise.then((res) => {
  console.log(res);
});
promise.catch((err) => {
  console.log(err);
});
console.log("我先去做其他的事情");
```

- fetch：是浏览器内置的函数，用于发送网络请求，返回一个 Promise 对象。
- then：翻译过来就是**然后**，即当请求完成之后要做的事情。
- catch：就是当请求失败之后要做的事情。

## 自定义 Promise

当我们想自定义一个 Promise 的时候，我们可以使用`new`关键字来创建一个 Promise 对象。通常用于处理耗时的一些方法。

Promise 构造函数接收一个函数作为参数，该函数有两个参数：resolve 和 reject。

- resolve：当请求成功时，调用 resolve 函数。
- reject：当请求失败时，调用 reject 函数。

例如，我们想要封装一个 ajax 请求，封装为 get 方法，传参为 url 地址：

```ts
function get(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}
// 然后调用get方法

get("http://www.baidu.com")
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Promise.all

Promise.all() 方法接收一个 Promise 对象的数组作为参数，返回一个新的 Promise 对象。当所有的 Promise 对象都成功时，新的 Promise 对象的状态变为成功，并且返回一个包含所有 Promise 对象结果的数组。如果任何一个 Promise 对象失败，新的 Promise 对象的状态变为失败，并且返回第一个失败的 Promise 对象的结果。

```ts
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise1");
  }, 1000);
});

let promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise2");
  }, 2000);
});

Promise.all([promise1, promise2]).then((res) => {
  console.log(res); // ["promise1", "promise2"]
});
```
