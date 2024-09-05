<template>
	<n-config-provider :theme="darkTheme">
		<div class="">
			<Tiptap v-for="i in arr" :key="i" class="tt" />

			<n-button @click="addEditor" secondary style="margin-top: 10px">
				Add Editor
			</n-button>
		</div>
	</n-config-provider>
</template>

<script setup>
import { darkTheme, NButton } from 'naive-ui';
import Tiptap from './Tiptap.vue';
import { ref } from 'vue';

const arr = ref([true])

function addEditor() {
	arr.value.push(true)
}
</script>

<style lang="sass">
.tt
	height: 300px
	margin: 10px 0
</style>