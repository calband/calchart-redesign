<template>
  <div class="my-2">
    <b data-test="menu-right--dot-type">Dot Type {{ dotTypeIndex }}</b>
    <svg
      viewBox="-1 -1 2 2"
      class="menu-right-dot-appearance"
      @click="dotAppearanceModalActive = true"
    >
      <Dot
        :key="`menu-right-dot-${dotTypeIndex}-preview`"
        :data-test="`menu-right-dot-${dotTypeIndex}-preview`"
        :dotTypeIndex="dotTypeIndex"
        :labeled="false"
      />
    </svg>
    <ContEditorHelper
      v-for="(continuity, index) in dotType"
      :key="`continuity--${dotTypeIndex}--${index}`"
      :continuityIndex="index"
      :dotTypeIndex="dotTypeIndex"
    />
    <div>
      <b-dropdown>
        <b-button
          type="is-text"
          size="is-small"
          expanded
          slot="trigger"
          icon-right="menu-down"
          data-test="menu-right--add-continuity"
        >
          Add Continuity
        </b-button>

        <b-dropdown-item
          @click="addContInPlace"
          data-test="menu-right--add-in-place"
          >In Place</b-dropdown-item
        >
        <b-dropdown-item
          @click="addContETFDynamic"
          data-test="menu-right--add-etf-dynamic"
          >Eight to Five Dynamic</b-dropdown-item
        >
        <b-dropdown-item
          @click="addContETFStatic"
          data-test="menu-right--add-etf-static"
          >Eight to Five Static</b-dropdown-item
        >
        <b-dropdown-item
          @click="addContGateTurn"
          data-test="menu-right--add-gate-turn"
          >Gate Turn</b-dropdown-item
        >
        <b-dropdown-item @click="addContEven" data-test="menu-right--add-even"
          >Even</b-dropdown-item
        >
      </b-dropdown>
    </div>
    <hr />
    <b-modal
      :active.sync="dotAppearanceModalActive"
      has-modal-card
      trap-focus
      data-test="menu-right-dot-appearance-modal"
    >
      <DotAppearanceModal :dotTypeIndex="dotTypeIndex" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import ContETFDynamic from "@/models/continuity/ContETFDynamic";
import ContETFStatic from "@/models/continuity/ContETFStatic";
import ContInPlace from "@/models/continuity/ContInPlace";
import ContEven from "@/models/continuity/ContEven";
import ContGateTurn from "@/models/continuity/ContGateTurn";
import { BaseCont, CONT_IDS } from "@/models/continuity/BaseCont";
import StuntSheet from "@/models/StuntSheet";
import Vue from "vue";
import ContEditorHelper from "./ContEditorHelper.vue";
import Dot from "@/components/grapher/Dot.vue";
import DotAppearanceModal from "./DotAppearanceModal.vue";
import { Mutations } from "@/store/mutations";

/**
 * View/Edit all continuiuties for a dot type
 */
export default Vue.extend({
  name: "DotTypeEditor",
  data: () => ({
    dotAppearanceModalActive: false,
  }),
  components: {
    ContEditorHelper,
    Dot,
    DotAppearanceModal,
  },
  props: {
    dotTypeIndex: {
      type: Number,
      required: true,
    },
  },
  computed: {
    dotType(): BaseCont[] {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.dotTypes[this.dotTypeIndex];
    },
  },
  methods: {
    addContInPlace() {
      this.$store.commit(Mutations.ADD_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        contID: CONT_IDS.IN_PLACE,
      });
    },
    addContETFDynamic() {
      this.$store.commit(Mutations.ADD_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        contID: CONT_IDS.ETF_DYNAMIC,
      });
    },
    addContETFStatic() {
      this.$store.commit(Mutations.ADD_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        contID: CONT_IDS.ETF_STATIC,
      });
    },
    addContEven() {
      this.$store.commit(Mutations.ADD_CONTINUITY, {
        dotTypeIndex: this.dotTypeIndex,
        contID: CONT_IDS.EVEN,
      });
    },
    addContGateTurn() {
      this.$store.commit("addContinuity", {
        dotTypeIndex: this.dotTypeIndex,
        continuity: new ContGateTurn(),
      });
    },
  },
});
</script>

<style scoped lang="scss">
.menu-right-dot-appearance {
  vertical-align: middle;
  float: right;
  width: 10%;
  height: 10%;
}
</style>
