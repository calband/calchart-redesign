<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Load Show
      </p>
    </header>

    <section class="modal-card-body">
      <b-field class="file">
        <b-upload v-model="file" accept='.shw' v-on:input="loadShow">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Click to load</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
      </b-field>
      <b-field>
        Marchers: {{ numMarchers }}
      </b-field>
      <b-field>
        Sheets: {{ numSheets }}
      </b-field>

    </section>

    <footer class="modal-card-foot">
      <b-button
        type="is-success"
        data-test="file-modal--import"
        :disabled="!showSet"
        @click="setShow();$parent.close()"
      >
        Import
      </b-button>
      <b-button
        type="is-primary"
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
import { LoadShow } from '@/models/util/LoadShow';
import Show from '@/models/Show';

export default Vue.extend({
  name: 'LoadShow',
  data: (): {
    file: Blob | null,
    show: Show | null,
    showSet: boolean,
  } => ({ file: null, show: null, showSet: false}),
  computed: {
    numMarchers():number {
      return (this.show) ? this.show.dotLabels.length : 0;
    },
    numSheets():number {
      return (this.show) ? this.show.stuntSheets.length : 0;
    }
  },
  methods: {
    loadShow: function() {
      console.log('file is ', this.file);
      if (this.file === null) {
        console.log('file is null');
        return;
      }
      const reader = new FileReader();
      let myStore = this.$store;
      reader.onload = () => {
        // The file's text will be printed here
        if (reader.result && reader.result instanceof ArrayBuffer) {
          const show = LoadShow(reader.result);
          if (show) {
            this.show = show;
            this.showSet = true;
          }
        }
      };
      if (this.file) {
        reader.readAsArrayBuffer(this.file);
      }
    },
    setShow: function() {
      if (!this.show) {
        return;
      }
      this.$store.commit('setShow', this.show);
    }
  }
});



</script>

<style scoped lang="scss">

</style>
