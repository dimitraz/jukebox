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
  background: #111111; /* Old browsers */
  background: -moz-linear-gradient(left, #111111 0%, #1d1d1d 27%, #1d1d1d 27%, #333d56 91%); /* FF3.6-15 */
  background: -webkit-linear-gradient(left, #111111 0%,#1d1d1d 27%,#1d1d1d 27%,#333d56 91%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to right, #111111 0%,#1d1d1d 27%,#1d1d1d 27%,#333d56 91%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#111111', endColorstr='#333d56',GradientType=1 ); /* IE6-9 */
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
  font-weight: bold;
}

input {
  color: #eee;
}
</style>
