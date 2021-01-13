<template>
  <div v-if="dotsWithLabels.length">
    <h2 v-if="dotsWithLabels.length > 1">Multiple Selected Dots</h2>
    <h2 v-if="dotsWithLabels.length === 1">Selected Dot: {{ label }}</h2>
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
  </div>
  <div v-else>
    <h2>No dots selected!</h2>
  </div>
</template>

<script lang="ts">
import StuntSheet from "@/models/StuntSheet";
import StuntSheetDot from "@/models/StuntSheetDot";
import { CalChartState } from "@/store";
import { Mutations } from "@/store/mutations";
import Vue from "vue";

export default Vue.extend({
  name: "DotTab",
  computed: {
    dotsWithLabels(): [string, StuntSheetDot][] {
      const { selectedDotIds, show, selectedSS } = this.$store
        .state as CalChartState;
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
