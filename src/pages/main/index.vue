<template>
	<div id="app">
		<div id="sidebar">
			<menu-bar></menu-bar>
		</div>
		<div style="width: calc(100% - 76px)">
			<div class="window-handler drug-class">
				<div class="handler handler-min" @click="minimizeWin">
					<i class="iconfont icon-win-min" style="color: black"></i>
				</div>
				<div class="handler handler-max" @click="maximizeWin">
					<i class="iconfont icon-win-max" style="color: black"></i>
				</div>
				<div class="handler handler-close" @click="closeWin">
					<i class="iconfont icon-win-close" style="color: black"></i>
				</div>
			</div>
			<div style="display: flex;">
				<keep-alive>
					<router-view name="menus"></router-view>
				</keep-alive>

				<keep-alive>
					<router-view id="content-box" name="contents"></router-view>
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
import MenuBar from '@/components/sidebar/menu-bar'
const remote = window.require('electron').remote
const ipcRenderer = window.require('electron').ipcRenderer

export default {
	name: 'app',
	components: {
		MenuBar,
	},
	data () {
		return {};
	},
	created () {
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
		},
		closeWin () {
			ipcRenderer.send('window-close')
		}
	}
};
</script>


<style lang="less" scoped>
#app {
	display: flex;
	width: 100%;
	height: 100%;
	background: #f6f9fd;
	box-sizing: border-box;
}

#sidebar {
	height: 100vh;
	box-sizing: border-box;
	min-width: 76px;
	background: #1d93a8;
}

#menu-content {
	width: 25%;
	height: 100vh;
	min-width: 270px;
	max-width: 270px;
	background: #fff;
	box-sizing: border-box;
	// overflow-y: scroll;
}

#content-box {
	// flex: 3;
	width: 100%;
	height: 100vh;
	background: #fff;
	box-sizing: border-box;
	min-width: 600px;
}
#content-box>div{
	border-radius: 0 5px 5px 0;
}
.window-handler {
	border-bottom: 1px solid #E8EAED;
	background-color: white;
	text-align: right;
	padding: 10px 10px 10px 0;
	.handler {
		display: inline-block;
		width: 20px;
		height: 20px;
		position: relative;
		cursor: pointer;
	}
	.handler-close {
		color: #9099A1;
		i {
			font-size: 14px;
		}
	}
}
</style>