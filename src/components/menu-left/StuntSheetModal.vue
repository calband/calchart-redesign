<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Edit Stuntsheet
      </p>
    </header>

    <section class="modal-card-body">
      <b-field label="Stuntsheet Title">
        <b-input
          v-model="title"
          data-test="ss-modal--title"
        />
      </b-field>

      <b-field label="Beats">
        <b-numberinput
          v-model="beats"
          min="0"
          max="256"
          data-test="ss-modal--beats"
        />
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        data-test="ss-modal--close"
        @click="$parent.close()"
      >
        Close
      </b-button>
      <b-button
        v-if="canDeleteSS"
        type="is-danger"
        data-test="ss-modal--delete"
        @click="deleteSS"
      >
        Delete
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

/**
 * Show and modify values in the current Show model
 */
export default Vue.extend({
  name: 'StuntSheetModal',
  computed: {
    title: {
      get(): string {
        const stuntSheet = this.$store.getters.getSelectedStuntSheet;
        return stuntSheet.title;
      },
      set(title: string): void {
        this.$store.commit('setStuntSheetTitle', title);
      },
    },

    beats: {
      get(): number {
        const stuntSheet = this.$store.getters.getSelectedStuntSheet;
        return stuntSheet.beats;
      },
      set(beats: number): void {
        this.$store.commit('setStuntSheetBeats', beats);
      },
    },

    canDeleteSS(): boolean {
      return this.$store.state.show.stuntSheets.length > 1;
    },
  },
  methods: {
    deleteSS(): void {
      this.$store.commit('deleteStuntSheet');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$parent as any).close();
    },
  },
});
</script>

<style scoped lang="scss">

</style>
