import Vue from "vue";
import Router from "vue-router";
import ListPlaylists from "./components/ListPlaylists.vue";
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
      component: ListPlaylists
    },
    {
      path: "/playlist/:id",
      name: "playlist",
      component: Playlist
    },
    {
      path: "/playlists/",
      name: "playlists",
      component: Playlists
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
