<template>
  <div id="app" data-test="app">
    <MenuTop />
    <MenuLeft />
    <Grapher />
    <MenuBottomTools />
    <MenuBottomUndo />
    <MenuRight />
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

export default Vue.extend({
  name: "App",
  components: {
    MenuTop,
    MenuLeft,
    Grapher,
    MenuRight,
    MenuBottomTools,
    MenuBottomUndo,
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
  overflow: hidden;
  display: grid;
  grid-template-columns: 200px auto auto 250px;
  grid-template-rows: $navbar-height auto 36px; // See Bulma for navbar-height
  grid-template-areas:
    "menu-top menu-top menu-top menu-top"
    "menu-left grapher grapher menu-right"
    "menu-left menu-bottom-tools menu-bottom-undo menu-right";
}
</style>
