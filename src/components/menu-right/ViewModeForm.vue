<template>
  <div>
    <b-field label="View Mode">
      <b-select v-model="viewMode">
        <option
          v-for="viewModeOption in viewModeOptions"
          :key="viewModeOption"
          :value="viewModeOption"
        >
          {{ viewModeOption }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script lang="ts">
import { CalChartState } from "@/store";
import { VIEW_MODES } from "@/store/constants";
import { Mutations } from "@/store/mutations";
import Vue from "vue";

export default Vue.extend({
  name: "ViewModeForm",
  computed: {
    viewMode: {
      get(): VIEW_MODES {
        return (this.$store.state as CalChartState).viewMode;
      },
      set(viewModeOption: VIEW_MODES): void {
        this.$store.commit(Mutations.SET_VIEW_MODE, viewModeOption);
      },
    },
    viewModeOptions(): string[] {
      return Object.values(VIEW_MODES);
    },
  },
});
</script>
