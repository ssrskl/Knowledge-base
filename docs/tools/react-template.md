---
title: React开发模板
description: 介绍如何使用React开发模板
date: 2024-05-17
sidebar_position: 4
tags: [React, 开发模板]
---

# React 开发模板

## 模板一

### 架构设计

- Vite
- TypeScript
- axios：网络请求
- react-router-dom：路由
- dayjs：时间处理
- lodash：工具库
- swr：数据请求
- antd：UI 组件
- ahooks：React Hooks 库
- scss: CSS 预处理器

### 搭建流程

#### 创建项目

```bash
pnpm create vite@latest
```

安装依赖

#### 安装 react-router-dom

```bash
pnpm install react-router-dom localforage match-sorter sort-by
```

在`index.tsx`根文件下引入路由组件

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
```

配置路由信息

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/my",
    element: <MyComponent />,
  },
]);
```

最后将`index.tsx`中原先的界面替换为路由界面

```tsx
<RouterProvider router={router} />
```

#### 安装 Axios

```bash
pnpm install axios
```

**封装 Axios 请求**，在 lib 文件夹下，创建 request.ts 文件：

```ts
// axios封装函数
import axios from "axios";
interface ICodeMessage {
  [key: number]: string;
}
const StatusCodeMessage: ICodeMessage = {
  200: "服务器成功返回请求的数据",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）",
  204: "删除数据成功",
  400: "请求错误(400)",
  401: "未授权，请重新登录(401)",
  403: "拒绝访问(403)",
  404: "请求出错(404)",
  408: "请求超时(408)",
  500: "服务器错误(500)",
  501: "服务未实现(501)",
  502: "网络错误(502)",
  503: "服务不可用(503)",
  504: "网络超时(504)",
};
// 1. 根域名配置
// 2. 超时时间
const request = axios.create({
  //   baseURL: "http://localhost:8080",
  baseURL: "http://110.41.50.108:8080",
  timeout: 10000,
});
// 3. 请求拦截
request.interceptors.request.use(
  (config) => {
    config.headers.set(
      "" + localStorage.getItem("token_name"),
      localStorage.getItem("token_value")
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// 4. 响应拦截
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 服务器返回错误
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(StatusCodeMessage[error.response.status]);
    } else {
      // 请求超时或者网络有问题
      if (error.message.includes("timeout")) {
        console.log("超时了");
      } else {
        console.log("网络错误");
      }
    }
    return Promise.reject(error);
  }
);
export default request;
```

#### 安装 SWR

```bash
pnpm install swr
```

#### 安装 Ant Design

```bash
pnpm install antd --save
```

#### Ahooks

```bash
pnpm i ahooks
```

#### 安装 Dayjs

```bash
pnpm install dayjs
```

#### 安装 lodash

```bash
pnpm install lodash
```

#### 安装 Scss

[React 中 sass 的使用步骤](https://juejin.cn/post/7224688455989166135)

```bash
pnpm install sass --save
```

#### 配置 Vite 与 Ts

修改`vite.config.js`文件来配置 Vite。

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

配置 Ts 使用@，在`tsconfig.json`文件中配置

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
