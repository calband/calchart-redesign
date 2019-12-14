<template>
  <section>
    <PerSheetPreview v-for="sheet in numberOfSheets" :key="sheet + '-sheet'" sheet="sheet"/>
    <b-button @click="addSheet">Add Sheet</b-button>
  </section>
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
  },
  methods: {
    addSheet() {
      console.log('Button clicked')
      this.$store.commit('setAddSheetAsCopyOf', 0);
    },
  }
});
</script>

<style scoped lang="scss">
.menu-left {
  width: 150px;
}
</style>
