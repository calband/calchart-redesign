<template>
    <section>
  <div class="column is-narrow menu-left">
    <h3>Menu left</h3>
  </div>
      <PerSheetPreview v-for="sheet in numberOfSheets" :key="sheet + '-sheet'" sheet="sheet"/>
<footer class="footer">
        <b-field label="Simple">
            <b-slider v-model="value"></b-slider>
        </b-field>

        <b-field label="Disabled">
            <b-slider :value="30" disabled></b-slider>
        </b-field>
</footer>
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
  }
});
</script>

<style scoped lang="scss">
.menu-left {
  width: 150px;
}
</style>
