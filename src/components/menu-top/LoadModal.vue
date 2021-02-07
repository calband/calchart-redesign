<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title" data-test="load-model--title">Load Show</p>
    </header>

    <section class="modal-card-body">
      <b-field class="file">
        <b-upload v-model="file" accept=".shw, .shw4" @input="loadShow">
          <a class="button is-primary" data-test="load-modal--icon">
            <b-icon icon="upload" />
            <span>Click to load</span>
          </a>
        </b-upload>
        <span v-if="file" class="file-name">
          {{ file.name }}
        </span>
      </b-field>
      <b-message v-if="parseError" title="Error" type="is-danger">
        {{ parseError }}
      </b-message>
      <b-field v-if="showPreview">
        Number of marchers: {{ numMarchers }}
      </b-field>
      <b-field v-if="showPreview"> Number of sheets: {{ numSheets }} </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        data-test="load-modal--import"
        :disabled="!showPreview"
        @click="
          setShow();
          $parent.close();
        "
      >
        Import
      </b-button>
      <b-button
        type="is-secondary"
        data-test="load-modal--close"
        @click="$parent.close()"
      >
        Close
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  InitialLoadShwState,
  InitialLoadShw4State,
} from "@/models/InitialLoadShowState";
import Show from "@/models/Show";
import { Mutations } from "@/store/mutations";
import InitialShowState from "@/models/InitialShowState";

export default Vue.extend({
  name: "LoadModal",
  data: (): {
    file: File | null;
    showLoadState: InitialShowState | null;
    showPreview: Show | null;
    parseError: string;
  } => ({ file: null, showLoadState: null, showPreview: null, parseError: "" }),
  computed: {
    numMarchers(): number {
      return this.showPreview && this.showPreview.stuntSheets.length > 0
        ? this.showPreview?.stuntSheets[0].stuntSheetDots.length
        : 0;
    },
    numSheets(): number {
      return this.showPreview ? this.showPreview.stuntSheets.length : 0;
    },
  },
  methods: {
    loadShow(): void {
      if (this.file === null) {
        return;
      }
      this.showPreview = null;
      this.parseError = "";
      const reader = new FileReader();
      // Check if calchart 4 or not...
      if (this.file.name.includes(".shw4")) {
        reader.onload = (): void => {
          if (reader.result) {
            try {
              this.showLoadState = new InitialLoadShw4State({
                showData: reader.result as string,
              });
              this.showPreview = this.showLoadState.getInitialState();
            } catch (e) {
              this.parseError = e;
            }
          } else {
            this.parseError = "Could not read file.";
          }
        };
        reader.readAsText(this.file);
      } else if (this.file.name.includes(".shw")) {
        reader.onload = (): void => {
          if (
            reader.result &&
            this.file &&
            reader.result instanceof ArrayBuffer
          ) {
            try {
              this.showLoadState = new InitialLoadShwState({
                showData: reader.result,
                fileName: this.file.name,
              });
              this.showPreview = this.showLoadState.getInitialState();
            } catch (e) {
              this.parseError = e;
            }
          } else {
            this.parseError = "Could not read file.";
          }
        };
        reader.readAsArrayBuffer(this.file);
      } else {
        this.parseError = "Not a .shw or .shw4 file.";
      }
    },
    setShow(): void {
      if (!this.showPreview) {
        return;
      }
      this.$store.commit(Mutations.SET_SHOW, this.showLoadState);
    },
  },
});
</script>

<style scoped lang="scss"></style>
