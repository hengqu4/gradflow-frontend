/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const formRouter = [
  {
    path: '/form',
    component: Layout,
    redirect: '/form/validateForm',
    name: 'form',
    alwaysShow: true,
    meta: {
      title: '表单',
      icon: 'Grape',
    },
    children: [
      {
        path: 'validateForm',
        component: () => import('@/views/form/validateForm/index.vue'),
        name: 'validate-form',
        meta: { title: '校验 Form', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default formRouter
