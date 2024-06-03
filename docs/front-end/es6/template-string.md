---
title: 模板字符串
description: 模板字符串
sidebar_position: 6
tags: [es6]
---

# 模板字符串

模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

## 普通字符串

```js
// 普通字符串
const name = '张三'
const age = 18
const message = `你好，我的名字是${name}，我${age}岁了。`
console.log(message)
// 你好，我的名字是张三，我18岁了。
```
    
## 多行字符串

```js
// 多行字符串
const message = `你好，
我的名字是${name}
我${age}岁了。`
console.log(message)
```

## 字符串中嵌入变量

```js
// 字符串中嵌入变量
const name = '张三'
const age = 18
const message = `你好，我的名字是${name}，我${age}岁了。`
console.log(message)
```


## 模板字符串的标签

模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串。这被称为“标签模板”功能。

```js
// 标签模板的用法
function tag(strings, ...values) {
  console.log(strings)
  console.log(values)
}

const name = '张三'
const age = 18
// highlight-next-line
tag`你好，我的名字是${name}，我${age}岁了。`
```
    
## 模板字符串的转义

模板字符串会将所有的空格、换行符、制表符等转义字符自动转义。

```js
// 模板字符串的转义
const message = `你好，
我的名字是${name}
我${age}岁了。`
console.log(message)
```
        
## 模板字符串的原始字符串

模板字符串的原始字符串可以通过在模板字符串的第一个字符串前加上`raw`关键字来获取。

```js
// 模板字符串的原始字符串
// highlight-next-line
const message = String.raw`你好，
我的名字是${name}
我${age}岁了。`
console.log(message)
```

## 模板字符串的嵌套

模板字符串的嵌套可以通过在模板字符串中使用嵌套的模板字符串来实现。

```js
// 模板字符串的嵌套
const name = '张三'
const age = 18
const message = `你好，我的名字是${`${name}`}，我${`${age}`}岁了。`
console.log(message)
```
