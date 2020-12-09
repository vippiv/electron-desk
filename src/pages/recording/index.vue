<template>
	<div class="adv-box drug-class">
		<div class="adv-search">
			<div class="search-box">
				<span>申请时间：</span>
				<el-date-picker v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
				<el-button size="mini" type="primary" @click="searchHandle" style="vertical-align: middle;margin-left:10px">查询</el-button>
			</div>
		</div>
		<div class="adv-table">
			<el-table :data="tableData">
				<el-table-column label="患者信息" min-width="130px">
					<template slot-scope="scope">
						<div class="content">
							<p>
								患者姓名：{{scope.row.name}}
							</p>
							<p>住院号：{{scope.row.hospitalizationNumber}}</p>
							<p>病区：{{scope.row.inpatientAreaName}}</p>
							<p>床号：{{scope.row.bedNumber}}</p>
							<p class="cont-btn">
								<button>{{scope.row.consultationLevel===1?'普通':scope.row.consultationLevel===2?'紧急':''}}</button>
							</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="申请信息" min-width="120px">
					<template slot-scope="scope">
						<div class="info">
							<p>{{scope.row.applicantName}}</p>
							<p>{{scope.row.applicantTime}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="会诊药师/会诊时间" min-width="120px">
					<template slot-scope="scope">
						<div class="person">
							<p>{{scope.row.conPharmacistName}}</p>
							<p>{{scope.row.consultationTime}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<div class="status">
							<p>{{scope.row.status===1?"待分配":scope.row.status===2?'待处理':'已完成'}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<div class="operate">
							<button @click="printHandle(scope.row)">打印</button>
							<button @click="showDetail(scope.row)">查看详情</button>
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
				<el-rate v-model="rate" style="display:inline-block;vertical-align: middle;"></el-rate>
			</div>
			<div class="dialog-btn">
				<button @click="handleClolse">取消</button>
				<button>确定</button>
			</div>
		</el-dialog>

		<el-drawer title="查看详情" :visible.sync="drawerVisible" direction="rtl" size="50%" :before-close="drawerClose">
			<h2>会诊记录</h2>
			<div class="info-dialog">
				<p class="info-top-item info-item-attr">
					<span>患者姓名：</span>
					<span>{{tempObj.name}}</span>
				</p>
				<p class="info-top-item info-item-attr">
					<span>住院号：</span>
					<span>{{tempObj.hospitalizationNumber}}</span>
				</p>
				<p class="info-top-item info-item-attr">
					<span>科室：</span>
					<span>{{tempObj.deptName}}</span>
				</p>
				<p class="info-top-item info-item-attr">
					<span>病区：</span>
					<span>{{tempObj.inpatientAreaName}}</span>
				</p>
				<p class="info-top-item info-item-attr">
					<span>床号：</span>
					<span>{{tempObj.bedNumber}}</span>
				</p>
			</div>
			<div class="info-dialog">
				<p class="info-item">
					<span>会诊意见：</span>
					<el-input type="textarea" v-model="tempObj.opinions" disabled style="width:75%"></el-input>
				</p>
			</div>
			<div class="info-dialog">
				<p class="info-top-item">
					<span>会诊时间：</span>
					<el-input disabled style="width:90%" v-model="tempObj.consultationTime"></el-input>
				</p>
				<p class="info-top-item">
					<span>会诊药师：</span>
					<el-input disabled style="width:90%" v-model="tempObj.conPharmacistName"></el-input>
				</p>
			</div>
			<div class="info-dialog">
				<p class="info-item">
					<span>会诊等级：</span>
					<span>{{tempObj.consultationLevel==1?'普通':tempObj.consultationLevel==2?'紧急':''}}</span>
				</p>
			</div>
			<div class="info-dialog">
				<p class="info-item">
					<span>会诊目的：</span>
					<el-input disabled style="width:80%" v-model="tempObj.consultationPurpose"></el-input>
				</p>
			</div>
			<div style="text-align:right;padding:5px;box-sizing:border-box;">
				<el-button type="default" @click="drawerClose">取消</el-button>
				<el-button type="primary" @click="printHandle(tempObj)">打印</el-button>
			</div>
		</el-drawer>
		<el-Dialog :visible.sync='printVisible' width="740px">
			<div>
				<form id="printForm">
					<table border="1" width="700" height="1010" cellspacing="0" bgcolor="#FFF" style="border-collapse:collapse;table-layout:fixed;text-align:center;">
						<caption><span style="float:left;">申请科室：{{detail.deptName}}</span><span style="float:right;">申请时间：{{detail.applicantTime}}</span></caption>
						<tbody>
							<tr style="border:solid 1px black">
								<td width="60" height="50">患者姓名</td>
								<td width="50">{{detail.name}}</td>
								<td width="50">性别</td>
								<td width="50">{{detail.sex}}</td>
								<td width="50">年龄</td>
								<td width="50">{{detail.age}}</td>
								<td width="50">床号</td>
								<td width="50">{{detail.bedNumber}}</td>
								<td width="50">住院号</td>
								<td width="50">{{detail.hospitalizationNumber}}</td>
							</tr>
							<tr>
								<td height="50">会诊目的</td>
								<td colspan="9" style="text-align: left;">{{detail.consultationPurpose}}</td>
							</tr>
							<tr>
								<td height="120" style="padding:10px 0">患者病情摘要(包括：现病史、既往史、过敏史、个人史、用药史、各种检查及其他情况的摘要)</td>
								<td colspan="9" style="text-align: left;">{{detail.summary}}</td>
							</tr>
							<tr>
								<td height="120">会诊意见（会诊药师的分析、评价以及意见）</td>
								<td colspan="9" style="text-align: left;">{{detail.opinions}}</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th height="20" width="100%" colspan="10" style="text-align: right;padding-right: 100px;">
									<b>会诊药师：</b>{{detail.pharmacistName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<b>职称：</b>
								</th>
							</tr>
							<tr>
								<th height="20" width="100%" colspan="10" style="text-align: right;padding-right: 90px;">
									<b>会诊时间：{{detail.consultationTime}}</b>
								</th>
							</tr>
						</tfoot>
					</table>
				</form>
			</div>
		</el-Dialog>
	</div>
</template>

<script>
import { formateDate } from '@/utils/publicFun'
import printJS from 'print-js'
export default {
	name: 'suggest',
	data () {
		return {
			printVisible: false,
			detail: {},
			content: '',
			name: '',
			dateTime: '',
			rate: 5, //评分
			recordDialog: false,
			drawerVisible: false,
			currentPage: 1,
			pageSize: 10,
			tabelData: [],
			isMore: false,
			endTime: '',
			startTime: '',
			tempObj: {},
			totalPage: 0,
			tableData: []
		}
	},
	created () {
		this.getData()
	},
	methods: {
		getData () {
			this.$message.warning('暂无数据')
		},
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
		getRecordDialog () {
			this.recordDialog = true
		},
		handleClolse () {
			this.recordDialog = false
		},
		showDetail (obj) {
			this.tempObj = obj
			this.drawerVisible = true
		},
		drawerClose () {
			this.drawerVisible = false
		},
		// 打印
		printHandle (obj) {
			this.printVisible = true
			this.detail = obj
			printJS({
				printable: 'printForm',
				type: 'html',
				// 继承原来的所有样式
				targetStyles: ['*']
			})
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
			line-height: 35px;
			font-size: 18px;
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
	.info-dialog {
		display: flex;
		align-content: center;
		justify-content: start;
		flex-wrap: wrap;
		border-bottom: 1px solid #e8eaed;
		padding: 10px 15px;
		padding-top: 0;
		.info-top-item {
			display: flex;
			width: 50%;
			font-size: 14px;
			line-height: 30px;
			height: 40px;
			align-items: center;
			margin-top: 5px;
			span {
				display: inline-block;
				width: 40%;
			}
		}
		.info-item-attr {
			height: 24px;
		}
		.info-item {
			width: 100%;
			padding-top: 15px;
			padding-bottom: 15px;
			span {
				display: inline-block;
				vertical-align: top;
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
		width: 30%;
	}
	.tab-info {
		width: 30%;
	}
	.tab-person {
		width: 20%;
	}
	.tab-status {
		width: 10%;
	}
	.tab-op {
		width: 10%;
	}
	.content {
		box-sizing: border-box;
		padding: 5px 10px;
		position: relative;
		font-size: 16px;
		line-height: 20px;
		text-align: top;
		.cont-btn {
			margin-top: 10px;
			position: absolute;
			right: -5px;
			top: -9px;
			z-index: 100;
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
		text-align: left;
	}
	.operate {
		text-align: left;
		vertical-align: top;
		button {
			font-size: 14px;
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
<style lang='less'>
.el-date-editor {
	vertical-align: middle;
}
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