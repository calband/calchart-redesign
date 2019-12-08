<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="brand">
        <b-navbar-item>
          <img
            src="/images/highstepper-gold.png"
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
  data: () => ({
    fileModalActive: false,
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
