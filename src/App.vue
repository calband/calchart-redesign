<template>
  <div
    id="app"
    data-test="app"
  >
    <MenuTop />
    <MenuLeft />
    <Grapher />
    <MenuBottom />
    <MenuRight />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MenuTop from './components/menu-top/MenuTop.vue';
import MenuLeft from './components/menu-left/MenuLeft.vue';
import Grapher from './components/grapher/Grapher.vue';
import MenuRight from './components/menu-right/MenuRight.vue';
import MenuBottom from './components/menu-bottom/MenuBottom.vue';

export default Vue.extend({
  name: 'App',
  components: {
    MenuTop,
    MenuLeft,
    Grapher,
    MenuRight,
    MenuBottom,
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

html, body, #app {
  height: 100%;
}

#app {
  overflow: hidden;
  display: grid;
  grid-template-columns: 200px auto 200px;
  grid-template-rows: $navbar-height auto 36px; // See Bulma for navbar-height
  grid-template-areas:
   "menu-top menu-top menu-top"
   "menu-left grapher menu-right"
   "menu-left menu-bottom menu-right";
}
</style>
