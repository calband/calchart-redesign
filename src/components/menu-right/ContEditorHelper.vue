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
  <ContEvenEditor
    v-else-if="isEven"
    :continuityIndex="continuityIndex"
    :dotTypeIndex="dotTypeIndex"
  />
</template>

<script lang="ts">
import Vue from "vue";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContInPlaceEditor from "./ContInPlaceEditor.vue";
import ContETFDynamicEditor from "./ContETFDynamicEditor.vue";
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContEven from "@/models/continuity/ContEven";
import ContEvenEditor from "./ContEvenEditor.vue";

/**
 * View/Edit a specific continuity
 */
export default Vue.extend({
  name: "ContEditorHelper",
  components: {
    ContInPlaceEditor,
    ContETFDynamicEditor,
    ContEvenEditor,
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
    isEven() {
      const continuity = this.$store.getters.getContinuity(
        this.dotTypeIndex,
        this.continuityIndex
      );
      return continuity instanceof ContEven;
    },
  },
});
</script>

<style scoped lang="scss"></style>
