<template>
  <div class="menu-right">
    <ViewModeForm />
    <hr />
    <SelectedDotEditor />
    <hr />
    <DotTypeEditorWrapper />
  </div>
</template>

<script lang="ts">
import ViewModeForm from "./ViewModeForm.vue";
import SelectedDotEditor from "./SelectedDotEditor.vue";
import DotTypeEditorWrapper from "./DotTypeEditorWrapper.vue";
import Vue from "vue";

export default Vue.extend({
  name: "MenuRight",
  components: {
    ViewModeForm,
    SelectedDotEditor,
    DotTypeEditorWrapper,
  },
});
</script>

<style scoped lang="scss">
.menu-right {
  grid-area: menu-right;
}
</style>

<style lang="scss">
// Not scoped since we are modifying buefy styling
.menu-right .b-tabs .tab-content {
  padding: 4px;
}
</style>
