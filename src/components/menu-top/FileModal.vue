<template>
<b-modal
v-bind:active.sync="fileModal"
has-modal-card
trap-focus
data-test="file-modal"
>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Show Settings</p>
    </header>

    <section class="modal-card-body">
      <p class="title">Field</p>

      <b-field label="Front hash Y offset">
        <b-numberinput
        v-model="frontHashOffsetY"
        min="0"
        max="256"
        data-test="file-modal--frontHashOffsetY"
        />
      </b-field>

      <b-field label="Back hash Y offset">
        <b-numberinput
        v-model="backHashOffsetY"
        min="0"
        max="256"
        data-test="file-modal--backHashOffsetY"
        />
      </b-field>

      <b-field label="Middle of field">
        <b-numberinput
        v-model="middleOfField"
        min="0"
        max="200"
        data-test="file-modal--middleOfField"
        />
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
      type="is-primary"
      v-on:click="fileModal = false"
      data-test="file-modal--close"
      >
        Close
      </b-button>
    </footer>
  </div>
</b-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FileModal',
  computed: {
    fileModal: {
      get(): boolean {
        return this.$store.state.fileModal;
      },
      set(enabled: boolean) {
        this.$store.commit('setFileModal', enabled);
      },
    },

    frontHashOffsetY: {
      get(): number {
        return this.$store.state.hashMarkOffsetsY[0];
      },
      set(offsetY: number) {
        this.$store.commit('setFrontHash', offsetY);
      },
    },

    backHashOffsetY: {
      get(): number {
        return this.$store.state.hashMarkOffsetsY[1];
      },
      set(offsetY: number) {
        this.$store.commit('setBackHash', offsetY);
      },
    },

    middleOfField: {
      get(): number {
        return this.$store.state.middleOfField;
      },
      set(middle: number) {
        this.$store.commit('setMiddleOfField', middle);
      },
    },
  },
});
</script>

<style scoped lang="scss">

</style>
