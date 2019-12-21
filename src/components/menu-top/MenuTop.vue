<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="brand">
        <b-navbar-item>
          <img
            src="@/assets/highstepper-gold.png"
            alt="Calchart"
          >
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-dropdown
          label="File"
          data-test="menu-top--file"
        >
          <b-navbar-item data-test="menu-top--selected-show">
            Selected: {{ showTitle }}
          </b-navbar-item>

          <hr class="navbar-divider">

          <b-navbar-item
            data-test="menu-top--file-edit"
            @click="fileModalActive = true"
          >
            Edit Show Details
          </b-navbar-item>

          <b-navbar-item
            data-test="menu-top--import-calchart3"
            @click="importCalChart3Active = true">
            Import show...
          </b-navbar-item>

        </b-navbar-dropdown>

        <b-navbar-dropdown
          label="View"
          data-test="menu-top--view"
        >
          <b-navbar-item>
            <b-checkbox
              v-model="fourStepGrid"
              data-test="menu-top--view-grid"
            >
              Four step grid
            </b-checkbox>
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </b-navbar>

    <b-modal
      :active.sync="fileModalActive"
      has-modal-card
      trap-focus
      data-test="menu-top--file-modal"
    >
      <FileModal />
    </b-modal>
    <b-modal
      :active.sync="importCalChart3Active"
      has-modal-card
      trap-focus
      data-test="menu-top--file-modal"
    >
      <ImportCalChart3 />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FileModal from './FileModal.vue';
import ImportCalChart3 from './ImportCalChart3.vue';

export default Vue.extend({
  name: 'MenuTop',
  components: {
    FileModal,
    ImportCalChart3,
  },
  data: () => ({
    fileModalActive: false,
    importCalChart3Active: false,
  }),
  computed: {
    showTitle(): string {
      return this.$store.getters.getShowTitle;
    },

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
.menu-top {
  flex: 0 0;
}
</style>
