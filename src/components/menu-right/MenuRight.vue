<template>
  <div class="menu-right">
    <h3>Menu right</h3>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MenuRight",
});
</script>

<style scoped lang="scss">
.menu-right {
  grid-area: menu-right;
}
</style>
