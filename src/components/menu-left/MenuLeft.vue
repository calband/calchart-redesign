<template>
  <div class="column is-narrow menu-left">
    <h3>Menu left</h3>
    <section>
      <PerSheetPreview
        v-for="sheet in numberOfSheets"
        :key="sheet + '-sheet'"
        sheet="sheet"
      />
    </section>
    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        data-test="file-modal--import"
        @click="previousSheet"
      >
        Prev
      </b-button>
      <span>
        {{ currentSheet }}
      </span>
      <b-button
        type="is-primary"
        data-test="file-modal--close"
        @click="nextSheet"
      >
        Next
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PerSheetPreview from '../grapher/PerSheetPreview.vue';

export default Vue.extend({
  name: 'MenuLeft',
  components: {
    PerSheetPreview,
  },
  computed: {
    numberOfSheets(): number {
      return this.$store.getters.getNumberOfSheets;
    },
    currentSheet(): number {
      return this.$store.getters.getCurrentSheet+1;
    },
  },
  methods: {
    previousSheet() {
      const sheet = this.$store.getters.getCurrentSheet;
      if (sheet === 0) {
        return;
      }
      this.$store.commit('setCurrentSheet', sheet - 1);
    },
    nextSheet() {
      const sheet = this.$store.getters.getCurrentSheet;
      if (sheet >= this.$store.getters.getNumberOfSheets-1) {
        return;
      }
      this.$store.commit('setCurrentSheet', sheet + 1);
    },
  },
});
</script>

<style scoped lang="scss">
.menu-left {
  width: 150px;
}
</style>
