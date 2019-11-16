<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Show Settings
      </p>
    </header>

    <section class="modal-card-body">
      <b-field label="Show title">
        <b-input
          v-model="showTitle"
          data-test="file-modal--show-title"
        />
      </b-field>

      <p class="title">
        Field
      </p>

      <b-field label="Front hash Y offset">
        <b-numberinput
          v-model="frontHashOffsetY"
          min="0"
          max="256"
          data-test="file-modal--front-hash-offset-y"
        />
      </b-field>

      <b-field label="Back hash Y offset">
        <b-numberinput
          v-model="backHashOffsetY"
          min="0"
          max="256"
          data-test="file-modal--back-hash-offset-y"
        />
      </b-field>

      <b-field label="Middle of field">
        <b-numberinput
          v-model="middleOfField"
          min="0"
          max="200"
          data-test="file-modal--middle-of-field"
        />
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        data-test="file-modal--close"
        @click="$parent.close()"
      >
        Close
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FileModal',
  computed: {
    showTitle: {
      get(): string {
        return this.$store.getters.getShowTitle;
      },
      set(title: string) {
        this.$store.commit('setShowTitle', title);
      },
    },

    frontHashOffsetY: {
      get(): number {
        return this.$store.getters.getFrontHashOffsetY;
      },
      set(offsetY: number) {
        this.$store.commit('setFrontHashOffsetY', offsetY);
      },
    },

    backHashOffsetY: {
      get(): number {
        return this.$store.getters.getBackHashOffsetY;
      },
      set(offsetY: number) {
        this.$store.commit('setBackHashOffsetY', offsetY);
      },
    },

    middleOfField: {
      get(): number {
        return this.$store.getters.getMiddleOfField;
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
