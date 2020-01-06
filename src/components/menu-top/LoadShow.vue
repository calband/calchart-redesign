<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Load Show
      </p>
    </header>

    <section class="modal-card-body">
      <b-field class="file">
        <b-upload
          v-model="file"
          accept=".shw"
          @input="loadShow"
        >
          <a class="button is-primary">
            <b-icon icon="upload" />
            <span>Click to load</span>
          </a>
        </b-upload>
        <span
          v-if="file"
          class="file-name"
        >
          {{ file.name }}
        </span>
      </b-field>
      <b-message
        v-if="parseError"
        title="Error"
        type="is-danger"
      >
        {{ parseError }}
      </b-message>
      <b-field v-if="show">
        Number of marchers: {{ numMarchers }}
      </b-field>
      <b-field v-if="show">
        Number of sheets: {{ numSheets }}
      </b-field>
    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        data-test="file-modal--import"
        :disabled="!showPreview"
        @click="setShow();$parent.close()"
      >
        Import
      </b-button>
      <b-button
        type="is-secondary"
        data-test="file-modal--close"
        @click="$parent.close()"
      >
        Close
      </b-button>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { loadShowFromBuffer } from '@/models/util/LoadShow';
import Show from '@/models/Show';

export default Vue.extend({
  name: 'LoadShow',
  data: (): {
    file: Blob | null;
    showPreview: Show | null;
    parseError: string;
  } => ({ file: null, showPreview: null, parseError: '' }),
  computed: {
    numMarchers(): number {
      return this.showPreview ? this.showPreview.dotLabels.length : 0;
    },
    numSheets(): number {
      return this.showPreview ? this.showPreview.stuntSheets.length : 0;
    },
  },
  methods: {
    loadShow: function() {
      if (this.file === null) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result && reader.result instanceof ArrayBuffer) {
          try {
            this.showPreview = loadShowFromBuffer(reader.result);
          } catch(e) {
            this.parseError = e;
          }
        } else {
          this.parseError = 'Could not read file.';
        }
      };
      reader.readAsArrayBuffer(this.file);
    },
    setShow: function() {
      if (!this.showPreview) {
        return;
      }
      this.$store.commit('setShow', this.showPreview);
    },
  },
});


</script>

<style scoped lang="scss">

</style>
