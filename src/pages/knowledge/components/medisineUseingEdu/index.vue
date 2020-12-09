<template>
	<div class="medisine-useing-edu-container">
		<medisineUseingEduTree />
		<useingEduMain />
	</div>
</template>

<script>
import medisineUseingEduTree from './dataTree'
import useingEduMain from './useingEduMain'

export default {
	name: 'MedisineUseingEdu',
	components: {
		medisineUseingEduTree,
		useingEduMain
	}
}
</script>

<style scoped>
	.medisine-useing-edu-container {
		display: flex;
		height: 100%;
	}
</style>