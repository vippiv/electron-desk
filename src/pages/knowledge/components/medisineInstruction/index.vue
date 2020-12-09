<template>
	<div class="medisine-instruction-container">
		<medisineTree />
		<medisineMain />
	</div>
</template>

<script>
import medisineTree from './dataTree'
import medisineMain from './medisineMain'

export default {
	name: 'MedisineInstruction',
	components: {
		medisineTree,
		medisineMain
	}
}
</script>

<style scoped>
	.medisine-instruction-container {
		display: flex;
		height: 100%;
	}
</style>