---
title: 参数默认值
sidebar_position: 4
tags: [es6]
---

# 参数默认值

在 ES6 之前，我们为函数的参数指定默认值，只能采用以下写法。

```js
function log(x, y) {
  // highlight-next-line
  y = y || "World";
  console.log(x, y);
}

log("Hello"); // Hello World
log("Hello", "China"); // Hello China
log("Hello", ""); // Hello
```

采用 ES6 的写法，就可以简化很多。

```js
// highlight-next-line
function log(x, y = "World") {
  console.log(x, y);
}

log("Hello"); // Hello World
log("Hello", "China"); // Hello China
log("Hello", ""); // Hello
```

上面代码只使用了默认值，没有其他参数。这时，其他参数的默认值就可以采用函数体内变量来设置。

```js
let x = "Hello";

function log(x, y = x) {
  console.log(x, y);
}

log("Hello"); // Hello Hello
```

上面代码中，参数`y`的默认值等于变量`x`。

另一种情况是，参数默认值是一个函数。

```js
function getValue() {
  return 1;
}

function foo(x = getValue()) {
  console.log(x);
}

foo(); // 1
```

上面代码中，参数`x`的默认值是一个函数，该函数将参数`x`的默认值设置为`1`。

注意，下面的写法会得到不一样的结果。

```js
let x = 99;

function foo(x = x) {
  console.log(x);
}

foo(); // 99
```

上面代码中，参数`x`的默认值等于另一个参数`x`，结果就变成了参数`x`等于全局变量`x`。

### 参数默认值的位置

通常情况下，定义了默认值的参数，应该是函数的<span style={{ backgroundColor: 'yellow' }}>**尾参数**</span>。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。

```js
function foo(x = 5, y) {
  return [x, y];
}

foo(); // [5, undefined]
foo(undefined, 1); // [5, 1]
```

上面代码中，参数`x`设置默认值以后，就变成了必须参数。这时就不能省略这个参数了。

### 函数的 length 属性

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。

```js
(function (a) {})
  .length(
    // 1
    function (a = 5) {}
  )
  .length(
    // 0
    function (a, b, c = 5) {}
  ).length; // 2
```

上面代码中，`length`属性的返回值，等于函数的参数个数减去指定了默认值的参数个数。上面代码中，`length`属性等于`1`减去`1`，结果为`0`。

这是因为`length`属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，后文的`rest`参数也不会计入`length`属性。

### 作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

```js
var x = 1;

function foo(x, y = x) {
  console.log(y);
}

foo(2); // 2
```

上面代码中，参数`y`的默认值等于变量`x`。调用函数`foo`时，参数形成一个单独的作用域。在这个作用域里面，默认值变量`x`指向第一个参数`x`，而不是全局变量`x`，所以输出是`2`。
