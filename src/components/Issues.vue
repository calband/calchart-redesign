<template>
  <div class="issues">
    Issues
    <b-dropdown>
      <b-button
        type="is-text"
        size="is-small"
        expanded
        slot="trigger"
        icon-right="menu-down"
        data-test="issues-filter"
      >
        filter: {{ filter }}
      </b-button>
      <b-dropdown-item @click="filter = 'all'" data-test="issues-filter-none"
        >All</b-dropdown-item
      >
      <b-dropdown-item
        @click="filter = 'current'"
        data-test="issues-filter-current"
        >Current SS</b-dropdown-item
      >
    </b-dropdown>
    <ul>
      <li
        v-for="issue in issues"
        v-bind:key="`${issue.name}-${issue.stuntSheet}-${issue.dots}`"
        @click="goTo(issue)"
      >
        <b-tooltip :label="getLocation(issue)">
          <span
            style="font-weight: bold"
            :style="`color: ${color(issue.issueType)}`"
          >
            <b-icon icon="alert" size="is-small" /> {{ issue.name }} </span
          >: {{ issue.description }}
        </b-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Issue, { IssueType } from "@/models/util/issue";
import Show from "@/models/Show";
import { GlobalStore } from "@/store";
import { Mutations } from "@/store/mutations";

export default Vue.extend({
  name: "Issues",
  components: {},
  data: function () {
    return {
      filter: "all",
    };
  },
  computed: {
    issues(): Issue[] {
      const issues: Issue[] = [];
      const show: Show = this.$store.state.show;
      issues.push(...show.issues);
      show.stuntSheets.forEach((sheet) => {
        issues.push(...sheet.issues);
        sheet.stuntSheetDots.forEach((dot) => {
          issues.push(...dot.issues);
        });
      });
      if (this.filter === "current") {
        return issues.filter((issue: Issue) => {
          const currentSS: number = this.$store.state.selectedSS;
          return issue.stuntSheets.some((ss: number) => {
            return ss === currentSS;
          });
        });
      }
      return issues;
    },
  },
  methods: {
    getLocation(issue: Issue): string {
      if (issue.stuntSheets !== undefined && issue.stuntSheets.length > 1) {
        if (issue.dots.length !== 0) {
          return `SS ${issue.stuntSheets[0] + 1} Dots ${issue.dots.join(
            ", "
          )}`;
        }
        return `SS ${issue.stuntSheets[0] + 1}`;
      }
      return "";
    },
    color(type: IssueType): string {
      switch (type) {
        case IssueType.ERROR: {
          return "red";
        }
        default: {
          return "grey";
        }
      }
    },
    goTo(issue: Issue) {
      debugger;
      if (issue.stuntSheets !== undefined && issue.stuntSheets.length >= 1) {
        GlobalStore.commit(Mutations.SET_SELECTED_SS, issue.stuntSheets[0]);
        if (issue.dots.length !== 0) {
          GlobalStore.commit(Mutations.CLEAR_SELECTED_DOTS)
          GlobalStore.commit(Mutations.ADD_SELECTED_DOTS, issue.dots);
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

.issues {
  overflow-y: scroll;
  grid-area: issues;
}
</style>
