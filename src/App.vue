<template>
  <div id="app" data-test="app">
    <MenuTop />
    <MenuLeft />
    <Grapher />
    <MenuBottomTools />
    <MenuBottomUndo />
    <MenuRight />
    <Issues />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MenuTop from "./components/menu-top/MenuTop.vue";
import MenuLeft from "./components/menu-left/MenuLeft.vue";
import Grapher from "./components/grapher/Grapher.vue";
import MenuRight from "./components/menu-right/MenuRight.vue";
import MenuBottomTools from "./components/menu-bottom/MenuBottomTools.vue";
import MenuBottomUndo from "./components/menu-bottom/MenuBottomUndo.vue";
import Issues from "./components/Issues.vue";
import { HotKeyHandler } from "./store/hotkeys";

export default Vue.extend({
  name: "App",
  components: {
    MenuTop,
    MenuLeft,
    Grapher,
    MenuRight,
    MenuBottomTools,
    MenuBottomUndo,
    Issues,
  },
  created() {
    window.addEventListener("keydown", this.hotkey);
  },
  // make sure you remove the listener when the component is no longer visible
  destroyed() {
    window.removeEventListener("keydown", this.hotkey);
  },
  methods: {
    hotkey(event: KeyboardEvent) {
      HotKeyHandler(this.$store, event);
    },
  },
});
</script>

<style lang="scss">
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
$mdi-font-path: "~@mdi/font/fonts";
@import "~@mdi/font/scss/materialdesignicons";

html {
  overflow-y: hidden;
}

html,
body,
#app {
  height: 100%;
}

#app {
  display: grid;
  grid-template-columns: 200px auto 275px;
  grid-template-rows: $navbar-height auto 40px 40px 120px; // See Bulma for navbar-height
  grid-template-areas:
    "menu-top menu-top menu-top"
    "menu-left grapher menu-right"
    "menu-left menu-bottom-tools menu-right"
    "menu-left menu-bottom-undo menu-right"
    "menu-left issues menu-right";
}
</style>
