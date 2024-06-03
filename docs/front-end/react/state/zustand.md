# Zustand
## 参考
官网：[Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

教程：[Zustand状态管理库教程](https://www.bilibili.com/video/BV1Tr4y1Z7h7/?spm_id_from=333.337.search-card.all.click)
## Zustand介绍
## 安装
``` pnpm
pnpm install zustand
```

## 快速使用
创建一个Store
```tsx
interface BearState {
    bears: number
    increase: (by: number) => void
}

const useBearStoreBase = create<BearState>()((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({bears: state.bears + by})),
}))
```
绑定到组件进行消费
```tsx
const bears = useBearStoreBase((state) => (state.bears))
const increment = useBearStoreBase((state) => (state.increase))

<Button onClick={() => {
    increment(1)
}}>{bears}</Button>
```

## 自动生成选择器
例如使用Store的时候是这样的：

```ts
const bears = useBearStore((state) => state.bears)
```

我们可以创建以下的函数

```ts
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
```

然后使用createSelectors函数去自动使用Store

例如有以下的Store

```ts
interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

将自动生成函数应用到此Store中

```ts
const useBearStore = createSelectors(useBearStoreBase)
```

使用

```ts
// get the property
const bears = useBearStore.use.bears()

// get the action
const increment = useBearStore.use.increment()
```