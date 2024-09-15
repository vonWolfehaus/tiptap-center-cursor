<template>
	<n-config-provider :theme="darkTheme" class="fh fw">
		<div class="container fh">
			<Tiptap />
		</div>
	</n-config-provider>
</template>

<script setup>
import { darkTheme, NButton } from 'naive-ui'
import Tiptap from './Tiptap.vue'
</script>

<style lang="sass" scoped>
.container
	padding: 10px
	box-sizing: border-box
</style>