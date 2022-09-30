
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'OnlyWork', path: '', component: () => import('pages/Index.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/Auth/Login.vue') },
      { path: 'register', component: () => import('pages/Auth/Register.vue') },
      { path: 'forgot-password', component: () => import('pages/Auth/ForgotPassword.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
