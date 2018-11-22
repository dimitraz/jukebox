import Vue from "vue";
import Router from "vue-router";
import Playlist from "./components/Playlist.vue";
import Playlists from "./components/Playlists.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Playlists
    },
    {
      path: "/playlist/:id",
      name: "playlist",
      component: Playlist
    }
  ]
});
