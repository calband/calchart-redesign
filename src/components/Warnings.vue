<template>
  <div class="warnings">
    Warnings
    <b-dropdown>
      <b-button
        type="is-text"
        size="is-small"
        expanded
        slot="trigger"
        icon-right="menu-down"
        data-test="warnings-filter"
      >
        filter: {{filter}}
      </b-button>
      <b-dropdown-item
        @click="filter='all'"
        data-test="warnings-filter-none"
        >All</b-dropdown-item
      >
      <b-dropdown-item
        @click="filter='current'"
        data-test="menu-right--add-etf-dynamic"
        >Current SS</b-dropdown-item
      >
    </b-dropdown>
    <ul>
      <li v-for="warning in warnings" v-bind:key="`${warning.name}-${warning.stuntSheet}-${warning.dots}`" @click="goTo(warning)">
        <b-tooltip :label="getLocation(warning)">
          <span
            style="font-weight: bold"
            :style="`color: ${color(warning.warningType)}`"
          >
            <b-icon icon="alert" size="is-small" /> {{ warning.name }} </span
          >: {{ warning.description }}
        </b-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Warning, { WarningType } from "@/models/util/warning";
import Show from "@/models/Show";
import StuntSheet from "@/models/StuntSheet";
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

export default Vue.extend({
  name: "Warnings",
  components: {},
  data: function() {
    return {
      filter: "all"
    }
  },
  computed: {
    warnings(): Warning[] {
      const warnings: Warning[] = [];
      switch (this.filter) {
        case "current": {
          // Get the current stuntsheet's warnings
          const sheet: StuntSheet = GlobalStore.getters.getSelectedStuntSheet;
          warnings.push(...sheet.warnings);
          sheet.stuntSheetDots.forEach(dot => {
            warnings.push(...dot.warnings)
          });
          return warnings
        }
        default: {
          // Get the whole show's warnings
          const show: Show = this.$store.state.show;
          warnings.push(...show.warnings);
          show.stuntSheets.forEach(sheet => {
            warnings.push(...sheet.warnings);
            sheet.stuntSheetDots.forEach(dot => {
              warnings.push(...dot.warnings)
            });
          });
          return warnings;
        }
      }
    },
  },
  methods: {
    getLocation(warning: Warning): string {
      if (warning.stuntSheet !== null) {
        if (warning.dots.length !== 0) {
          return `SS ${warning.stuntSheet} Dots ${warning.dots.join(", ")}`
        }
        return `SS ${warning.stuntSheet}`
      }
      return ""
    },
    color(type: WarningType): string {
      switch (type) {
        case WarningType.ERROR: {
          return "red";
        }
        default: {
          return "grey";
        }
      }
    },
    goTo(warning: Warning) {
      if (warning.stuntSheet !== null) {
        GlobalStore.commit(Mutations.SET_SELECTED_SS, warning.stuntSheet);
        if (warning.dots.length !== 0) {
          GlobalStore.commit(Mutations.TOGGLE_SELECTED_DOTS, warning.dots);
        }
      }
    },
  },
});
</script>

<style scoped lang="scss">
bl {
  list-style-position: inside;
}

.warnings {
  overflow-y: scroll;
  grid-area: warnings;
}
</style>
