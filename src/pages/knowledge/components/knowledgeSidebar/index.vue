<template>
	<div class="knowledge-sidebar-container">
		<ul class="menu">
            <li :class="activeName === 'medisineInstruction' ? 'active' : ''" @click="handleSwitchNav('medisineInstruction')">药品说明书</li>
            <li :class="activeName === 'clinicalGuide' ? 'active' : ''" @click="handleSwitchNav('clinicalGuide')">临床指南</li>
            <li :class="activeName === 'medisineUseingEdu' ? 'active' : ''" @click="handleSwitchNav('medisineUseingEdu')">用药教育</li>
            <li :class="activeName === 'medisineInterreation' ? 'active' : ''" @click="handleSwitchNav('medisineInterreation')">相互作用</li>
            <li :class="activeName === '' ? 'active' : ''" @click="handleSwitchNav('')">配伍禁忌</li>
            <li :class="activeName === '' ? 'active' : ''" @click="handleSwitchNav('')">药学公式</li>
            <li :class="activeName === '' ? 'active' : ''" @click="handleSwitchNav('')">检验值</li>
            <li :class="activeName === '' ? 'active' : ''" @click="handleSwitchNav('')">FDA妊娠药品分级</li>
        </ul>
	</div>
</template>

<script>
// const remote = window.require('electron').remote
// const ipcRenderer = window.require('electron').ipcRenderer

export default {
    name: 'KnowledgeSidebar',
    props: ['actionSwitchNav'],
	data () {
		return {
            activeName: ''
		}
	},
	mounted () {
		
	},
	methods: {
		handleSwitchNav (nav) {
            this.activeName = nav
            this.actionSwitchNav(nav)
        }
	}
}
</script>

<style lang="less" scoped>
    .knowledge-sidebar-container {
        height: 100%;
        ul {
            height: 100%;
            border-right: 1px solid #e8eaed;
            & > li {
                font-size: 16px;
                color: #333;
                line-height: 2.5;
                padding-left: 15px;
                border-bottom: 1px solid #e8eaed;
            }
            .active {
                background-color: #F1F1F2;
            }
        }
    }
</style>