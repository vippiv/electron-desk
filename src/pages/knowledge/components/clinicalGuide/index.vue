<template>
	<div class="clinical-guide-contianer">
		<clinicalDataTree />
		<clinicalMain />
	</div>
</template>

<script>
import clinicalDataTree from './dataTree'
import clinicalMain from './clinicalMain'

export default {
	name: 'MedisineInstruction',
	components: {
		clinicalDataTree,
		clinicalMain
	}
}
</script>

<style scoped>
	.clinical-guide-contianer {
		display: flex;
			height: 100%;
	}
</style>