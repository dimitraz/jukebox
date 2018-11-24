<template>
  <div class="login">
    <h1>Log in</h1>
    <input v-model="username" placeholder="Username">
    <input v-model="password" type="password" placeholder="Password">
    <a class="link" @click="login()">Submit</a>

    <div :v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: ""
    };
  },
  methods: {
    login() {
      Auth.signIn(this.username, this.password)
        .then(user => {
          localStorage.authenticated = true;
          this.$router.push({name: 'home'})
        })
        .catch(err => this.error = "Unable to log in");
    }
  }
};
</script>

<style scoped>
h1 {
  margin-bottom: 1rem;
}

.login {
  width: 50%;
  margin: 0 auto;
  text-align: center;
  padding: 5em;
}

.error {
  margin-top: 1em;
}

input {
  width: 100%;
  background: none;
  border: 2px solid #eee;
  color: #eee;
  padding: 1em;
  margin-bottom: 1em;
  font-size: 100%;
}
</style>