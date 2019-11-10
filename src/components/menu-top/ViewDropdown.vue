<template>
<b-navbar-dropdown label="View">
  <b-navbar-item>
    <b-checkbox v-model="fourStepGrid">
      Four step grid
    </b-checkbox>
  </b-navbar-item>
</b-navbar-dropdown>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ViewDropdown',
  computed: {
    fourStepGrid: {
      get(): boolean {
        return this.$store.state.fourStepGrid;
      },
      set(enabled: boolean): void {
        this.$store.commit('setFourStepGrid', enabled);
      },
    },
  },
});
</script>

<style scoped lang="scss">

</style>
