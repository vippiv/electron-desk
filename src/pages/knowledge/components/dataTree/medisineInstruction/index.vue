<template>
	<div class="knowledge-datatree-container">
		<div class="tree">
			<el-tree :data="data" icon-class="icon-tree" :default-expand-all="true" @node-click="handleNodeClick"></el-tree>
		</div>
	</div>
</template>

<script>
// const remote = window.require('electron').remote
// const ipcRenderer = window.require('electron').ipcRenderer

export default {
	name: 'KnowledgeDataTree',
	data () {
		return {
			data: [{
				label: '全部分类',
				children: [{
					label: '未分类'
				}, {
					label: '主要作用于心血管的',
					children: [{
						label: '三级 1-1-1'
					}]
				}, {
					label: '抗变态反应的药物',
					children: [{
						label: '三级 1-1-1'
					}]
				}]
			}],
		}
	},
	mounted () {
		
	},
	methods: {
		handleNodeClick () {}
	}
}
</script>

<style lang="less" scoped>
	.knowledge-datatree-container {
		width: 100%;
		height: 100%;
		.tree {
			border-right: 1px solid #e8eaed;
			height: 100%;
		}
		/deep/ .el-tree-node__label {
			font-size: 16px;
		}
		/deep/ .icon-tree {
			border:1px solid red;
			margin: 0  5px 0 10px;
			position: relative;
		}
	}
</style>