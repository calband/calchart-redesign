<template>
<b-navbar-dropdown label="File">
  <b-navbar-item v-on:click="enableFileModal" data-test="menu-top--edit">
    Edit Show Details
  </b-navbar-item>
</b-navbar-dropdown>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FileDropdown',
  methods: {
    enableFileModal(): void {
      this.$store.commit('setFileModal', true);
    },
  },
});
</script>

<style scoped lang="scss">

</style>
