import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import { GlobalStore } from './store';

Vue.config.productionTip = false;

Vue.use(Buefy);

const app = new Vue({
  store: GlobalStore,
  render: h => h(App),
}).$mount('#app');

// Make the Vue instance available to Cypress e2e tests
if ((window as any).Cypress) {
  (window as any).app = app;
}
