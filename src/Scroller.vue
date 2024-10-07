<template>
  <div ref="elScroller" class="scroller">
    <div class="scroll-content-wrapper">
      <div class="scroll-content" :class="contentStyle">
        <slot/>
      </div>
      <div class="permanent-padding"></div>
    </div>
  </div>
</template>

<script>
export default {
	props: {
		contentStyle: {
			type:Object,
			default() {
				return {}
			},
		},
		width: {
			type:String,
			default: '8',
		},
		padding:String,
		disabled: {
			type:Boolean,
			default: false
		},
	},

	data() {
		return {
			pad: '10px',
			sw: '8px',
			position: 'absolute'
		}
	},

	methods: {
		getPosition() {
			return this.$refs.elScroller.scrollTop
		},
		getHeight() {
			return this.$refs.elScroller.offsetHeight
		},
		scroll(to = 0) { // number|HTMLElement
			if (!to) return
			let top = to
			if (typeof to !== 'number') {
				let rect = null
				if (to.getBoundingClientRect) rect = to.getBoundingClientRect()
				else rect = to.$el.getBoundingClientRect()
				top = rect.top - 300
			}
			const opts = {
				top,
				behavior: 'smooth'
			}
			this.$refs.elScroller.scrollTo(opts)
		},
		scrollBy(top = 0) { // number
			const opts = {
				top,
				behavior: 'smooth'
			}
			this.$refs.elScroller.scrollBy(opts)
		},
		scrollToTop() {
			const opts = {
				top: 0,
				behavior: 'instant'
			}
			this.$refs.elScroller.scrollTo(opts)
		},
		scrollToBottom() {
			const opts = {
				top: this.$refs.elScroller.scrollHeight,
				behavior: 'instant'
			}
			this.$refs.elScroller.scrollBy(opts)
		},
	},

	created() {
		if (this.padding == 0 || this.padding) this.pad = this.padding + 'px'
		if (this.width) this.sw = this.width + 'px'
		this.position = this.disabled ? 'static' : 'absolute'
	}
}
</script>

<style lang="sass" scoped>
.scroller
	// --resize-buffer-width: 6px // this might be a problem later, but it's fine for now
	box-sizing: border-box
	position: v-bind('position')
	top: 0
	left: 0
	width: 100%
	height: 100%
	overflow-y: scroll
	overflow-x: hidden
	padding: v-bind(pad)
	transition: all 400ms ease

	&::-webkit-scrollbar
		width: v-bind(sw)

	&::-webkit-scrollbar-thumb
		border-radius: calc(v-bind(sw) * 0.5)
		background-color: rgba(255, 255, 255, 0.2)

		&:hover
			background-color: rgba(255, 255, 255, 0.3)

.scroll-content
	width: calc(100% + v-bind(sw))
</style>

<style>
.permanent-padding {
  height: 256px; /* Can be adjustable */
  width: 100%;
  background: transparent;
}
</style>