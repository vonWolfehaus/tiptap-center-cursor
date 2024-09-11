<template>
	<n-config-provider :theme="darkTheme" class="fh fw">
		<Tiptap />
	</n-config-provider>
</template>

<script setup>
import { darkTheme, NButton } from 'naive-ui'
import Tiptap from './Tiptap.vue'
</script>

<style lang="sass">
</style>