<template>
  <div class="menu-left">
    <b-field :label="`Show: ${title}`" data-test="menu-left--title" />
    <b-field
      :label="`Beat: ${beatString} / ${selectedSSBeats}`"
      data-test="menu-left--beat"
    >
      <b-slider
        v-model="beat"
        class="beat-slider"
        data-test="menu-left--beat-slider"
        :min="0"
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
            <b-icon
              data-test="menu-left--ss--issue-icon"
              icon="alert"
              size="is-small"
              :style="`visibility: ${isIssue(index) ? 'visible' : 'hidden'}`"
            />
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
import Issue from "@/models/util/issue";
import { Mutations } from "@/store/mutations";
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
        return this.$store.getters.getBeat;
      },
      set(beat: number): void {
        this.$store.commit(Mutations.SET_BEAT, beat);
      },
    },
    beatString(): string {
      return this.$store.getters.getBeat === 0
        ? "Hup!"
        : this.$store.getters.getBeat.toString();
    },
    stuntSheets(): StuntSheet[] {
      return this.$store.state.show.stuntSheets;
    },
    selectedSS: {
      get(): number {
        return this.$store.getters.getSelectedStuntIndex;
      },
      set(selectedSS: number): void {
        this.$store.commit(Mutations.SET_SELECTED_SS, selectedSS);
        this.$store.commit(Mutations.SET_BEAT, 0);
      },
    },
    selectedSSBeats(): number {
      const selectedSS = this.$store.getters
        .getSelectedStuntSheet as StuntSheet;
      return selectedSS.beats;
    },
    title(): string {
      return this.$store.state.show.title;
    },
  },
  methods: {
    isIssue(index: number): boolean {
      return (
        this.$store.state.show.stuntSheets[index].issues.length !== 0 ||
        this.$store.state.show.issues.some((issue: Issue) => {
          return issue.stuntSheets.some((ss: number) => {
            return ss === index;
          });
        })
      );
    },
    addStuntSheet(): void {
      this.$store.commit(Mutations.ADD_STUNT_SHEET);
    },
    incrementBeat(): void {
      this.$store.commit(Mutations.INCREMENT_BEAT);
    },
    decrementBeat(): void {
      this.$store.commit(Mutations.DECREMENT_BEAT);
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
