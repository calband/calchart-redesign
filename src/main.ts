import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Buefy);

const app = new Vue({
  store,
  render: h => h(App),
}).$mount('#app');

if ((window as any).Cypress) {
  // Make Vue instance accesible to Cypress tests
  (window as any).app = app;
}
