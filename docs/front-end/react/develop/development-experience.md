# 项目开发经验
## 动态更改Tailwind的class

工具ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

使用例子

```tsx
<div
    className={cn(
        "ml-auto text-xs",
        mail.selected === item.id
            ? "text-foreground"
            : "text-muted-foreground"
    )}
>
    {item.date}
</div>
```

即判定`mail.selected === item.id`是否成立，如果成立的话则将`text-foreground`类与前面的合并在一起，就可以实现**动态的更改Tailwind的class的效果**。

## 封装Axios网络请求

一般不管是在Vue中还是在React中，使用最频繁的网络请求框架即Axios框架，而普通使用Axios只是简单的进行网络请求，我们可以将其进行封装，更系统更便捷的使用Axios。

主要封装的效果如下：

1. 配置baseURL
2. 设置超时时间
3. Request拦截器

    1. 为Request添加token
4. Response拦截器统一对请求失败进行处理

例子如下：

```ts
//axios 网络请求封装
import axios from 'axios'
import {getToken} from '@/utils/auth'
import {IResponse, IResponseCode} from '@/types/Response'
import {useNavigate} from "react-router-dom";


// 创建axios实例
const service = axios.create({
    // baseURL: import.meta.env.VITE_BASE_API as string, // api的base_url
    baseURL: "https://httpbin.org", // api的base_url
    timeout: 5000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
    (config) => {
        // if (store.getters.token) {
        //     config.headers['Authorization'] = getToken()
        // }
        return config
    },
    (error) => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)
// response 拦截器
service.interceptors.response.use(
    (response) => {
        const res: IResponse = response.data
        if (res.code !== IResponseCode.SUCCESS) {
            console.log(res)
            // 50008:非法的token; 50012:其他客户端登录了; 50014:Token 过期了;
            if (
                res.code === IResponseCode.TOKEN_INVALID ||
                res.code === IResponseCode.TOKEN_EXPIRED
            ) {
                // 请自行在引入 MessageBox
                // import { Message, MessageBox } from 'element-plus'
                // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                //   confirmButtonText: '重新登录',
                //   cancelButtonText: '取消',
                //   type: 'warning'
                // }).then(() => {
                //   store.dispatch('FedLogOut').then(() => {
                //     location.reload() // 为了重新实例化vue-router对象 避免bug
                //   })
                // })
                const navigate = useNavigate();
                navigate('/login');
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    (error) => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)
export default service
```

## 用户信息存储

针对一般的博客或者论坛什么的，一般都需要存储当前的用户信息，已判断是否登录或者显示用户的信息，不会在每一次的请求中都更改用户的信息，那么在用户的信息存储中，我们可以使用比较简单的`jotai`原子状态来存储全局数据。

就拿传统的User信息来举例子，在全局状态控制的文件`state-controller.ts`中：

```ts
import {atom, useAtom} from "jotai";
// 创建一个Type保存用户的个人数据
type BcUser = {
    userId: number;
    username: string;
    address: string;
    publicKey: string;
    privateKey: string;
}
// 定义一个用户原子
const userAtom = atom<BcUser>({
    userId: 0,
    username: '初始化用户',
    address: '初始化地址',
    publicKey: '初始化公钥',
    privateKey: '初始化私钥'
})
// 导出函数
export function useBcUser() {
    return useAtom(userAtom);
}
```

在其他的组件中想使用的话，只需要
先获得`useBcUser`方法，用此方法获得数据和set方法即可

```tsx
import {useBcUser} from "@/state/state-controller.ts";
const [bcUser, setBcUser] = useBcUser();
//输出用户名
console.log("用户ID：" + bcUser.userId);
console.log("用户名：" + bcUser.username);
// 更改用户信息
setBcUser({
   ...bcUser,
    username: "new username"
});
// 输出用户信息
console.log("更改后的用户名：" + bcUser.username);
```

# 动态背景

在使用tailwind的使用可以使用`bg-[url('链接')]`来动态的显示背景图片，但是在使用变量的时候，例如通过`getFirstImageUrlFromMarkdown(meetingdto.meetingIntro)`方法获得markdown中的图片链接，返回的是一个变量，而变量无法通过`bg-[url(${变量})]`的方式来设置背景，所以我们需要使用如下的方法。

```ts
style={{backgroundImage: `url(${getFirstImageUrlFromMarkdown(meetingdto.meetingIntro)})`}}
```

使用style，中的backgroundImage参数来设置变量作为背景。

# 路由配置之后，直接访问显示404

对于单页面应用程序SPA，有两种路由方式.

1. **Hash 路由**：在URL中使用哈希（#）来表示路由，例如`http://example.com/#/page1`。当哈希值改变时，**浏览器不会向服务器发送请求**，而是触发JavaScript事件，从而实现页面内容的更新。这种方式可以在不同的路由之间进行导航，而不会导致整个页面的重新加载。常见的Hash路由库包括React Router的HashRouter和Vue Router的hash 模式。
2. **Browser 路由**：也称为历史路由（HTML5 History API），利用HTML5 History API中的`pushState()`和`replaceState()`方法来实现前端路由。在这种情况下，URL看起来更加清晰，没有哈希符号，例如`http://example.com/page1`。当用户点击链接时，浏览器会向服务器发送请求，但服务器需要配置以处理这些URL。这种方式需要服务器端的支持，并且通常需要配置重定向规则以确保在刷新页面时正确加载相应的资源。

但是使用Browser路由的时候，由于刷新页面会重新请求服务器，如果服务器中没有进行设置，就会产生404的问题。这里我们使用Caddy服务器，有如下的解决方法-->[单页应用程序spa](../../../tools/caddy.md#单页应用程序spa)

## style.scss与style.module.scss的区别

[style.scss 与 style.module.scss 的主要区别是什么？](https://stackoverflow.com/questions/60735091/whats-the-main-diffrence-style-scss-vs-style-module-scss)
一个例子来展现了style.scss和style.module.scss之间的区别。

`*.scss`的用法
```scss
.ultra-specific-class-name_item {
  display: flex;
}
```
如果以正常方式使用SCSS，则必须将类名声明为字符串
```tsx {5} showLineNumbers
import './foo.scss';


const App = () => (
  <div className="ultra-specific-class-name_item">
    foo bar
  </div>
)
```
`*.module.scss`的用法
```scss
.item {
  display: flex;
}
```
类似与Tailwind的使用方式
```tsx {4} showLineNumbers
import styles from './foo.module.scss';

const App = () => (
  <div className={styles.item}>
    foo bar
  </div>
)
```