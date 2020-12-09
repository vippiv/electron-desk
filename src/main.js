import Vue from 'vue'
import App from './App.vue'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import './styles/public.css'
import './styles/font/iconfont.css'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
	const { mockXHR } = require('./mock')
	mockXHR()
}

Vue.use(router)
Vue.use(Element)
Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router,
	store: store,
}).$mount('#app')
