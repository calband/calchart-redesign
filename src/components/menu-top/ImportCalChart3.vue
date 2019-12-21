<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">
        Import Calchart3
      </p>
    </header>

    <section class="modal-card-body">
      <b-field label="Show title"/>
      <b-field class="file">
        <b-upload v-model="file" accept='.shw' @input="$parent.close()">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Click to upload</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">
            {{ file.name }}
        </span>
      </b-field>

    </section>

    <footer class="modal-card-foot">
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
import LoadShow from '@/models/util/ParseCalChart3File';

export default Vue.extend({
  name: 'ImportCalChart3',
  computed: {
    file: {
      get() {
        return null;
      },
      set(file) {
        const reader = new FileReader();
        let myStore = this.$store;
        reader.onload = function(e) {
          // The file's text will be printed here
          if (e.target) {
            if (e.target.result instanceof ArrayBuffer) {
              let show = LoadShow(e.target.result);
              myStore.commit('setShow', show);
            }
          }
        };
        if (file instanceof Blob) {
          reader.readAsArrayBuffer(file);
        }
      },
    },
  },
});
</script>

<style scoped lang="scss">

</style>
