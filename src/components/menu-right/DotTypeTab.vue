<template>
  <div>
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
import { BaseCont } from "@/models/continuity/BaseCont";
import Vue from "vue";
import StuntSheet from "@/models/StuntSheet";
import { Mutations } from "@/store/mutations";

export default Vue.extend({
  name: "DotTypeTab",
  components: {
    DotTypeEditor,
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
      this.$store.commit(Mutations.ADD_DOT_TYPE);
    },
  },
});
</script>
