<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="brand">
        <b-navbar-item>
          <img src="@/assets/highstepper-gold.png" alt="Calchart" />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-dropdown label="File" data-test="menu-top--file">
          <b-navbar-item data-test="menu-top--new-show" @click="newShow">
            New Show (ctrl-N)
          </b-navbar-item>

          <hr class="navbar-divider" />

          <b-navbar-item
            data-test="menu-top--save-show"
            :href="fileURL"
            :download="`${showTitle}.shw4`"
          >
            Export Show
          </b-navbar-item>

          <b-navbar-item
            data-test="menu-top--load-show"
            @click="loadModalActive = true"
          >
            Load Show
          </b-navbar-item>

          <b-navbar-item
            data-test="menu-top--file-edit"
            @click="fileModalActive = true"
          >
            Edit Show Details
          </b-navbar-item>
        </b-navbar-dropdown>

        <b-navbar-dropdown label="View" data-test="menu-top--view">
          <b-navbar-item>
            <b-checkbox v-model="fourStepGrid" data-test="menu-top--view-grid">
              Four step grid
            </b-checkbox>
          </b-navbar-item>
          <b-navbar-item>
            <b-checkbox
              v-model="yardlines"
              data-test="menu-top--view-yardlines"
            >
              Yard Lines
            </b-checkbox>
          </b-navbar-item>
          <b-navbar-item>
            <b-checkbox
              v-model="yardlineNumbers"
              data-test="menu-top--view-yardline-numbers"
            >
              Yard Line Numbers
            </b-checkbox>
          </b-navbar-item>
          <b-navbar-item>
            <b-checkbox
              v-model="showDotLabels"
              data-test="menu-top--view-show-dot-labels"
            >
              Show Dot Labels
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
      :active.sync="loadModalActive"
      has-modal-card
      trap-focus
      data-test="menu-top--load-modal"
    >
      <LoadModal />
    </b-modal>
  </div>
</template>

<script lang="ts">
import InitialShowState from "@/models/InitialShowState";
import { Mutations } from "@/store/mutations";
import Vue from "vue";
import FileModal from "./FileModal.vue";
import LoadModal from "./LoadModal.vue";

/**
 * Contains menus and options that control the application's state
 */
export default Vue.extend({
  name: "MenuTop",
  components: {
    FileModal,
    LoadModal,
  },
  data: () => ({
    fileModalActive: false,
    loadModalActive: false,
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
        this.$store.commit(Mutations.SET_FOUR_STEP_GRID, enabled);
      },
    },

    yardlines: {
      get(): boolean {
        return this.$store.state.yardlines;
      },
      set(enabled: boolean): void {
        this.$store.commit(Mutations.SET_YARDLINES, enabled);
      },
    },

    yardlineNumbers: {
      get(): boolean {
        return this.$store.state.yardlineNumbers;
      },
      set(enabled: boolean): void {
        this.$store.commit(Mutations.SET_YARDLINE_NUMBERS, enabled);
      },
    },

    showDotLabels: {
      get(): boolean {
        return this.$store.state.showDotLabels;
      },
      set(enabled: boolean): void {
        this.$store.commit(Mutations.SET_SHOW_DOT_LABELS, enabled);
      },
    },

    fileURL(): string {
      const jsonData = JSON.stringify(this.$store.state.show);
      const blob = new Blob([jsonData], { type: "text/plain;charset=utf-8;" });
      return URL.createObjectURL(blob);
    },
  },
  methods: {
    newShow(): void {
      this.$store.commit(Mutations.SET_SHOW, new InitialShowState());
    },
  },
});
</script>

<style scoped lang="scss">
.menu-top {
  grid-area: menu-top;
}
</style>
