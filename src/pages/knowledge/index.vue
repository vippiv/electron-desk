<template>
<div class="knowledge-container">
	<div class="sidebar">
		<knowledgeSidebar :actionSwitchNav="handlSwitchNav" />
	</div>
	<div class="main">
		<component :is="knowledgeType" />
	</div>
</div>
</template>

<script>
// import { formateDate } from '@/utils/publicFun'
// import { getList } from '@/utils/apis/record'
// import printJS from 'print-js'
import knowledgeSidebar from './components/knowledgeSidebar'
import medisineInstruction from './components/medisineInstruction'
import clinicalGuide from './components/clinicalGuide'
import medisineUseingEdu from './components/medisineUseingEdu'
import medisineInterreation from './components/medisineInterreaction'

export default {
	name: 'Knowledge',
	data () {
		return {
			knowledgeType: 'medisineInstruction'
		}
	},
	components: {
		knowledgeSidebar,
		medisineInstruction,
		clinicalGuide,
		medisineUseingEdu,
		medisineInterreation
	},
	created () {
	},
	methods: {
		handlSwitchNav (nav) {
			if (!nav) return
			this.knowledgeType = nav	
		}
	}
}
</script>

<style lang="less" scoped >
	.knowledge-container {
		width: 100%;
		height: 100%;
		display: flex;
		.sidebar {
			width: 160px;
			height: 100%;
		}
		.main {
			width: calc(100% - 160px);
			height: 100%;
		}
	}
</style>