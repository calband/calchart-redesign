<template>
  <div
    id="app"
    data-test="app"
  >
    <MenuTop />
    <div class="columns is-gapless app--bottom">
      <MenuLeft />
      <div class="column app--middle-col">
        <Grapher />
        <MenuBottom />
      </div>
      <MenuRight />
    </div>
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
  display: flex;
  flex-direction: column;
}

.app--bottom {
  flex: 1 1;
}

.app--middle-col {
  flex: 1 1;
  display: flex;
  flex-direction: column;
}
</style>
