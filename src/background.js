
import { app, protocol, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import baseInfo from './utils/config.js'
const log = require('electron-log')
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
let win = null
/**
 *  protocol可以注册一个协议，或者使用已经存在的协议
 *	protocol只在app ready事件后才能使用
 */
protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true } }
])

//判断使用平台
const isWindows = process.platform === 'win32'

function createWindow () {
	Menu.setApplicationMenu(null)
	/**
	 *  TODO 窗口最小化再打开，窗口高度会缩小一点，在重新打开的地方重新设置尺寸，第一次有效，第二次及以后无效
	 */
	win = new BrowserWindow({
		width: 1000,
		height: 600,
		frame: false,
		transparent: true,
		title: baseInfo.BASE_TITLE,
		resizable: false, // 可否缩放
		movable: true, // 可否移动
		webPreferences: {
			nodeIntegration: true,
		},
		icon: path.join(__static, 'icon.png')
	})

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		// win.webContents.openDevTools() // 打开调试工具
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
	} else {
		createProtocol('app')
		// win.webContents.openDevTools() // 打开调试工具
		// Load the index.html when not in development
		win.loadURL('app://./index.html')
	}
	if (isWindows) {
		// 网页打开
		if (process.argv[1] !== undefined) {
			win.webContents.on('did-finish-load', function () {
				win.webContents.send('main-process-message', process.argv[1].split("?")[1])
			})
		} else {
			win = null
		}
	}
	win.on('closed', () => {
		win = null
	})
	// win.on("will-resize", resizeWindow);
}

// 异步消息
ipcMain.on('async-msg', (evt, args) => {
	evt.sender.send('async-reply', `pong ${Math.floor(Math.random() * 1000000)}`)
})

// 同步消息
ipcMain.on('sync-msg', (evt, args) => {
	evt.returnValue = 'sync ' + args + ' pong ' + Math.floor(Math.random() * 1000000)
})

let appTray = null
let timer = null, count = 0
// 自定义托盘
function setTray () {
	// 系统托盘图标目录
	let trayMenuTemplate = [
		{
			label: '打开主面板',
			icon: '',
			click: () => {
				console.log('打开在主面板')
				reOpenWin()
			}
		}, {
			label: '锁定',
			icon: '',
			click: () => {
				console.log('锁定')
			}
		}, {
			label: '退出',
			icon: '',
			click: () => {
				console.log('quit')
				app.quit()
			}
		}
	]
	let iconPath = path.join(__static, 'favicon.ico') // 最小化到托盘的图标
	appTray = new Tray(iconPath)
	// 图标的上下文菜单
	const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
	// 隐藏主窗口
	win.hide()
	// 设置托盘悬浮提示
	appTray.setToolTip('electron desk')
	// 设置 托盘菜单
	appTray.setContextMenu(contextMenu)
	// 点击托盘
	appTray.on('double-click', function () {
		reOpenWin()
	})
}

function reOpenWin () {
	clearInterval(timer)
	count = 0
	win.show() // 显示主程序
	win.setSize(1000, 600)
	win.setSkipTaskbar(false)
	appTray.destroy() // 删除系统托盘图标
}

ipcMain.on('trayHandle', function () {
	setTray()
})

function message (data) {
	if (JSON.parse(data.data).data != '' && JSON.stringify(JSON.parse(data.data).data).indexOf('kill process') != -1) {
		// web 端登出 同时客户端退出
		exitHandle()
	} else if (JSON.parse(data.data).data === 'openChatRoom') {
		// pc端打开聊天窗
		win.show()
		win.webContents.send('renderData', data.data)
	} else {
		// win.flashFrame(true) //有消息时图标闪烁
		win.webContents.send('renderData', data.data)
		win.webContents.on('did-finish-load', function () {
			win.webContents.send('renderData', data.data)
		});
		shadowHandle()
	}

}
function shadowHandle () {
	clearInterval(timer)
	if (!win.isMinimized()) {
		clearInterval(timer)
		win.flashFrame(true)
	} else {
		timer = setInterval(function () {
			count++
			if (count % 2 == 0) {
				appTray.setImage(path.join(__static, 'favicon1.ico'))
			} else {
				appTray.setImage(path.join(__static, 'favicon.ico'))
			}
		}, 500)
	}
}
// 生产环境有效
function exitHandle () {
	app.quit()
	// win = null
}
function errorHandle () {
	win = null
}
function closeHandle () {
	win = null
}

ipcMain.on('window-max', function () {
	// 生产环境
	if (!win.isFullScreen()) {
		win.setFullScreen(true)
	} else {
		win.setFullScreen(false)
		win.restore()
	}
})
ipcMain.on('window-close', function () {
	win.hide()
	app.quit()
})

// 注册协议
const PROTOCOL = 'myApp'  // 协议地址 myapp:?userName=&passWord=
app.setAsDefaultProtocolClient(PROTOCOL)

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
	app.quit()
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow()
	}
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		try {
			await installExtension(VUEJS_DEVTOOLS)
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString())
		}
	}
	createWindow()
})

/**
 * 某个窗口失去焦点是触发，用于打开多窗口的情况
 */
app.on('browser-window-blur', (evt) => {
	// console.log('browser-window-blur hahhah', evt)
})

/**
 * 某个窗口获得焦点是触发，用于打开多窗口的情况
 */
app.on('browser-window-focus', (evt) => {
	// console.log('browser-window-focus hahah', evt)
})

/**
 * 新创建一个窗口时触发，用于打开多窗口的情况
 */
app.on('browser-window-created', (evt) => {
	// console.log('browser-window-created haha', evt)
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit()
			}
		})
	} else {
		process.on('SIGTERM', () => {
			app.quit()
		})
	}
}


// process.platform在Max OS X平台会返回darwin
// 在64位Windows平台下process.platform会返回win32

/**
 * ipcMain 主进程中使用，控制着从渲染进程中发送过来的异步和同步的消息
 * ipcRender 渲染进程中使用，向主进程发送消息
 * 主进程可往渲染进程发消息(ipcMain webContents.send)，渲染进程也可向主进程发消息(ipcRender)
 */