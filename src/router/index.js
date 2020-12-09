import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/pages/main/index.vue'

import Login from '@/pages/login'
import side from './side'
Vue.use(Router)

const router = new Router({
	mode: 'hash',
	routes: [
		{
			path: '/',
			redirect: '/login',
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/message',
			name: 'app',
			component: Main,
			children: [
				...side
			]
		}
	]
})

export default router