---
title: 动态导航菜单
sidebar_position: 1
tags: [案例分析，vue]
---

# 动态导航菜单

实现效果如图：
![alt text](./imgs/dynamic-nav-menu.png)

## 功能实现分析

### 保存标签页的信息

```tsx {2} showLineNumbers
<a-tab-pane
    v-for="item of tabsStore.tagList"
    :key="item.path"
    :title="(item.meta?.title as string)"
    :closable="Boolean(!item.meta?.affix)"
>
```

可以看到，`v-for` 循环的 `item` 就是 `tabsStore.tagList` 中的每个对象。
在这里 store 是通过 pinia 框架实现的，使用一个数组来存储标签页信息。

```tsx
const tagList = ref<RouteRecordRaw[]>([]); // 保存页签tab的数组
```

然后就到了如何去修改这个数组的时候了，首先从添加考虑，当路由发生变化的时候，就会触发添加标签页的操作。

### 添加标签页

在 Tabs 组件中，监听路由的变化，然后调用`handleRouteChange()`方法。

```tsx
// 监听路由变化
watch(
  () => route.path,
  () => {
    handleRouteChange();
  }
);

// 路由发生改变触发
const handleRouteChange = () => {
  const item = { ...route } as unknown as RouteRecordRaw;
  tabsStore.addTagItem(item);
  tabsStore.addCacheItem(item);
  // console.log('路由对象', toRaw(item))
  // console.log('tagList', toRaw(tabsStore.tagList))
  // console.log('cacheList', toRaw(tabsStore.cacheList))
};
handleRouteChange();
```

然后让我们看一下添加标签页的操作，也就是`addTagItem()`方法。

```tsx
// 添加一个页签, 如果当前路由已经打开, 则不再重复添加
const addTagItem = (route: RouteRecordRaw) => {
  const item = JSON.parse(JSON.stringify(route));
  if (tagList.value.some((i) => i.path === item.path)) return;
  if (item.meta?.showInTabs ?? true) {
    tagList.value.push(item);
  }
};
```

### 标签页的跳转

再然后，我们需要通过点击标签页来实现路由的跳转。在 Tabs 组件中设置标签页的点击事件。

```tsx
// 点击页签
const handleTabClick = (key: string) => {
  router.push({ path: key });
};
```

在 Tabs 中也设置了点击事件

```tsx {7} showLineNumbers
<a-tabs
      editable
      hide-content
      size="medium"
      :type="appStore.tabMode"
      :active-key="route.path"
      @tab-click="(key) => handleTabClick(key as string)"
      @delete="tabsStore.closeCurrent"
    >
      <a-tab-pane
        v-for="item of tabsStore.tagList"
        :key="item.path"
        :title="(item.meta?.title as string)"
        :closable="Boolean(!item.meta?.affix)"
      >
      </a-tab-pane>
...省略
```

当点击标签页的时候，会触发`handleTabClick()`方法，然后通过`router.push()`方法来实现路由的跳转。

### 删除标签页

最后，我们看一下如何删除标签页，`deleteTagItem`方法

```tsx
// 删除一个页签
const deleteTagItem = (path: string) => {
  // index：要删除的页签的索引
  const index = tagList.value.findIndex(
    (item) => item.path === path && !item.meta?.affix
  );
  // 如果要删除的页签是当前页签，则跳转到最后一个页签
  if (index >= 0) {
    // 要删除的页签是否是当前页签
    const isActive =
      router.currentRoute.value.path === tagList.value[index]["path"];
    // 删除页签
    tagList.value.splice(index, 1);
    // 如果要删除的页签是当前页签，则跳转到最后一个页签
    if (isActive) {
      router.push({ path: tagList.value[tagList.value.length - 1]["path"] });
    }
  }
};
```

删除标签页的逻辑比较简单，首先通过`findIndex()`方法找到要删除的标签页的索引，然后通过`splice()`方法删除标签页，最后通过`router.push()`方法跳转到上一个标签页。

### 当前激活的标签

使用的组件库中，已经实现了当前激活的标签，所以只需要在 Tabs 组件中设置`active-key`属性即可。

```tsx {6} showLineNumbers
<a-tabs
      editable
      hide-content
      size="medium"
      :type="appStore.tabMode"
      :active-key="route.path"
      @tab-click="(key) => handleTabClick(key as string)"
      @delete="tabsStore.closeCurrent"
>
```

### 显示关闭按钮

标签页是否为固定的，可以通过`item.meta?.affix`来判断。

```tsx {5} showLineNumbers
<a-tab-pane
    v-for="item of tabsStore.tagList"
    :key="item.path"
    :title="(item.meta?.title as string)"
    :closable="Boolean(!item.meta?.affix)"
>
```

在标签中设置`:closable="Boolean(!item.meta?.affix)"`属性，当`item.meta?.affix`为`true`时，不显示删除按钮。

- item.meta?.affix 表示当前标签是否是固定的

### 悬浮出现关闭按钮

当鼠标悬浮在标签页上时，显示关闭按钮。

```css
:deep(.arco-tabs-nav-tab) {
  .arco-tabs-tab {
    border-bottom-color: transparent !important;
    svg {
      width: 0;
      transition: all 0.15s;
    }
    &:hover {
      svg {
        width: 1em;
      }
    }
  }
  &:not(.arco-tabs-nav-tab-scroll) {
    .arco-tabs-tab:first-child {
      border-left: 0;
    }
  }
}
```

通过`:deep()`选择器，选择标签页的`arco-tabs-nav-tab`组件，然后设置`border-bottom-color`属性为透明，设置`svg`的`width`属性为`0`，设置`transition`属性为`all 0.15s`，设置`&:hover`选择器，设置`svg`的`width`属性为`1em`。

## 手动实现

这里我使用 React 来手动实现一个类似的动态标签页面

- 路由：react-router-dom
- UI 库：antd
- 状态管理：zustand

这里可以使用我们的一个 React 开发模板-->[React 开发模板](../../tools/react-template#模板一)

我们首先来梳理一下思路，即需要解决哪些问题？

1. 如何存储标签页列表，使用什么样的数据结构，什么样的类型？
2. 我们需要将标签页列表展示在 Ant Design 的 Tabs 组件中，Tabs 组件对于展示的格式是否有一定的要求？以及怎么解决？
3. 我们还需要实现，当路由切换的时候，高亮对应的标签页
4. 怎么将 Tabs 与路由向关联起来(重点)

首先，我们来确定一下，应该怎么存储，以及使用什么样的类型来存储标签页列表。根据上面的内容-->[保存标签页的信息](./dynamic-navigation-menu/#保存标签页的信息)可以看到，作者是使用了`RouteRecordRaw`来作为标签页的类型，而这个类型是`vue-router`框架自带的。所以我们也可以使用`react-router-dom`框架自带的类型。这里我选择`Location`类型来存储。我们可以来看一下 Location 类型的定义

```ts
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   */
  pathname: string;
  /**
   * A URL search string, beginning with a ?.
   */
  search: string;
  /**
   * A URL fragment identifier, beginning with a #.
   */
  hash: string;
}
/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 */
export interface Location<State = any> extends Path {
  /**
   * A value of arbitrary data associated with this location.
   */
  state: State;
  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   */
  key: string;
}
```

可以看到，Location 类型包含`pathname`、`search`、`hash`、`state`、`key`等属性。其中`pathname`、`search`、`hash`和`key`都是字符串类型。`state`属性是`any`类型，可以存储任意类型的数据。

所以我们的 tagList 为：

```ts
interface TabsStore {
  tagList: Location[];
  addTagItem: (tag: Location) => void;
}
```

接下来，我们添加上相对应逻辑的添加标签页的方法`addtagItem`

```ts
addTagItem: (tag) => {
    set((state) => {
      // 判断是否已经存在，就不添加了
      if (state.tagList.some((item) => item.pathname === tag.pathname)) {
        return state;
      }
      return { tagList: [...state.tagList, tag] };
    });
  },
```

总代码为：

```ts
import { Location } from "react-router-dom";
import create from "zustand";

interface TabsStore {
  tagList: Location[];
  addTagItem: (tag: Location) => void;
}

const useTabsStore = create<TabsStore>((set) => ({
  tagList: [],

  addTagItem: (tag) => {
    set((state) => {
      // 判断是否已经存在，就不添加了
      if (state.tagList.some((item) => item.pathname === tag.pathname)) {
        return state;
      }
      return { tagList: [...state.tagList, tag] };
    });
  },
}));

export default useTabsStore;
```

然后就来到了我们的重头戏，即如何将我们的标签页渲染出来，如何将路由与 Tab 组件结合起来。

我们首先解决数据显示的问题，tagList 是 Location 类型，Tabs 的显示需要 items，或者我们可以使用`TabPane`来进行显示，但是 Tab 显示需要 label 字段，以及 key，在 Location 中并没有 label 字段，并且 key 字段是不断的变化的，所以我们可以创建一个自己的路由表，其中包含 label 字段和固定的 key 字段，让自己的路由表通过 path 字段和 Location 的 pathname 字段相连接。

```tsx
const items = [
  {
    key: "1",
    label: "Tab 1",
    path: "/test/test1",
  },
  {
    key: "2",
    label: "Tab 2",
    path: "/test/test2",
  },
  {
    key: "3",
    label: "Tab 3",
    path: "/test/test3",
  },
];
```

```ts {4} showLineNumbers
<Tabs defaultActiveKey="2" onChange={onChange} activeKey={activeKey}>
  {tagList.map((item) => (
    <TabPane
      tab={items.find((i) => i.path === item.pathname)?.label}
      key={item.key}
    ></TabPane>
  ))}
</Tabs>
```

😄Good!!! 这样我们就实现了标签页的显示，并且将路由与标签页关联起来了。

接下来，我们需要解决路由表的添加问题，这里可以分解为几个问题：

1. 在路由变化之后，向 tagList 中添加路由，由于添加路由的方法已经有防止重复添加了，所以直接添加即可。
2. 在路由变化之后，我们需要高亮路由对应的标签页。

这些都需要依赖与路由变化，所以我们可以使用`useEffect`来监听路由的变化。

```tsx
const [activeKey, setActiveKey] = useState("1");
const currentLocation = useLocation();

useEffect(() => {
  // 从路由表中获得当前的路由信息
  addTagItem(currentLocation);
  // 高亮当前路由
  setActiveKey(currentLocation.key);
  console.log("currentLocation", currentLocation.key);
  // 监听路由是否变化
}, [currentLocation]);
```

全部代码

```tsx
import useTabsStore from "@/store/tabsStore";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

const items = [
  {
    key: "1",
    label: "Tab 1",
    path: "/test/test1",
  },
  {
    key: "2",
    label: "Tab 2",
    path: "/test/test2",
  },
  {
    key: "3",
    label: "Tab 3",
    path: "/test/test3",
  },
];
export const TestPage = () => {
  // TabsStore
  const tagList = useTabsStore((state) => state.tagList);
  const addTagItem = useTabsStore((state) => state.addTagItem);

  const [activeKey, setActiveKey] = useState("1");
  const navigate = useNavigate();
  const currentLocation = useLocation();

  const onChange = (key: string) => {
    setActiveKey(key);
    const pathparam = items.find(
      (item) => item.path === currentLocation.pathname
    )?.path;
    navigate(pathparam || "/test/test1");
  };

  useEffect(() => {
    // 从路由表中获得当前的路由信息
    addTagItem(currentLocation);
    // 高亮当前路由
    setActiveKey(currentLocation.key);
    console.log("currentLocation", currentLocation.key);
    // 监听路由是否变化
  }, [currentLocation]);

  return (
    <>
      <ul>
        <li
          onClick={() => {
            navigate("/test/test1");
          }}
        >
          TestPage1
        </li>
        <li
          onClick={() => {
            navigate("/test/test2");
          }}
        >
          TestPage2
        </li>
        <li
          onClick={() => {
            navigate("/test/test3");
          }}
        >
          TestPage3
        </li>
      </ul>

      <Tabs defaultActiveKey="2" onChange={onChange} activeKey={activeKey}>
        {tagList.map((item) => (
          <TabPane
            tab={items.find((i) => i.path === item.pathname)?.label}
            key={item.key}
          ></TabPane>
        ))}
      </Tabs>
      <Outlet />
    </>
  );
};
```

暂时还没有添加删除以及清空等方法，不过逻辑上都是类似的。
