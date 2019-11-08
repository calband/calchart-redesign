<template>
<b-modal
v-bind:active.sync="settingsModal"
full-screen
trap-focus
>
  <div class="container">
    <h2 class="is-size-2">Settings</h2>

    <h3 class="is-size-3">Grapher</h3>
    <b-field label="Front hash Y offset">
      <b-numberinput v-model="frontHashOffsetY" min="0" v-bind:max="backHashOffsetY - 1"></b-numberinput>
    </b-field>
    <b-field label="Back hash Y offset">
      <b-numberinput v-model="backHashOffsetY" v-bind:min="frontHashOffsetY + 1" max="256"></b-numberinput>
    </b-field>
    <b-field label="Middle of field">
      <b-numberinput v-model="middleOfField" v-bind:min="0" max="200"></b-numberinput>
    </b-field>
    <div class="field">
      <b-switch v-model="enableFourStepGrid">
        Enable four step grid
      </b-switch>
    </div>

    <footer>
      <b-button type="is-primary" v-on:click="this.close()">Close</b-button>
    </footer>
  </div>
</b-modal>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingsModal',
  computed: {
    settingsModal: {
      get (): boolean {
        return this.$store.state.settingsModal;
      },
      set (enabled: boolean) {
        this.$store.commit('setSettingsModal', enabled);
      }
    },

    frontHashOffsetY: {
      get (): number {
        return this.$store.state.hashMarkOffsetsY[0];
      },
      set (offsetY: number) {
        this.$store.commit('setFrontHash', offsetY);
      }
    },

    backHashOffsetY: {
      get (): number {
        return this.$store.state.hashMarkOffsetsY[1];
      },
      set (offsetY: number) {
        this.$store.commit('setBackHash', offsetY);
      }
    },

    middleOfField: {
      get (): number {
        return this.$store.state.middleOfField;
      },
      set (middle: number) {
        this.$store.commit('setMiddleOfField', middle);
      }
    },

    enableFourStepGrid: {
      get (): boolean {
        return this.$store.state.fourStepGrid;
      },
      set (enabled: boolean) {
        this.$store.commit('setFourStepGrid', enabled)
      }
    },
  }
});
</script>

<style scoped lang="scss">

</style>
