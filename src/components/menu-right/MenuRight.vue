<template>
  <div class="menu-right">
    <SetNextPoint />
    <p class="label">Dot Type Editor</p>
    <DotTypeEditor
      v-for="(dotType, index) in dotTypes"
      :key="`dotType--${index}`"
      :dotTypeIndex="index"
    />
    <b-button
      type="is-text"
      size="is-small"
      expanded
      @click="addDotType"
      data-se="menu-right--add-dot-type"
    >
      Add Dot Type
    </b-button>
  </div>
</template>

<script lang="ts">
import DotTypeEditor from "./DotTypeEditor.vue";
import SetNextPoint from "./SetNextPoint.vue";
import BaseCont from "@/models/continuity/BaseCont";
import Vue from "vue";
import StuntSheet from "@/models/StuntSheet";

export default Vue.extend({
  name: "MenuRight",
  components: {
    DotTypeEditor,
    SetNextPoint,
  },
  computed: {
    dotTypes(): BaseCont[][] {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.dotTypes;
    },
  },
  methods: {
    addDotType() {
      this.$store.commit("addDotType");
    },
  },
});
</script>

<style scoped lang="scss">
.menu-right {
  grid-area: menu-right;
  padding: 4px;
}
</style>
