<template>
  <div class="my-1 px-1">
    <b-field>
      <b-select
        v-model="selectedMarchType"
        size="is-small"
        data-test="cont-etf-static--march-type"
      >
        <option
          v-for="(marchType, marchTypeIndex) in marchTypeOptions"
          :key="`cont-etf-static-${continuityIndex}-${marchTypeIndex}`"
          :value="marchType.value"
          :selected="selectedMarchType == marchType.value"
        >
          {{ marchType.friendlyName }}
        </option>
      </b-select>
      <b-numberinput
        :controls="false"
        v-model="selectedDuration"
        size="is-small"
        min="0"
        data-test="cont-etf-static--duration"
      />
      <b-select
        v-model="selectedMarchingDirection"
        size="is-small"
        data-test="cont-etf-static--marching-direction"
      >
        <option
          v-for="(direction, directionIndex) in directionOptions"
          :key="`marchingdirection-${continuityIndex}-${directionIndex}`"
          :value="direction.degrees"
          :selected="selectedMarchingDirection == direction.degrees"
        >
          {{ direction.friendlyName }}
        </option>
      </b-select>
      <p class="control" v-if="canDelete">
        <b-button
          icon-left="delete"
          size="is-small"
          @click="deleteContinuity"
          data-test="cont-etf-static--delete"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContETFStatic from "@/models/continuity/ContETFStatic";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import StuntSheet from "@/models/StuntSheet";
import { DELETE_DOT_TYPE_CONTINUITY, UPDATE_DOT_TYPE_CONTINUITY } from "@/store/mutations";

/**
 * View/Edit an ETF-Static continuity
 */
export default Vue.extend({
  name: "ContETFStaticEditor",
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
    marchTypeOptions() {
      return Object.values(MARCH_TYPES).map((marchType) => {
        return {
          friendlyName: `${marchType}`,
          value: marchType,
        };
      });
    },
    directionOptions() {
      return Object.values(DIRECTIONS)
        .filter(Number.isInteger)
        .map((dir) => ({
          degrees: dir,
          friendlyName: DIRECTIONS[dir as number],
        }));
    },
    selectedMarchType: {
      get(): MARCH_TYPES {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.marchType;
      },
      set(marchType: MARCH_TYPES): void {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        continuity.marchType = marchType;
        this.$store.commit(UPDATE_DOT_TYPE_CONTINUITY, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          continuity,
        });
      },
    },
    selectedMarchingDirection: {
      get(): number {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.marchingDirection;
      },
      set(direction: number): void {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        continuity.marchingDirection = direction;
        continuity.facingDirection = direction;
        this.$store.commit("updateDotTypeContinuity", {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          continuity: continuity,
        });
      },
    },
    selectedDuration: {
      get(): number {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.duration;
      },
      set(duration: number): void {
        const continuity: ContETFStatic = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        continuity.duration = duration;
        this.$store.commit(UPDATE_DOT_TYPE_CONTINUITY, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          continuity,
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
      this.$store.commit(DELETE_DOT_TYPE_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        continuityIndex: this.continuityIndex,
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
