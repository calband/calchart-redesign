<template>
  <div class="menu-bottom-undo">
    <div class="buttons">
      <p class="control" v-if="canUndo">
        <b-tooltip :label="undoName" data-test="menu-bottom-undo--tooltip-undo">
          <b-button
            icon-left="undo"
            data-test="menu-bottom-undo-tool--undo"
            @click="undo"
          />
        </b-tooltip>
      </p>
      <p class="control" v-else>
        <b-button
          disabled
          icon-left="undo"
          data-test="menu-bottom-undo-tool--undo"
        />
      </p>
      <p class="control" v-if="canRedo">
        <b-tooltip :label="redoName" data-test="menu-bottom-undo--tooltip-redo">
          <b-button
            icon-left="redo"
            data-test="menu-bottom-undo-tool--redo"
            @click="redo"
          />
        </b-tooltip>
      </p>
      <p class="control" v-else>
        <b-button
          disabled
          icon-left="redo"
          data-test="menu-bottom-undo-tool--redo"
        />
      </p>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * Handles setting and modifying the tools used in Grapher
 */
import { Mutations } from "@/store/mutations";
import Vue from "vue";

export default Vue.extend({
  name: "MenuBottomUndo",
  computed: {
    canUndo(): boolean {
      return this.$store.getters.getCanUndo;
    },
    undoName(): string {
      return "Undo " + this.$store.getters.getUndoName;
    },
    redoName(): string {
      return "Redo " + this.$store.getters.getRedoName;
    },
    canRedo(): boolean {
      return this.$store.getters.getCanRedo;
    },
  },
  // },
  methods: {
    undo(): void {
      this.$store.commit(Mutations.UNDO);
    },
    redo(): void {
      this.$store.commit(Mutations.REDO);
    },
  },
});
</script>

<style scoped lang="scss">
.menu-bottom-undo {
  grid-area: menu-bottom-undo;
}

.buttons {
  height: 24px;
}
</style>
