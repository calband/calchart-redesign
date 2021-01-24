<template>
  <div class="my-1 px-1">
    <b-field>
      <b-select
        v-model="selectedMarchType"
        size="is-small"
        data-test="cont-in-place--march-type"
      >
        <option
          v-for="(marchType, marchTypeIndex) in marchTypeOptions"
          :key="`cont-in-place-${continuityIndex}-${marchTypeIndex}`"
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
        data-test="cont-in-place--duration"
      />
      <b-select
        v-model="selectedDirection"
        size="is-small"
        data-test="cont-in-place--direction"
      >
        <option
          v-for="(direction, directionIndex) in directionOptions"
          :key="`direction-${continuityIndex}-${directionIndex}`"
          :value="direction.degrees"
          :selected="selectedDirection == direction.degrees"
        >
          {{ direction.friendlyName }}
        </option>
      </b-select>
      <p class="control" v-if="canDelete">
        <b-button
          icon-left="delete"
          size="is-small"
          @click="deleteContinuity"
          data-test="cont-in-place--delete"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContInPlace from "@/models/continuity/ContInPlace";
import { DIRECTIONS, MARCH_TYPES } from "@/models/util/constants";
import StuntSheet from "@/models/StuntSheet";
import { Mutations } from "@/store/mutations";

/**
 * View/Edit an In Place continuity
 */
export default Vue.extend({
  name: "ContInPlaceEditor",
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
      // HS and MM should have a "MT" prefix
      return Object.values(MARCH_TYPES).map((marchType) => {
        const prefix =
          marchType === MARCH_TYPES.HS ||
          marchType === MARCH_TYPES.MINI_MILITARY
            ? "MT"
            : "";
        return {
          friendlyName: `${prefix}${marchType}`,
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
        const continuity: ContInPlace = this.$store.getters.getContinuity(
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
    selectedDirection: {
      get(): number {
        const continuity: ContInPlace = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.direction;
      },
      set(direction: number): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_IN_PLACE_DIRECTION, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          direction: direction,
        });
      },
    },
    selectedDuration: {
      get(): number {
        const continuity: ContInPlace = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.duration;
      },
      set(duration: number): void {
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_DURATION, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          duration: duration
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
