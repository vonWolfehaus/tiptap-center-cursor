import { Extension } from '@tiptap/core'
import { Editor } from '@tiptap/vue-3'

declare module '@tiptap/core' {
	interface Commands {
		getSelectedText: {
			getSelectedText: () => ({ editor } : {editor: Editor}) => string,
		}
	}
}

const getSelectedText = Extension.create({
	name: 'myGetSelectedText',
	addCommands() {
		return {
			getSelectedText: () => ({ editor }:{editor: Editor}):string => {
				const { from, to, empty } = editor.state.selection
				if (empty) return ''
				return editor.state.doc.textBetween(from, to, ' ')
			},
		}
	},
})

export default getSelectedText