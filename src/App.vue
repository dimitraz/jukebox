<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Jukebox</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  data: () => ({ hydrated: false }),
  async mounted() {
    await this.$apollo.provider.defaultClient.hydrated();
    this.hydrated = true;
  }
};
</script>

<style>
body {
  background: #222;
  margin: 0;
}

h1,
h2 {
  padding: 0;
  margin: 0;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

a {
  color: #eee;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #eee;
}

#nav {
  padding: 30px;
  background: #111;
}

input {
  color: #eee;
}
</style>
