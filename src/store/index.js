import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { formateDate } from './../utils/publicFun'
// socket 消息
const ipcRenderer = window.require("electron").ipcRenderer
ipcRenderer.on('renderData', (event, data) => {
	store.dispatch({
		type: 'saveMsgSocketAction',
		amount: JSON.parse(data)
	})
})
const store = new Vuex.Store({
	state: {
		currentUserObj: {}, //当前登陆用户
		currentFriendObj: {},//当前聊天对象
		deptName: '',//当前科室
		memberList: [],//科室成员
		msgMemberList: [], //消息列表成员
		msgList: [], //消息列表
		friendId: ''//当前聊天对象Id 即friendId
	},
	mutations: {
		// 设置当前登陆对象
		setLoginUserInfo (state, payload) {
			state.currentUserObj = payload
		},
		// 科室成员
		setDeptMember (state, payload) {
			state.deptName = payload.deptName
			state.memberList = payload.list
		},
		// 消息列表当前成员的聊天内容
		saveCurrentMsgList (state, payload) {
			state.msgList = payload
		},
		// 读取上次关闭前本地缓存中的消息列表成员
		readCacheMemberList (state, payload) {
			state.msgMemberList = payload
		},
		// 消息列表成员
		saveMemberList (state, payload) {
			state.msgMemberList.push(payload)
			// localStorage.setItem('memberList', JSON.stringify(state.msgMemberList))
			localStorage.setItem(state.currentUserObj.userId, JSON.stringify(state.msgMemberList))
		},
		// 当前聊天对象
		saveCurrentFriendObj (state, payload) {
			state.currentFriendObj = payload
			state.friendId = payload.userId
		},
		// 当前发送的消息
		updateMsgList (state, payload) {
			state.msgList.push(payload)
		},

	},
	actions: {
		// socket 消息来源
		async saveMsgSocketAction (context, payload) {
			// 当前聊天列表不为空
			let index = context.state.msgMemberList.findIndex(item => item.userId == payload.amount.userId)
			if (index === -1) {
				payload.amount.msgFlag = true
				// 更新聊天列表 msgMemberList
				await context.commit('saveMemberList', payload.amount)
			} else {
				context.state.msgMemberList[index].msgFlag = true
			}

			// 判断当前消息是否来源当前聊天对象
			if (payload.amount.userId === context.state.friendId) {
				// 接口请求 push msgList
				
			} else {
				// 判断是否是pc端传来的打开聊天室信息
				if (payload.amount.data === 'openChatRoom') {
					context.state.friendId = payload.amount.userId
					context.commit('saveCurrentFriendObj', payload.amount)
					context.state.msgMemberList[index].msgFlag = false
				} else {
					// 不是当前聊天人的消息，则消息对应人 提示有新消息
					context.state.msgMemberList.forEach(item => {
						if (item.userId === payload.amount.userId) {
							item.msgFlag = true
						} else {
							item.msgFlag = false
						}
					})
				}
			}
		},
		// saveMsgFormMemberAction 通讯录
		async saveMsgFormMemberAction (context, payload) {
			let date = +new Date()
			let startTime = date - 1000 * 60 * 60 * 24
			let params = {
				current: 1,
				size: 10,
				endTime: formateDate(new Date().getTime(), 'yyyy-MM-dd'),
				startTime: formateDate(new Date(startTime).getTime(), 'yyyy-MM-dd'),
				userId: JSON.parse(localStorage.getItem('userInfo')).userId,
			}
			let index = context.state.msgMemberList.findIndex(item => item.userId == payload.amount.userId)
			// 不在聊天对象列表
			if (index === -1) {
				payload.amount.msgFlag = true
				await context.commit('saveMemberList', payload.amount)
				await context.commit('saveCurrentFriendObj', payload.amount)
				params.friendId = payload.amount.userId
			} else {
				payload.amount.msgFlag = false
				// 在聊天对象列表， 判断是不是当前聊天对象
				if (payload.amount.userId !== context.state.friendId) {
					context.state.msgMemberList[index].msgFlag = true
				}
				await context.commit('saveCurrentFriendObj', payload.amount)
				params.friendId = payload.amount.userId
			}
		},
		// 点击切换聊天对象
		async setClickCurrentAction (context, payload) {
			payload.msgFlag = false
			await context.commit('saveCurrentFriendObj', payload)
		}
	},
	getters: {
		getMsgList: state => state.msgList,
		getFriendId: state => state.friendId,
		getMemberList: state => state.msgMemberList
	}


})

export default store