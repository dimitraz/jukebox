<template>
  <div id="app">
    <ListPlaylists />
  </div>
</template>

<script>
import ListPlaylists from "./components/ListPlaylists.vue";

export default {
  name: "app",
  components: {
    ListPlaylists
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
