<template>
  <div class="menu-left">
    <b-field
      :label="`Beat: ${beat} / ${selectedSSBeats}`"
      data-test="menu-left--beat"
    >
      <b-slider
        v-model="beat"
        class="beat-slider"
        data-test="menu-left--beat-slider"
        :min="1"
        :max="selectedSSBeats"
        :tooltip="false"
      />
    </b-field>
    <div class="buttons beat-buttons">
      <b-button
        type="is-primary"
        icon-left="arrow-left-bold"
        data-test="menu-left--decrement-beat"
        @click="decrementBeat"
      />
      <b-button
        type="is-primary"
        icon-left="arrow-right-bold"
        data-test="menu-left--increment-beat"
        @click="incrementBeat"
      />
    </div>
    <p class="label">Stuntsheets</p>
    <b-menu>
      <b-menu-list>
        <b-menu-item
          v-for="(stuntSheet, index) in stuntSheets"
          :key="stuntSheet.id"
          class="stuntsheet"
          :active="selectedSS === index"
          data-test="menu-left--ss"
          @click="selectedSS = index"
        >
          <template slot="label">
            {{ `${index + 1}) ${stuntSheet.title}` }}
            <b-icon
              class="stuntsheet-edit is-pulled-right"
              icon="pencil"
              size="is-small"
              @click.native="stuntSheetModalActive = true"
            />
          </template>
        </b-menu-item>
      </b-menu-list>
    </b-menu>
    <b-button
      type="is-text"
      size="is-small"
      expanded
      data-test="menu-left--add-ss"
      @click="addStuntSheet"
    >
      Add Stuntsheet
    </b-button>
    <b-modal
      :active.sync="stuntSheetModalActive"
      has-modal-card
      trap-focus
      data-test="menu-left--ss-modal"
    >
      <StuntSheetModal />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import StuntSheet from "../../models/StuntSheet";
import StuntSheetModal from "./StuntSheetModal.vue";

export default Vue.extend({
  name: "MenuLeft",
  components: {
    StuntSheetModal,
  },
  data() {
    return {
      stuntSheetModalActive: false,
    };
  },
  computed: {
    beat: {
      get(): number {
        return this.$store.state.beat;
      },
      set(beat: number): void {
        this.$store.commit("setBeat", beat);
      },
    },
    stuntSheets(): StuntSheet[] {
      return this.$store.state.show.stuntSheets;
    },
    selectedSS: {
      get(): number {
        return this.$store.state.selectedSS;
      },
      set(selectedSS: number): void {
        this.$store.commit("setSelectedSS", selectedSS);
        this.$store.commit("setBeat", 1);
      },
    },
    selectedSSBeats(): number {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.beats;
    },
  },
  methods: {
    addStuntSheet(): void {
      this.$store.commit("addStuntSheet");
    },
    incrementBeat(): void {
      this.$store.commit("incrementBeat");
    },
    decrementBeat(): void {
      this.$store.commit("decrementBeat");
    },
  },
});
</script>

<style scoped lang="scss">
.menu-left {
  grid-area: menu-left;
  overflow-y: auto;
  padding: $radius;

  .beat-slider {
    padding: 0 0.5rem;
  }

  .beat-buttons {
    justify-content: space-between;
  }
}

.stuntsheet {
  .stuntsheet-edit {
    display: none;
  }

  &:hover .stuntsheet-edit,
  .is-active .stuntsheet-edit {
    display: block;
  }
}
</style>
