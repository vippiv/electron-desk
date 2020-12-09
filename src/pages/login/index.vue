<template>
	<div class="login-container" style="">
		<el-form ref="form" label-width="80px" v-if="dev_flag">
			<el-form-item label="用户名：">
				<el-input v-model="username" placeholder="随意"></el-input>
			</el-form-item>
			<el-form-item label="密码：">
				<el-input v-model="password" placeholder="随意"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="medium" @click="login">登陆</el-button>
			</el-form-item>
		</el-form>
		<p v-else v-loading="loading">正在加载中，请稍后...</p>
	</div>
</template>
<script>
import { fetchLogin } from '@/apis/login'
import baseInfo from '@/utils/config'
const ipcRenderer = window.require("electron").ipcRenderer

export default {
	name: 'login',
	data () {
		return {
			username: '',
			password: '',
			loading:false,
			dev_flag:baseInfo.DEV_DEBUG
		}
	},
	mounted(){
		ipcRenderer.on('main-process-message', (event, arg) => {
			let tempArr = arg.split('&')
			this.username = tempArr[0].split('=')[1]
			this.password = tempArr[1].split('=')[1]
			this.login()
		})
	},
	methods: {
		login () {
			let params = {
				username: this.username,
				password: this.password
			}
			fetchLogin(params).then(res => {
				console.log('res.data.code', res.data.code)
				if (res.code === 20000) {
					localStorage.userInfo = JSON.stringify(res.data)
					ipcRenderer.send('initSocketHandle', res.data)
					// 设置当前登陆对象
					this.$store.commit('setLoginUserInfo', res.data)
					this.$router.push('/message')
					this.loading= false
				} else {
					this.$message.error(res.message)
				}
			})
		}
	}
}
</script>

<style>
	.login-container {
		text-align:center;
		margin: 150px auto 0; 
		width: 460px;
	}
</style>