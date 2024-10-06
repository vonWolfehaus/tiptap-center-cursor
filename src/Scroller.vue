<template>
  <div ref="elScroller" class="scroller">
    <div class="scroll-content-wrapper">
      <div class="scroll-content" :class="contentStyle">
        <slot />
      </div>
      <div class="permanent-padding"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contentStyle: {
      type: Object,
      default() {
        return {};
      },
    },
    width: {
      type: String,
      default: "8",
    },
    padding: {
      type: String,
      default: "1000px",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      pad: "10px",
      sw: "8px",
      position: "absolute",
    };
  },

  methods: {
    getPosition() {
      return this.$refs.elScroller;
    },
    getHeight() {
      return this.$refs.elScroller.offsetHeight;
    },
    scroll(to = 0) {
      if (!to) return;
      let top = to;
      if (typeof to !== "number") {
        let rect = null;
        if (to.getBoundingClientRect) rect = to.getBoundingClientRect();
        else rect = to.$el.getBoundingClientRect();
        top = rect.top - 300;
      }
      const opts = {
        top,
        behavior: "smooth",
      };
      this.$refs.elScroller.scrollTo(opts);
    },
    scrollBy(top = 0) {
      const opts = {
        top,
        behavior: "smooth",
      };
      this.$refs.elScroller.scrollBy(opts);
    },
    scrollToTop() {
      const opts = {
        top: 0,
        behavior: "instant",
      };
      this.$refs.elScroller.scrollTo(opts);
    },
    scrollToBottom() {
      const opts = {
        top: this.$refs.elScroller.scrollHeight,
        behavior: "instant",
      };
      this.$refs.elScroller.scrollBy(opts);
    },
  },

  created() {
    if (this.padding === 0 || this.padding) this.pad = this.padding;
    if (this.width) this.sw = this.width + "px";
    this.position = this.disabled ? "static" : "absolute";
  },
};
</script>

<style scoped>
.scroller {
  box-sizing: border-box;
  position: v-bind("position");
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: all 400ms ease;
}

.scroller::-webkit-scrollbar {
  width: v-bind(sw);
}

.scroller::-webkit-scrollbar-thumb {
  border-radius: calc(v-bind(sw) * 0.5);
  background-color: rgba(255, 255, 255, 0.2);
}

.scroller::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.scroll-content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  justify-content: space-between;
}

.scroll-content {
  box-sizing: border-box;
  flex-grow: 1;
}

.permanent-padding {
  height: 256px; /* Can be adjustable */
  width: 100%;
  background: transparent;
}
</style>
