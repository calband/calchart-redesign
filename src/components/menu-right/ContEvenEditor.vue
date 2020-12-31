<template>
  <div class="my-1 px-1">
    <b-field>
      <b-select
        v-model="selectedMarchType"
        size="is-small"
        data-test="cont-even--march-type"
      >
        <option
          v-for="(marchType, marchTypeIndex) in marchTypeOptions"
          :key="`cont-even-${continuityIndex}-${marchTypeIndex}`"
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
        data-test="cont-even--duration"
      />
      <p class="control" v-if="canDelete">
        <b-button
          icon-left="delete"
          size="is-small"
          @click="deleteContinuity"
          data-test="cont-even--delete"
        />
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ContEven from "@/models/continuity/ContEven";
import { MARCH_TYPES } from "@/models/util/constants";
import StuntSheet from "@/models/StuntSheet";
import { Mutations } from "@/store/mutations";

/**
 * View/Edit an In Place continuity
 */
export default Vue.extend({
  name: "ContEvenEditor",
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
      return [
        {
          friendlyName: "EVEN MARCH MM",
          value: MARCH_TYPES.MINI_MILITARY,
        },
        {
          friendlyName: "EVEN MARCH HS",
          value: MARCH_TYPES.HS,
        },
      ];
    },
    selectedMarchType: {
      get(): MARCH_TYPES {
        const continuity: ContEven = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.marchType;
      },
      set(marchType: MARCH_TYPES): void {
        const continuity: ContEven = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        continuity.marchType = marchType;
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_CONTINUITY, {
          dotTypeIndex: this.dotTypeIndex,
          continuityIndex: this.continuityIndex,
          continuity,
        });
      },
    },
    selectedDuration: {
      get(): number {
        const continuity: ContEven = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        return continuity.duration;
      },
      set(duration: number): void {
        const continuity: ContEven = this.$store.getters.getContinuity(
          this.dotTypeIndex,
          this.continuityIndex
        );
        continuity.duration = duration;
        this.$store.commit(Mutations.UPDATE_DOT_TYPE_CONTINUITY, {
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
      this.$store.commit(Mutations.DELETE_DOT_TYPE_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        continuityIndex: this.continuityIndex,
      });
    },
  },
});
</script>

<style scoped lang="scss"></style>
