# React-Router-Dom

## 常用技巧

### 动态路由

```ts
{
  path: "/blogdetail/:id",
  element: <BlogDetailPage />,
},
```

```tsx
const { id } = useParams();
const blogId = Number(id);
```

### 路由跳转
```tsx
const navigate = useNavigate();

onClick={() => navigate("/about")}
```
### 当前路由
```tsx
const location = useLocation();
```

### 路由的整体设计方案

以我这个为例
```tsx {4,5,9}
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayouts />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <IndexLayouts />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "/blog",
            element: <BlogPage />,
          },
          {
            path: "/about",
            element: <AboutPage />,
          },
          {
            path: "/test1",
            element: <TestPageOne />,
          },
          {
            path: "/blogdetail/:id",
            element: <BlogDetailPage />,
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayouts />,
        children: [
          {
            index: true,
            element: <AdminHomePage />,
          },
          {
            path: "statistics",
            element: <AdminStatisticsPage />,
          },
          {
            path: "tags",
            element: <AdminTagsPage />,
          },
          {
            path: "blogs",
            element: <AdminBlogPage />,
          },
          {
            path: "blogs/add",
            element: <AdminAddBlogPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/403",
    element: <NotAuthorizedPage />,
  },
]);
```
```tsx
function RootLayouts() {
  return (
    <div className="overflow-x-clip">
      <Outlet />
    </div>
  );
}
```

```tsx
function IndexLayouts() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer/>
    </>
  );
}
```

以`RootLayouts`为页面的主路由，以`IndexLayouts`来定义这个系列的页面的整体设计样式。