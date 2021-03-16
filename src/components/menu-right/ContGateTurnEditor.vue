<template>
  <div class="my-1 px-1">
    <b-field>
      <b-select
        v-model="selectedMarchType"
        size="is-small"
        data-test="cont-gate-turn--march-type"
      >
        <option
          v-for="(marchType, marchTypeIndex) in marchTypeOptions"
          :key="`cont-gate-turn-${continuityIndex}-${marchTypeIndex}`"
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
        data-test="cont-gate-turn--duration"
      />
      <b-numberinput
        :controls="false"
        v-model="selectedAngle"
        size="is-small"
        data-test="cont-gate-turn--angle"
      />
      <p class="control" v-if="canDelete">
        <b-button
          icon-left="delete"
          size="is-small"
          @click="deleteContinuity"
          data-test="cont-etf-static--delete"
        />
      </p>
      <!-- TODO: Proper centering tool #121 -->
      <p class="center">
        <b-button
          icon-left="crosshairs"
          size="is-small"
          data-test="cont-etf-static--center"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContGateTurn from "@/models/continuity/ContGateTurn";
import { MARCH_TYPES } from "@/models/util/constants";
import StuntSheet from "@/models/StuntSheet";
import { Mutations } from "@/store/mutations";

/**
 * View/Edit an ETF-Static continuity
 */
export default Vue.extend({
  name: "ContGateTurnEditor",
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
    selectedMarchType: {
      get(): MARCH_TYPES {
        const continuity: ContGateTurn = this.$store.getters.getContinuity(
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
    selectedAngle: {
      get(): number {
        const continuity: ContGateTurn = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.angle;
      },
      set(angle: number): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_ANGLE, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          angle: angle,
        });
      },
    },
    selectedDuration: {
      get(): number {
        const continuity: ContGateTurn = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.duration;
      },
      set(duration: number): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_DURATION, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          duration: duration,
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
