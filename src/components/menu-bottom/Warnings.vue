<template>
  <div class="warnings" >
    <ul>
      <li
        v-for="warning in warnings"
        v-bind:key="warning.name"
      >
        <span style="font-weight:bold" :style="`color: ${color(warning.warningType)}`"> <b-icon icon="alert" size="is-small" /> {{ warning.name }} </span>: {{ warning.description }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Warning, { WarningType } from "@/models/util/warning";

export default Vue.extend({
  name: "Warnings",
  components: {
  },
  computed: {
    warnings(): Warning[] {
      return this.$store.state.warnings;
    },
  },
  methods: {
    color(type: WarningType): string {
      switch (type) {
        case WarningType.ERROR: {
          return "red";
        }
        default: {
          return "grey";
        }
      }
    }
  },
});
</script>

<style scoped lang="scss">

bl {
  list-style-position: inside;
}
</style>