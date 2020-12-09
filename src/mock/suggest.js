const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const zxBaseContent = '<p>I am testing data, I am testing data.</p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
	List.push(Mock.mock({
		id: '@increment',
		timestamp: +Mock.Random.date('T'),
		author: '@first',
		reviewer: '@first',
		title: '@title(5, 10)',
		content_short: 'mock data',
		content: baseContent,
		zxContent: zxBaseContent,
		forecast: '@float(0, 100, 2, 2)',
		importance: '@integer(1, 3)',
		'type|1': ['CN', 'US', 'JP', 'EU'],
		'status|1': ['published', 'draft'],
		display_time: '@datetime',
		comment_disabled: true,
		pageviews: '@integer(300, 5000)',
		image_uri,
		platforms: ['a-platform'],
		submitName: 'admin',
		createTime: new Date().getTime(),
		pageNum: 1
	}))
}

module.exports = [{
		url: '/vue-element-admin/suggest/list',
		type: 'get',
		response: config => {
			const {
				importance,
				type,
				title,
				page = 1,
				limit = 20,
				sort
			} = config.query

			let mockList = List.filter(item => {
				if (importance && item.importance !== +importance) return false
				if (type && item.type !== type) return false
				if (title && item.title.indexOf(title) < 0) return false
				return true
			})

			if (sort === '-id') {
				mockList = mockList.reverse()
			}

			const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

			return {
				code: 20000,
				data: {
					total: mockList.length,
					lists: pageList,
					pageNum: 1
				}
			}
		}
	},

	{
		url: '/vue-element-admin/suggest/detail',
		type: 'get',
		response: config => {
			const {
				id
			} = config.query
			for (const article of List) {
				if (article.id === +id) {
					return {
						code: 20000,
						data: article
					}
				}
			}
		}
	},

	{
		url: '/vue-element-admin/suggest/pv',
		type: 'get',
		response: () => {
			return {
				code: 20000,
				data: {
					pvData: [{
							key: 'PC',
							pv: 1024
						},
						{
							key: 'mobile',
							pv: 1024
						},
						{
							key: 'ios',
							pv: 1024
						},
						{
							key: 'android',
							pv: 1024
						}
					]
				}
			}
		}
	},

	{
		url: '/vue-element-admin/suggest/create',
		type: 'post',
		response: () => {
			return {
				code: 20000,
				data: 'success'
			}
		}
	},

	{
		url: '/vue-element-admin/suggest/update',
		type: 'post',
		response: () => {
			return {
				code: 20000,
				data: 'success'
			}
		}
	}
]