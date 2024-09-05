<template>
	<div class="editor-container">
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

		<EditorContent :editor="editor" class="editor" />

		<div class="word-count">
			{{ editor.storage.characterCount.words() }}
		</div>
	</div>
</template>

<script setup>
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import exampleContent from './assets/example-content.json';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';

let startContent = JSON.parse(JSON.stringify(exampleContent))

const editor = new Editor({
	// content: startContent,
	editable: true,
	injectCSS: false,
	extensions: [
		Underline,
		CharacterCount,
		StarterKit.configure({
			heading: {
				levels: [1, 2, 3],
			},
		}),
		Typography.configure({
			openDoubleQuote: true,
			closeDoubleQuote: true,
			openSingleQuote: true,
			closeSingleQuote: true,
		}),
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
})

function getJSON() {
	console.log(JSON.stringify(editor.getJSON()));
}
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
}

.editor,
.tiptap {
	width: 100%;
	min-width: 300px;
	min-height: 100px;
	overflow: auto;
}

.tiptap {
	box-sizing: border-box;
	border: 2px solid gray;
	border-radius: 4px;
	padding: 4px;
	width: 98%
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