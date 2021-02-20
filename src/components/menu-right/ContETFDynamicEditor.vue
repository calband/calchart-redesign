<template>
  <div class="my-1 px-1">
    <b-field>
      <b-select
        v-model="selectedETFType"
        size="is-small"
        data-test="cont-etf-dynamic--etf-type"
      >
        <option
          v-for="(etfType, etfTypeIndex) in etfTypeOptions"
          :key="`cont-etf-dynamic-${continuityIndex}-${etfTypeIndex}`"
          :value="etfType"
          :selected="selectedETFType == etfType"
        >
          {{ etfType }}
        </option>
      </b-select>
      <b-select
        v-model="selectedMarchType"
        size="is-small"
        data-test="cont-etf-dynamic--march-type"
      >
        <option
          v-for="(marchType, marchTypeIndex) in marchTypeOptions"
          :key="`cont-in-place-${continuityIndex}-${marchTypeIndex}`"
          :value="marchType"
          :selected="selectedMarchType == marchType"
        >
          {{ marchType }}
        </option>
      </b-select>
      <p class="control" v-if="canDelete">
        <b-button
          icon-left="delete"
          size="is-small"
          @click="deleteContinuity"
          data-test="cont-etf-dynamic--delete"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContETFDynamic, {
  ETF_DYNAMIC_TYPES,
} from "@/models/continuity/ContETFDynamic";
import { MARCH_TYPES } from "@/models/util/constants";
import StuntSheet from "@/models/StuntSheet";
import { Mutations } from "@/store/mutations";

/**
 * View/Edit an Eight to Five Static continuity
 */
export default Vue.extend({
  name: "ContETFDynamicEditor",
  props: {
    continuityIndex: {
      type: Number,
      required: true,
    },
    dotTypeIndex: {
      type: Number,
      required: true,
    },
  },
  computed: {
    etfTypeOptions() {
      return Object.values(ETF_DYNAMIC_TYPES);
    },
    marchTypeOptions() {
      return Object.values(MARCH_TYPES);
    },
    selectedETFType: {
      get(): ETF_DYNAMIC_TYPES {
        const continuity: ContETFDynamic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.eightToFiveType;
      },
      set(etfType: ETF_DYNAMIC_TYPES): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_ETF_TYPE, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          etfType: etfType,
        });
      },
    },
    selectedMarchType: {
      get(): MARCH_TYPES {
        const continuity: ContETFDynamic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.marchType;
      },
      set(marchType: MARCH_TYPES): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_MARCH_STYLE, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          marchType: marchType,
        });
      },
    },
    canDelete(): boolean {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.dotTypes[this.dotTypeIndex].length > 1;
    },
  },
  methods: {
    deleteContinuity() {
      this.$store.commit(Mutations.DELETE_DOT_TYPE_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        continuityIndex: this.continuityIndex,
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
