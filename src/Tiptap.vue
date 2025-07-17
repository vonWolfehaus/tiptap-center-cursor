<template>
	<div class="center tiptap fh">
		<BubbleMenu
		v-if="editor"
		:editor="editor"
		:tippy-options="{ duration: 100 }"
		>
		<button
			@click="editor.chain().focus().setTextAlign('left').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
		>
			left
		</button>
		<button
			@click="editor.chain().focus().setTextAlign('center').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
		>
			center
		</button>
		<button
			@click="editor.chain().focus().setTextAlign('right').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
		>
			right
		</button>
		<button
			@click="editor.chain().focus().setTextAlign('justify').run()"
			:class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
		>
			justify
		</button>

		<br />

		<button
			@click="editor.chain().focus().toggleBold().run()"
			:class="{ 'is-active': editor.isActive('bold') }"
		>
			<strong>B</strong>
		</button>
		<button
			@click="editor.chain().focus().toggleItalic().run()"
			:class="{ 'is-active': editor.isActive('italic') }"
		>
			<i>i</i>
		</button>
		<button
			@click="editor.chain().focus().toggleStrike().run()"
			:class="{ 'is-active': editor.isActive('strike') }"
		>
			<s>S</s>
		</button>
		<button
			@click="editor.chain().focus().toggleUnderline().run()"
			:class="{ 'is-active': editor.isActive('underline') }"
		>
			<u>u</u>
		</button>
		<button
			@click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
			:class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
		>
			H2
		</button>
		<button
			@click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
			:class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
		>
			H3
		</button>

		<br />

		<button
			@click="editor.chain().focus().toggleBulletList().run()"
			:class="{ 'is-active': editor.isActive('bulletList') }"
		>
			bullet
		</button>
		<button
			@click="editor.chain().focus().toggleOrderedList().run()"
			:class="{ 'is-active': editor.isActive('orderedList') }"
		>
			ordered
		</button>
		</BubbleMenu>

		<div class="content-container fh">
			<scroller ref="scroller" padding="0" class="fh fw" style="padding: 0px 32px">
				<EditorContent :editor="editor" class="editor fh" />
			</scroller>
		</div>

		<div>
			Selected word count: {{ wordCount }}
		</div>
	</div>
</template>

<script setup>
import exampleContent from './assets/example-content-original.json';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3';
import { ref, onMounted, onBeforeUnmount } from "vue";
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import Scroller from './Scroller.vue'
import GetSelectedText from './getSelectedText'
import SearchAndReplace from './searchAndReplace'

let startContent = JSON.parse(JSON.stringify(exampleContent))

const wordCount = ref(0)

const editor = new Editor({
	content: startContent,
	editable: true,
	injectCSS: false,
	extensions: [
		Underline,
		CharacterCount,
		GetSelectedText,
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		SearchAndReplace.configure({
			disableRegex: true
		}),
		Typography.configure({}),
		TextAlign.configure({
			types: ['heading', 'paragraph', 'blockquote'],
		}),
		Table.configure({
			resizable: true,
		}),
		TableRow,
		TableHeader,
		TableCell,
		Image.configure({
			allowBase64: true,
		}),
	],
	onSelectionUpdate: onSelection,
})

function onSelection({ transaction }) {
	const selection = transaction.curSelection
	const range = selection.ranges[0]
	const txt = editor.commands.getSelectedText()
	if (txt && txt != '') wordCount.value = txt.split(' ').filter((n) => n != '').length
	else wordCount.value = 0
}

function getJSON() {
	console.log(JSON.stringify(editor.getJSON()));
}

const scroller = ref(null)
let holdingArrowKey = false
let intervalId = null

onMounted(() => {
	editor.on('update', ({ transaction }) => {
		if (!holdingArrowKey && transaction.docChanged) {
      		centerCursor(true)
    	}
  	})
  	document.addEventListener('keydown', handleKeyDown)
  	document.addEventListener('keyup', handleKeyUp)
  	function handleKeyDown(event) {
    	if (
      		['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    	) {
      		if (!holdingArrowKey) {
        		holdingArrowKey = true
        		intervalId = setInterval(() => {
        			centerCursor(false)
        		}, 50)
      		}
    	}
  	}
  	function handleKeyUp(event) {
    	if (
      		['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    	) {
      	holdingArrowKey = false
      	if (intervalId) {
        	clearInterval(intervalId)
        	intervalId = null
      	}
    }
  }
  function centerCursor(smooth = false) {
    	const editorElement = document.querySelector('.ProseMirror')
    	if (!editorElement) {
      		console.log('Editor element not found. Skipping center cursor.')
      		return
    	}
    	const cursorPos = editor.view.state.selection.$anchor.pos
    	const cursorCoords = editor.view.coordsAtPos(cursorPos)
    	const scrollerElement = scroller.value?.$el
    	if (!scrollerElement) {
      		console.log('Scroller element not found.')
      		return
    	}
    	const scrollerRect = scrollerElement.getBoundingClientRect()
    	const scrollOffset =
      	cursorCoords.top - scrollerRect.top - scrollerRect.height / 2
    	if (Math.abs(scrollOffset) > 10) {
      		scrollerElement.scrollBy({
        		top: scrollOffset,
        		behavior: smooth ? 'smooth' : 'auto',
      		})
    	}
  	}
  	onBeforeUnmount(() => {
    	document.removeEventListener('keydown', handleKeyDown)
    	document.removeEventListener('keyup', handleKeyUp)
    	if (intervalId) {
      		clearInterval(intervalId)
    	}
  })
  centerCursor()
})

</script>

<style lang="scss">
.word-count {
	margin: 10px 0;
}

.tableWrapper {
	padding: 1rem 0;
	overflow-x: auto;
}

.resize-cursor {
	cursor: ew-resize;
	cursor: col-resize;
}

.editor-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px;
	box-sizing: border-box;
}

.editor,
.tiptap {
	position: relative;
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 100%;
	margin: 0 auto;
}

.tiptap {
	box-sizing: border-box;
	border-radius: 4px;
	padding: 4px;
}

.ProseMirror {
	flex: 1;
	min-height: 100px;
	line-height: 1.4;
	padding: 18px 0;
}

.ProseMirror p {
	text-align: left;
	font-size: 1rem;
	line-height: 1.2;
	margin-block-start: 0;
	margin-block-end: 0;
}

button.is-active {
	background-color: rgb(51, 52, 53) !important;
}

.dl-btn {
	margin-top: 10px;
}

.content-container {
	position: relative;
	width: 50%;
	border: 2px solid gray;
	border-radius: 8px;
	transition: border-color 250ms;
}

.tiptap {
	table {
		border-collapse: collapse;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		overflow: hidden;

		td,
		th {
			min-width: 1em;
			border: 2px solid #ced4da;
			padding: 3px 5px;
			vertical-align: top;
			box-sizing: border-box;
			position: relative;

			> * {
				margin-bottom: 0;
			}
		}

		th {
			font-weight: bold;
			text-align: left;
			background-color: #f1f3f5;
		}

		.selectedCell:after {
			z-index: 2;
			position: absolute;
			content: '';
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background: rgba(200, 200, 255, 0.4);
			pointer-events: none;
		}

		.column-resize-handle {
			position: absolute;
			right: -2px;
			top: 0;
			bottom: -2px;
			width: 4px;
			background-color: #adf;
			pointer-events: none;
		}

		p {
			margin: 0;
		}
	}
}

.tableWrapper {
	padding: 1rem 0;
	overflow-x: auto;
}

.resize-cursor {
	cursor: ew-resize;
	cursor: col-resize;
}
</style>

<style lang="sass" scoped>
.center
	display: flex
	align-items: center
</style>