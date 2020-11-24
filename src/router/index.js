import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/welcome.vue'
import Users from '../users/users.vue'
import Rights from '../power/rights.vue'
import Roles from '../power/roles.vue'
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/roles',
    component: Roles
  }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenSkr = window.sessionStorage.getItem('token')
  if (!tokenSkr) return next('/login')
  next()
})

export default router