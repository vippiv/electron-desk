<template>
	<div class="knowledge-main-container">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="">
				<el-input v-model="formInline.medisineName" size="medium" placeholder="请输入药品名(或拼音简码)" class="orange-border-focus"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="medium" class="orange-btn" @click="handleSearch">查询</el-button>
			</el-form-item>
		</el-form>
		<p class="search-desc">请输入药品名称查询，支持通用名、拼音简码的模糊查询。比如，可以通过输入“阿莫西林或“阿莫”或“amxl”等方式检索到阿莫西林。</p>
	</div>
</template>

<script>
// const remote = window.require('electron').remote
// const ipcRenderer = window.require('electron').ipcRenderer

export default {
	name: 'KnowledgeMain',
	data () {
		return {
			formInline: {
				medisineName: ''
			}
		}
	},
	mounted () {
		
	},
	methods: {
		handleSearch () {}
	}
}
</script>

<style lang="less" scoped>
	.knowledge-main-container {
		text-align: center;
		height: 100%;
		padding-top: 20px;
		.search-desc {
			width: 380px;
			margin: 0 auto;
			font-size: 14px;
			color: #888888;
		}
		/deep/ .el-form-item {
			margin-bottom: 0;
		}
		/deep/ .el-input {
			width: 300px;
		}
		/deep/ .el-input__inner:focus {
			border-color: #FF8901;
		}
	}
</style>