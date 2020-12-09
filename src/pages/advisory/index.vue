
<template>
	<div class="adv-box drug-class">
		<div class="adv-search">
			<div class="search-box">
				<span>咨询内容：</span>
				<input type="text" v-model="content" placeholder="请输入建议内容">
				<span>咨询时间：</span>
				<el-date-picker v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button size="mini" type="primary" @click="searchHandle" style="vertical-align: middle;margin-left:10px">查询</el-button>
			</div>
		</div>
		<div class="adv-table">
			<el-table :data="tableData">
				<el-table-column label="咨询内容/分类" prop="" min-width="200px">
					<template slot-scope="scope">
						<div class="content">
							<p v-html="scope.row.zxContent"></p>
							<div class="cont-btn">
								<button v-for="item in scope.row.consultingCategoryList" :key="item.consultingCategoryId">
									{{item.name}}
								</button>
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="回复内容" prop="reply" class="info" min-width="180px">
					<template slot-scope="scope">
						<div v-html="scope.row.content"></div>
					</template>
				</el-table-column>
				<el-table-column label="回复人" prop="author" class="person" width="80px">
				</el-table-column>
				<el-table-column label="操作" prop="" min-width="100px">
					<template slot-scope="scope">
						<div class="operate">
							<p>
								<el-rate v-model="scope.row.feedbackScore" :disabled='true' v-if="scope.row.feedbackScore!==0"></el-rate>
								<button v-else type="text" @click="getRecordDialog(scope.row)">评分</button>
							</p>
							<p>{{scope.row.consultingTime}}</p>
							<p>{{scope.row.replyTime}}</p>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="btn" v-if="isMore" @click="getMore">
			点击加载更多
		</div>
		<el-dialog :visible.sync="recordDialog" :close-on-click-modal='false' :before-close='handleClolse' title="评分">
			<div style="text-aline:center;">
				<span>咨询评分:</span>
				<el-rate v-model="score" style="display:inline-block;vertical-align: middle;"></el-rate>
			</div>
			<div class="dialog-btn">
				<button @click="handleClolse">取消</button>
				<button @click="scoreHandle">确定</button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { formateDate } from '@/utils/publicFun'
import { fetchList } from '@/apis/suggest'

export default {
	name: 'suggest',
	data () {
		return {
			content: '', //咨询内容
			name: '',
			dateTime: '',
			score: 0, //评分
			recordDialog: false,
			tableData: [],
			currentPage: 1,
			pageSize: 10,
			isMore: true,
			startTime: '',
			endTime: '',
			totalPage: 0
		}
	},
	created () {
		this.getData()
	},
	methods: {
		getData () {
			let params = {
				content: this.content,
				current: this.currentPage,
				size: this.pageSize,
				startTime: this.startTime,
				endTime: this.endTime
			}
			fetchList(params).then(res => {
				if (res.code === 20000) {
					this.tableData = [...this.tableData, ...res.data.lists]
					this.currentPage = res.data.pageNum
					this.totalPage = res.data.totalPage
					this.isMore = res.data.data.pageNum < res.data.data.totalPage
				} else {
					this.$message.error(res.message)
				}
				console.log('this.tableData', this.tableData)
			})
		},
		// 点击加载
		getMore () {
			this.currentPage = this.currentPage + 1
			this.getData()
		},
		searchHandle () {
			if (this.dateTime !== '' && this.dateTime !== null) {
				this.startTime = formateDate(new Date(this.dateTime[0]).getTime(), 'yyyy-MM-dd HH:mm:ss')
				this.endTime = formateDate(new Date(this.dateTime[1]).getTime(), 'yyyy-MM-dd HH:mm:ss')
			} else {
				this.startTime = ''
				this.endTime = ''
			}
			this.getData()
		},
		// 评分
		scoreHandle () {
			this.$message.success('评分成功')
		},
		getRecordDialog (obj) {
			this.recordDialog = true
			this.tempObj = obj
		},
		handleClolse () {
			this.recordDialog = false
			this.score = 0
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
		.adv-sub-title {
			font-size: 18px;
			line-height: 35px;
			color: #333333;
		}
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
				text-indent: 10px;
			}
			.btn-search {
				font-size: 16px;
				color: #ffffff;
				line-height: 20px;
				padding: 5px 20px;
				border-radius: 5px;
				cursor: pointer;
				background: #ff8c00;
				margin-left: 5px;
				vertical-align: middle;
			}
		}
	}
}
.adv-table {
	height: 75%;
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
		width: 30%;
	}
	.tab-info {
		width: 45%;
	}
	.tab-person {
		width: 10%;
	}
	.tab-op {
		width: 15%;
	}
	.content {
		box-sizing: border-box;
		padding: 5px 10px;

		font-size: 16px;
		line-height: 20px;
		text-align: top;
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
			}
		}
	}
	.info {
		box-sizing: border-box;
		padding-left: 10px;
		vertical-align: top;
		padding-right: 30px;
	}
	.person {
		vertical-align: top;
		text-align: center;
	}
	.operate {
		text-align: left;
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
.dialog-btn {
	text-align: right;
	padding: 10px 15px;
	box-sizing: border-box;
	button {
		padding: 5px 15px;
		font-size: 14px;
		cursor: pointer;
		background: #ff8c00;
		border-radius: 5px;
		margin: 0 10px;
		color: #fff;
	}
}
</style>
<style lang='less'>
.el-input__inner {
	height: 30px;
	line-height: 30px;
}
.el-date-editor .el-range-separator {
	line-height: 28px;
}
.el-date-editor .el-range__icon {
	vertical-align: middle;
}
.el-date-editor .el-range__close-icon {
	line-height: 25px;
}
</style>