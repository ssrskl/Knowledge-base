---
title: 数组滑动窗口
sidebar_position: 2
tags: [算法，数据结构，数组]
---

## 滑动窗口

滑动窗口主要用于解决数组/字符串的子数组/子字符串问题。它通过移动一个窗口来遍历数组/字符串，从而在时间复杂度为 O(n) 的情况下解决问题。

滑动窗口主要分为两种：

1. 固定窗口大小
2. 可变窗口大小

## 滑动窗口基本思路

1. 初始化窗口的左右边界，通常为数组的起始位置。
2. 移动右边界，扩大窗口，并更新窗口内的数据。
3. 检查窗口内的数据是否满足条件。
4. 如果满足条件，移动左边界，缩小窗口，并更新窗口内的数据。
5. 重复步骤 2-4，直到遍历完数组/字符串。

## 固定窗口大小

代码模板

```java
int left = 0;
int right = 0;

while (right < nums.length) {
    // 扩大窗口
    window.add(nums[right]);
    // 缩小窗口
    while (window.size() > k) {
        window.remove(nums[left]);
        left++;
    }
    right++;
}
```

## 可变窗口大小

代码模板

```java
int left = 0;
int right = 0;

while (right < nums.length) {
    // 扩大窗口
    window.add(nums[right]);
    // 缩小窗口
    while (窗口需要缩小) {
        window.remove(nums[left]);
        left++;
    }
    right++;
}
```

## 例题
