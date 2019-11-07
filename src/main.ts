import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
