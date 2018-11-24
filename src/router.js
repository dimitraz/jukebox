import Vue from "vue";
import Router from "vue-router";
import Login from "./components/Login.vue";
import Playlist from "./components/Playlist.vue";
import Playlists from "./components/Playlists.vue";

Vue.use(Router);

const router = new Router({
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
    },
    {
      path: "/login",
      name: "login",
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    if (!localStorage.authenticated) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
