<template>
  <div id="app">
    <Grapher/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Grapher from './components/grapher/Grapher.vue';

export default Vue.extend({
  name: 'app',
  components: {
    Grapher,
  },
});
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}
</style>
