<template>
  <div class="menu-right">
    <b-tabs position="is-centered">
      <b-tab-item label="Dot Types" value="dotType">
        <DotTypeTab />
      </b-tab-item>
      <b-tab-item label="Dots" value="dot">
        <DotTab />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import DotTypeTab from "./DotTypeTab.vue";
import DotTab from "./DotTab.vue";
import Vue from "vue";

export default Vue.extend({
  name: "MenuRight",
  components: {
    DotTypeTab,
    DotTab,
  },
});
</script>

<style scoped lang="scss">
.menu-right {
  grid-area: menu-right;
}
</style>

<style lang="scss">
// Not scoped since we are modifying buefy styling
.menu-right .b-tabs .tab-content {
  padding: 4px;
}
</style>
