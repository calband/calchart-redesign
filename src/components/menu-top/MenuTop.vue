<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="start">
        <FileDropdown/>
        <ViewDropdown/>
      </template>
    </b-navbar>

    <FileModal/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileDropdown from './FileDropdown.vue';
import FileModal from './FileModal.vue';
import ViewDropdown from './ViewDropdown.vue';

export default Vue.extend({
  name: 'MenuTop',
  components: {
    FileDropdown,
    FileModal,
    ViewDropdown,
  },
});
</script>

<style scoped lang="scss">
.menu-top {
  flex: 0 0;
}
</style>
