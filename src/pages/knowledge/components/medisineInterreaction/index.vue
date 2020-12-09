<template>
	<div class="medisine-interreation-container">
		<interreationTree />
		<interreationMain />
	</div>
</template>

<script>
import interreationTree from './dataTree'
import interreationMain from './interreationMain'

export default {
	name: 'MedisineInterration',
	components: {
		interreationTree,
		interreationMain
	}
}
</script>

<style scoped>
	.medisine-interreation-container {
		display: flex;
		height: 100%;
	}
</style>