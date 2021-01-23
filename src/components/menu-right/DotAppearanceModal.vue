<template>
  <div class="modal-card" data-test="dot-appearance-modal">
    <header class="modal-card-head">
      <p class="modal-card-title">Dot type {{ dotTypeIndex }} Appearance</p>
    </header>

    <section class="modal-card-body">
      <svg viewBox="-1 -1 2 2" class="column">
        <Dot
          :key="`menu-right-dot-${dotTypeIndex}-preview`"
          :dotTypeIndex="dotTypeIndex"
          :labeled="false"
        />
      </svg>
      <div class="column">
        <b-field>
          <b-checkbox v-model="dotAppearance.filled">Filled</b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox v-model="dotAppearance.fwSlash"
            >Forward-slashed</b-checkbox
          >
        </b-field>
        <b-field>
          <b-checkbox v-model="dotAppearance.bwSlash"
            >Backward-slashed</b-checkbox
          >
        </b-field>
        <b-field label="Fill Color">
          <b-input v-model="dotAppearance.fill"></b-input>
        </b-field>
        <b-field label="Line Color">
          <b-input v-model="dotAppearance.color"></b-input>
        </b-field>
      </div>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-primary"
        data-test="dot-appearance-modal--close"
        @click="$parent.close()"
      >
        Close
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Dot from "@/components/grapher/Dot.vue";
import DotAppearance from "@/models/DotAppearance";

/**
 * Change a dot type's appearance
 */
export default Vue.extend({
  name: "DotAppearanceModal",
  components: {
    Dot,
  },
  props: {
    dotTypeIndex: Number,
  },
  computed: {
    dotAppearance(): DotAppearance {
      return this.$store.getters.getSelectedStuntSheet.dotAppearances[
        this.dotTypeIndex
      ];
    },
  },
});
</script>

<style scoped lang="scss">
.column {
  float: left;
  width: 50%;
}
</style>
