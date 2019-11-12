<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="start">

        <b-navbar-dropdown label="File" data-test="menu-top--file">
          <b-navbar-item v-on:click="enableFileModal" data-test="menu-top--file-edit">
            Edit Show Details
          </b-navbar-item>
        </b-navbar-dropdown>

        <b-navbar-dropdown label="View" data-test="menu-top--view">
          <b-navbar-item>
            <b-checkbox v-model="fourStepGrid" data-test="menu-top--view-grid">
              Four step grid
            </b-checkbox>
          </b-navbar-item>
        </b-navbar-dropdown>

      </template>
    </b-navbar>

    <FileModal/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileModal from './FileModal.vue';

export default Vue.extend({
  name: 'MenuTop',
  components: {
    FileModal,
  },
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
  methods: {
    enableFileModal(): void {
      this.$store.commit('setFileModal', true);
    },
  },
});
</script>

<style scoped lang="scss">
.menu-top {
  flex: 0 0;
}
</style>
