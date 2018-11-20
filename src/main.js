import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Suggestions from "v-suggestions";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import AWSAppSyncClient from "aws-appsync";
import VueApollo from "vue-apollo";
Amplify.configure(config);

Vue.component("suggestions", Suggestions);
Vue.config.productionTip = false;

const client = new AWSAppSyncClient(
  {
    url: config.aws_appsync_graphqlEndpoint,
    region: config.aws_appsync_region,
    auth: {
      // Amazon Cognito user pools using AWS Amplify
      type: config.aws_appsync_authenticationType,
      jwtToken: async () =>
        (await Amplify.Auth.currentSession()).getIdToken().getJwtToken()
    }
  },
  {
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network"
      }
    }
  }
);

const appsyncProvider = new VueApollo({
  defaultClient: client
});

// Install the vue plugin
Vue.use(VueApollo);

new Vue({
  router,
  provide: appsyncProvider.provide(),
  render: h => h(App)
}).$mount("#app");
