<template>
  <div class="mb-5 wrapper">
    <h2>Selected Dot Editor</h2>
    <template v-if="dotsWithLabels.length">
      <h3 v-if="dotsWithLabels.length > 1" data-test="selected-dot--selection">
        Multiple Selected Dots
      </h3>
      <h3
        v-if="dotsWithLabels.length === 1"
        data-test="selected-dot--selection"
      >
        Selected Dot: {{ label }}
      </h3>
      <b-field label="Dot Type">
        <b-select size="is-small" v-model="dotTypeIndex">
          <option
            v-for="dotType in dotTypesOptions"
            :key="dotType"
            :value="dotType"
          >
            Dot type {{ dotType }}
          </option>
          <option value="" disabled>Multiple</option>
        </b-select>
      </b-field>
    </template>
    <template v-else>
      <h3 data-test="selected-dot--selection">No dots selected!</h3>
    </template>
  </div>
</template>

<script lang="ts">
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { CalChartState } from "@/store";
import { Mutations } from "@/store/mutations";
import Vue from "vue";

export default Vue.extend({
  name: "SelectedDotEditor",
  computed: {
    dotsWithLabels(): [string, StuntSheetDot][] {
      const { show } = this.$store.state as CalChartState;
      const { selectedDotIds, selectedSS } = show;
      const dotsWithLabels = show.dotsWithLabelsForSS(selectedSS);
      return dotsWithLabels.filter(([, dot]) =>
        selectedDotIds.includes(dot.id)
      );
    },
    dotTypesOptions(): number[] {
      const stuntSheet: StuntSheet = this.$store.getters.getSelectedStuntSheet;
      return stuntSheet.dotTypes.map((_, index) => index);
    },
    label(): string | null {
      return this.dotsWithLabels.length === 1
        ? this.dotsWithLabels[0][0]
        : null;
    },
    dotTypeIndex: {
      get(): number | "" {
        if (this.dotsWithLabels.length === 1) {
          return this.dotsWithLabels[0][1].dotTypeIndex;
        } else {
          const firstDotTypeIndex = this.dotsWithLabels[0][1].dotTypeIndex;
          const singleDotType = this.dotsWithLabels.every(
            ([, dot]) => firstDotTypeIndex === dot.dotTypeIndex
          );
          return singleDotType ? firstDotTypeIndex : "";
        }
      },
      set(dotTypeIndex: number): void {
        this.$store.commit(
          Mutations.UPDATE_SELECTED_DOTS_DOT_TYPE,
          dotTypeIndex
        );
      },
    },
  },
});
</script>

<style scoped lang="scss">
h2 {
  font-weight: bold;
}
</style>
