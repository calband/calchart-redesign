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
        filter: {{ filter }}
      </b-button>
      <b-dropdown-item @click="filter = 'all'" data-test="warnings-filter-none"
        >All</b-dropdown-item
      >
      <b-dropdown-item
        @click="filter = 'current'"
        data-test="warnings-filter-current"
        >Current SS</b-dropdown-item
      >
    </b-dropdown>
    <ul>
      <li
        v-for="warning in warnings"
        v-bind:key="`${warning.name}-${warning.stuntSheet}-${warning.dots}`"
        @click="goTo(warning)"
      >
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
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

export default Vue.extend({
  name: "Warnings",
  components: {},
  data: function () {
    return {
      filter: "all",
    };
  },
  computed: {
    warnings(): Warning[] {
      const warnings: Warning[] = [];
      const show: Show = this.$store.state.show;
      warnings.push(...show.warnings);
      show.stuntSheets.forEach((sheet) => {
        warnings.push(...sheet.warnings);
        sheet.stuntSheetDots.forEach((dot) => {
          warnings.push(...dot.warnings);
        });
      });
      if (this.filter === "current") {
        return warnings.filter((warning: Warning) => {
          const currentSS: number = this.$store.state.selectedSS;
          return warning.stuntSheets.some((ss: number) => {
            return ss === currentSS;
          });
        });
      }
      return warnings;
    },
  },
  methods: {
    getLocation(warning: Warning): string {
      if (warning.stuntSheets !== undefined && warning.stuntSheets.length > 1) {
        if (warning.dots.length !== 0) {
          return `SS ${warning.stuntSheets[0] + 1} Dots ${warning.dots.join(
            ", "
          )}`;
        }
        return `SS ${warning.stuntSheets[0] + 1}`;
      }
      return "";
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
      if (warning.stuntSheets !== undefined && warning.stuntSheets.length > 1) {
        GlobalStore.commit(Mutations.SET_SELECTED_SS, warning.stuntSheets[0]);
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
