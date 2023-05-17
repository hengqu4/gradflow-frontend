import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
  Router,
} from 'vue-router';
import Layout from '@/layout/index.vue';
// 扩展继承属性
interface extendRoute {
  hidden?: boolean;
}
//
import errorRouter from './modules/error';
// import tableRouter from './modules/table'
// import formRouter from './modules/from'

// 异步组件
export const asyncRoutes = [
  // ...tableRouter,
  // ...formRouter,
  ...errorRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];

/**
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 */

export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' },
  },

  {
    path: '/',
    component: Layout,
    name: 'home',
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          keepAlive: true,
          icon: 'House',
          role: ['other'],
        },
      },
    ],
  },

  {
    path: '/base-info',
    component: Layout,
    name: 'base-info',
    redirect: '/base-info',
    children: [
      {
        path: '/base-info',
        component: () => import('@/views/base-info/index.vue'),
        meta: {
          title: '基本信息',
          keepAlive: true,
          icon: 'User',
          role: ['other'],
        },
      },
    ],
  },
  {
    path: '/prequalification',
    component: Layout,
    name: 'prequalification',
    redirect: '/prequalification',
    children: [
      {
        path: '/prequalification',
        component: () => import('@/views/prequalification/index.vue'),
        name: 'prequalification',
        meta: {
          title: '学生预审表',
          icon: 'Document',
          affix: true,
          role: ['other'],
        },
      },
    ],
  },

  {
    path: '/review',
    component: Layout,
    name: 'review',
    redirect: '/review',
    children: [
      {
        path: '/review',
        component: () => import('@/views/review/index.vue'),
        name: 'review',
        meta: {
          title: '毕业论文',
          icon: 'Reading',
          affix: true,
          role: ['other'],
        },
      },
    ],
  },
  {
    path: '/defense',
    component: Layout,
    name: 'defense',
    redirect: '/defense',
    children: [
      {
        path: '/defense',
        component: () => import('@/views/defense/index.vue'),
        name: 'defense',
        meta: {
          title: '毕业答辩',
          icon: 'Postcard',
          affix: true,
          role: ['other'],
        },
      },
    ],
  },
  {
    path: '/degree',
    component: Layout,
    name: 'degree',
    redirect: '/degree',
    children: [
      {
        path: '/degree',
        component: () => import('@/views/degree/index.vue'),
        name: 'degree',
        meta: {
          title: '学位申请',
          icon: 'Discount',
          affix: true,
          role: ['other'],
        },
      },
    ],
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    hidden: true,
    meta: {
      requiresAuth: true,
      title: '403页面',
      key: '403',
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
    meta: {
      requiresAuth: true,
      title: '404页面',
      key: '404',
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), // history
  history: createWebHashHistory('/'), // hash
  routes: constantRoutes,
});

export default router;
