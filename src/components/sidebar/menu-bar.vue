<template>
	<div id="menu-bar" class="drug-class">
		<div class="avatar">
			<span class="user-info">{{this.name.toLocaleUpperCase()}}</span>
		</div>
		<div class="menu" v-for="item in routes" :key="item.path">
			<router-link tag="span" :to='item.path' exact-active-class="active">
				<span class="menu-img"> <i class="iconfont" :class="item.icon" style="font-size:18px;"></i></span>
				<p>{{item.name}}</p>
			</router-link>
		</div>
	</div>
</template>
<script>
const remote = window.require('electron').remote
const ipcRenderer = window.require('electron').ipcRenderer
import routes from '@/router/side'

export default {
	name: 'menuBar',
	data () {
		return {
			userInfo: {},
			name: '',
			routes: []
		}
	},
	mounted () {
		if (localStorage.getItem('userInfo') !== null) {
			this.userInfo = JSON.parse((localStorage.getItem('userInfo')))
			this.name = this.userInfo.nickName.split('')[0]
		}
		this.routes = routes
	},
	methods: {
		// 窗口最小
		minimizeWin () {
			const win = remote.getCurrentWindow();
			win.minimize();
			ipcRenderer.send('trayHandle')
		},
		maximizeWin () {
			ipcRenderer.send('window-max')
		}

	}

}
</script>
<style lang="less" scoped>
#menu-bar {
	width: 100%;
	box-sizing: border-box;
	padding: 10px 5px 20px 5px;
	background: #1d93a8;
	color: #fff;
	text-align: center;
	.avatar {
		margin-bottom: 30px;
		cursor: pointer;
		.user-info {
			display: inline-block;
			width: 35px;
			height: 35px;
			background: #fff;
			font-size: 16px;
			font-family: "Source Han Sans CN Regular, Source Han Sans CN Regular-Regular";
			font-weight: 400;
			line-height: 37px;
			border-radius: 100%;
			text-align: center;
			color: #888888;
		}
	}
	.menu {
		text-align: center;
		font-size: 14px;
		font-family: "Source Han Sans CN Regular, Source Han Sans CN Regular-Regular";
		font-weight: 400;
		text-align: center;
		color: #6dbac8;
		margin-bottom: 30px;
		cursor: pointer;
		.menu-img {
			display: block;
			border-radius: 100%;
			color: #e5e5fa;
			margin: 0 auto;
			margin-bottom: 5px;
			.iconfont-icon {
				font-size: 26px;
				color: #6dbac8;
			}
		}
		.active,
		.router-link-active {
			color: #fff;
			.menu-img {
				.iconfont-icon {
					color: #fff;
				}
			}
		}
	}
}
</style>