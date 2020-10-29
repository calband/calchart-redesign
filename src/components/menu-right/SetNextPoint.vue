<template>
  <div>
    <div class="mb-1 field">
      <b-switch v-model="isSetNextPointMode" data-test="set-next-point--switch"
        >Set Next Point Mode</b-switch
      >
    </div>
    <div class="mb-4" v-if="isSetNextPointMode">
      <b-message type="is-info" data-test="set-next-point--message">
        <template v-if="isSetNextPointToolSelected">
          <template v-if="currentSSDotIndex === null">
            Select a dot from the <b>current</b> stunt sheet to start from.
          </template>
          <template v-else>
            Select a dot from the <b>next</b> stunt sheet to end at.
          </template>
        </template>
        <template v-else>
          Select the <b>"Set Next Point"</b> tool in the bottom menu.
        </template>
      </b-message>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import BaseTool from "@/tools/BaseTool";
import ToolSelectNextPoint from "@/tools/ToolSelectNextPoint";

/**
 * Component for guiding the user through the Set Next Point tool
 */
export default Vue.extend({
  name: "SetNextPoint",
  computed: {
    isSetNextPointMode: {
      get(): boolean {
        return this.$store.state.isSetNextPointMode;
      },
      set(isSetNextPointMode: boolean): void {
        this.$store.commit("setIsSetNextPointMode", isSetNextPointMode);
      },
    },
    isSetNextPointToolSelected(): boolean {
      return this.$store.state.toolSelected instanceof ToolSelectNextPoint;
    },
    currentSSDotIndex(): number | null {
      const toolSelected: BaseTool = this.$store.state.toolSelected;
      return toolSelected && toolSelected.currentSSDotIndex;
    },
  },
});
</script>
