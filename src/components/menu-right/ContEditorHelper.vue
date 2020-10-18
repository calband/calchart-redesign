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
  <ContETFStaticEditor
    v-else-if="isETFStatic"
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
import ContETFStatic from "@/models/continuity/ContETFStatic";
import ContETFStaticEditor from "./ContETFStaticEditor.vue";

/**
 * View/Edit a specific continuity
 */
export default Vue.extend({
  name: "ContEditorHelper",
  components: {
    ContInPlaceEditor,
    ContETFDynamicEditor,
    ContETFStaticEditor,
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
    isETFStatic() {
      const continuity = this.$store.getters.getContinuity(
        this.dotTypeIndex,
        this.continuityIndex
      );
      return continuity instanceof ContETFStatic;
    },
  },
});
</script>

<style scoped lang="scss"></style>
