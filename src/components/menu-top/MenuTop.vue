<template>
  <div class="menu-top">
    <b-navbar type="is-primary">
      <template slot="end">
        <b-navbar-item v-on:click="enableSettingsModal">
          Settings
        </b-navbar-item>
      </template>
    </b-navbar>
    <SettingsModal/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingsModal from './SettingsModal.vue';

export default Vue.extend({
  name: 'MenuTop',
  components: {
    SettingsModal
  },
  methods: {
    enableSettingsModal (): void {
      this.$store.commit('setSettingsModal', true);
    }
  }
});
</script>

<style scoped lang="scss">
.menu-top {
  flex: 0 0;
}
</style>
