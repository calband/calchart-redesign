<template>
  <div class="my-2">
    <p data-test="menu-right--dot-type">Dot Type {{ dotTypeIndex }}</p>
    <ContEditorHelper
      v-for="(continuity, index) in dotType"
      :key="`continuity--${dotTypeIndex}--${index}`"
      :continuityIndex="index"
      :dotTypeIndex="dotTypeIndex"
    />
    <div>
      <b-dropdown>
        <b-button
          type="is-text"
          size="is-small"
          expanded
          slot="trigger"
          icon-right="menu-down"
          data-test="menu-right--add-continuity"
        >
          Add Continuity
        </b-button>

        <b-dropdown-item
          @click="addContInPlace"
          data-test="menu-right--add-in-place"
          >In Place</b-dropdown-item
        >
        <b-dropdown-item
          @click="addContETFDynamic"
          data-test="menu-right--add-etf-dynamic"
          >Eight to Five Dynamic</b-dropdown-item
        >
        <b-dropdown-item @click="addContEven" data-test="menu-right--add-even"
          >Even</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import BaseCont from "@/models/continuity/BaseCont";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContEven from "@/models/continuity/ContEven";
import StuntSheet from "@/models/StuntSheet";
import Vue from "vue";
import ContEditorHelper from "./ContEditorHelper.vue";

/**
 * View/Edit all continuiuties for a dot type
 */
export default Vue.extend({
  name: "DotTypeEditor",
  components: {
    ContEditorHelper,
  },
  props: {
    dotTypeIndex: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dotType(): BaseCont[] {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.dotTypes[this.dotTypeIndex];
    },
  },
  methods: {
    addContInPlace() {
      this.$store.commit("addContinuity", {
        dotTypeIndex: this.dotTypeIndex,
        continuity: new ContInPlace(),
      });
    },
    addContETFDynamic() {
      this.$store.commit("addContinuity", {
        dotTypeIndex: this.dotTypeIndex,
        continuity: new ContETFDynamic(),
      });
    },
    addContEven() {
      this.$store.commit("addContinuity", {
        dotTypeIndex: this.dotTypeIndex,
        continuity: new ContEven(),
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
