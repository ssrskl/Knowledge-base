---
title: Await
date: 2024-05-29
sidebar: 9
tags:
  - 前端
  - Await
  - ES6
---

# Await

await 是用于等待异步操作的结果。在 async 函数中使用 await 可以暂停执行，等待异步操作完成后再继续执行。例如在我们通过一个请求获得到用户的 ID，然后再通过这个 ID 获得用户的详细信息，就可以使用 await 来等待第一个请求的结果，然后再进行第二个请求。

await 是使用在返回 Promise 对象的函数前。await 会暂停执行，等待 Promise 对象 resolve，然后返回 resolve 的值。

我们来举一个例子：

```ts
async function getUserClassInfo() {
  const userInfo = await fetch("http://api.com/user/1");
  // 拿到用户信息之后，再得到其班级ID，再通过ID请求班级信息
  const classInfo = await fetch("http://api.com/class/" + userInfo.classId);
  return classInfo;
}

getUserClassInfo()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
```
因为`fetch`方法返回的是一个 Promise 对象，所以我们可以使用`await`来等待这个 Promise 对象 resolve，然后返回 resolve 的值。这样我们就可以在`getUserClassInfo`函数中使用`await`来等待第一个请求的结果，然后再进行第二个请求。

