import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
