<template>
	<div class="adv-box drug-class">
		<div class="adv-search">
			<div class="search-box">
				<span>建议内容：</span>
				<el-input type="text" v-model="content" style="width:30%;vertical-align: middle;margin-right:10px;" placeholder="请输入建议内容"></el-input>
				<span>患者姓名：</span>
				<el-input type="text" v-model="name" style="width:30%;vertical-align: middle;" placeholder="请输入患者姓名"></el-input>
				<el-button size="mini" type="primary" style="vertical-align: middle;margin-left:10px" @click="handleSearchHandle">查询</el-button>
			</div>
		</div>
		<div class="adv-table">
			<el-table :data="tableData">
				<el-table-column label="建议内容/分类" min-width="120px">
					<template slot-scope="scope">
						<div class="content" v-html="scope.row.content"></div>
					</template>

				</el-table-column>
				<el-table-column label="患者信息" min-width="120px">
					<template slot-scope="scope">
						<div class="info">
							<p>患者姓名：{{scope.row.author}}</p>
							<p>病区：{{scope.row.forecast}}</p>
							<p>床号：{{scope.row.platforms}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="提交人/操作时间">
					<template slot-scope="scope">
						<div class="person">
							<p>{{scope.row.submitName}}</p>
							<p>{{scope.row.createTime | transferTime}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="90px">
					<template slot-scope="scope">
						<div class="operate">
							<el-button v-if="scope.row.status!==1" type="text" @click="adoptionHandle(scope.row)">采纳</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="btn" v-if="isMore" @click="getMore">
			点击加载更多
		</div>
		<el-dialog :visible.sync="adoptionDialog" :before-close="adoptionCloseHandle" :close-on-click-modal="false" title="提示">
			<div class="adoption-tips">
				<el-button type="success" icon="el-icon-check" circle></el-button>
				<span>采纳成功</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import moment from 'moment'
import { fetchList } from '@/apis/article'
export default {
	name: 'suggest',
	data () {
		return {
			content: '',
			name: '',
			tableData: [],
			adoptionDialog: false,
			isMore: false,
			currentPage: 1,
			pageSize: 10,
			totalPage: 0
		}
	},
	created () {
		this.getData()
	},
	filters: {
		transferTime (val) {
			return moment(val).format('YYYY-MM-DD')
		}
	},
	methods: {
		getData () {
			fetchList().then(res => {
				if (res.code === 20000) {
					this.tableData = [...this.tableData, ...res.data.lists]
					this.currentPage = res.data.pageNum
					this.totalPage = res.data.total
					this.isMore = res.data.data.pageNum < res.data.data.totalPage
				} else {
					this.$message.error(res.message)
				}
			})
		},
		handleSearchHandle () {
			this.tableData = []
			this.getData()
		},
		// 点击加载
		getMore () {
			this.currentPage = this.currentPage + 1
			this.getData()
		},
		// 采纳
		adoptionHandle () {
			this.$message.success('采纳成功')
		},
		adoptionCloseHandle () {
			this.adoptionDialog = false
		}
	}
}
</script>
<style lang="less" scoped >
.adv-box {
	box-sizing: border-box;
	padding-top: 15px;
	.adv-search {
		box-sizing: border-box;
		padding-bottom: 15px;
		padding-left: 15px;
		border-bottom: 1px solid #e8eaed;
		.search-box {
			span {
				display: inline-block;
				vertical-align: middle;
				font-size: 14px;
				margin-right: 5px;
			}
			input {
				height: 30px;
				line-height: 30px;
				width: 20%;
				border: 1px solid #e8eaed;
				border-radius: 5px;
				margin-right: 10px;
			}
		}
	}
}
.adv-table {
	height: 80%;
	overflow-y: scroll;
	table {
		border-collapse: collapse;
		tr {
			border-bottom: 1pt solid #e8eaed;
		}
	}
	tbody {
		color: #888888;
		tr {
			td {
				padding-top: 10px;
			}
		}
	}
	thead {
		tr {
			height: 40px;
			th {
				color: #333;
			}
		}
	}
	.tab-content {
		width: 50%;
	}
	.tab-info {
		width: 20%;
	}
	.tab-person {
		width: 15%;
	}
	.tab-op {
		width: 15%;
	}
	.content {
		box-sizing: border-box;
		padding: 5px 10px;
		padding-right: 30px;
		font-size: 16px;
		line-height: 20px;
		text-align: top;
		min-height: 70px;
		.cont-btn {
			margin-top: 10px;
			button {
				font-size: 14px;
				height: 25px;
				line-height: 20px;
				text-align: center;
				color: #ff8e2f;
				margin: 0 5px;
				border: 1px solid #ff8e2f;
				padding: 2px 10px;
				border-radius: 10px;
				margin-bottom: 3px;
			}
		}
	}
	.info {
		box-sizing: border-box;
		padding-left: 10px;
		vertical-align: top;
	}
	.person {
		vertical-align: top;
	}
	.operate {
		text-align: center;
		vertical-align: top;
		button {
			font-size: 16px;
			text-align: center;
			color: #ff8e2f;
			margin: 0 5px;
			cursor: pointer;
		}
	}
}
.btn {
	cursor: pointer;
	padding: 10px;
	box-sizing: border-box;
	color: #888;
	text-align: center;
	font-size: 14px;
}
.adoption-tips {
	text-align: center;
	button {
		padding: 5px;
	}
	span {
		display: inline-block;
		margin-left: 5px;
		vertical-align: middle;
		font-size: 16px;
	}
}
</style>