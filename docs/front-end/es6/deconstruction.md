---
title: 解构
sidebar_position: 2
tags: [es6]
---
# 解构
## 数组解构
```js
let [a, b, c] = [1, 2, 3];
```
## 对象解构
```js
let person = {
    name: '张三',
    age: 30,
    gender: 'male'
};
let { name, age } = person;
```

## 字符串解构
```js
const [a, b, c, d, e] = "hello";
```
## 函数参数解构
```js
    function add([x, y]){
        return x + y;
    }
    add([1, 2]); // 3
```
## 用途
### 交换变量
```js
let x = 1;
let y = 2;
[x, y] = [y, x];
```
### 提取JSON数据
```js
let jsonData = {
    id: 42,
    status: "OK",
    data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```
### 函数参数定义
```js
    [[1, 2], [3, 4]].map(([a, b]) => a + b);
    // [3, 7]
```
### 提取函数返回值
```js
    function example() {
        return {
            foo: 1,
            bar: 2
        };
    }
    let { foo, bar } = example();
```
### 提取Set数据
```js
    let mySet = new Set(['value1', 'value2']);
    let [x, y] = mySet;
    // x='value1', y='value2'
```
        
### 提取Map数据
```js
    let myMap = new Map();
    myMap.set('first', 'hello');
    myMap.set('second', 'world');
    for (let [key, value] of myMap) {
        console.log(key + " is " + value);
    }
    // first is hello
    // second is world
```
