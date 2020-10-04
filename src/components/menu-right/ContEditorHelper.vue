<template>
  <ContInPlaceEditor
    v-if="isInPlace"
    :continuityIndex="continuityIndex"
    :dotTypeIndex="dotTypeIndex"
  />
  <ContETFDynamicEditor
    v-else-if="isETFDynamic"
    :continuityIndex="continuityIndex"
    :dotTypeIndex="dotTypeIndex"
  />
</template>

<script lang="ts">
import ContInPlace from "@/models/continuity/ContInPlace";
import Vue from "vue";
import ContInPlaceEditor from "./ContInPlaceEditor.vue";
import ContETFDynamicEditor from "./ContETFDynamicEditor.vue";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";

/**
 * View/Edit a specific continuity
 */
export default Vue.extend({
  name: "ContEditorHelper",
  components: {
    ContInPlaceEditor,
    ContETFDynamicEditor,
  },
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
    isInPlace() {
      const continuity = this.$store.getters.getContinuity(
        this.dotTypeIndex,
        this.continuityIndex
      );
      return continuity instanceof ContInPlace;
    },
    isETFDynamic() {
      const continuity = this.$store.getters.getContinuity(
        this.dotTypeIndex,
        this.continuityIndex
      );
      return continuity instanceof ContETFDynamic;
    },
  },
});
</script>

<style scoped lang="scss"></style>
