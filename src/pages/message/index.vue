<template>
	<div class="app-container message-send">
		<h2>主进程，渲染进程通信</h2>
		<p>原消息: {{message}}</p>
		<p>新消息(异步)：{{newMessage}}</p>
		<p>新消息(同步)：{{syncMessage}}</p>
		<el-button type="primary" @click="handleMessageToMainProcessAsync">发异步消息</el-button>
		<el-button type="primary" @click="handleMessageToMainProcessSync">发同步消息</el-button>
	</div>
</template>

<script>
const ipcRenderer = window.require('electron').ipcRenderer

export default {
	name: 'MessageSend',
	data () {
		return {
			message: 'ping',
			newMessage: '',
			syncMessage: ''
		}
	},
	mounted () {
		ipcRenderer.on('async-reply', (event, arg) => {
			this.newMessage = this.message + " " + arg
		})
	},
	methods: {
		handleMessageToMainProcessAsync () {
			ipcRenderer.send('async-msg', this.message) // 发异步消息
		},
		handleMessageToMainProcessSync () {
			const ret = ipcRenderer.sendSync('sync-msg', this.message) // 发同步消息
			this.syncMessage = ret
		}
	}
}
</script>

<style scoped>

	.message-send > h2, .message-send > p{
		line-height: 2;
	}
</style>