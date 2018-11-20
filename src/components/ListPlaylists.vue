<template>
  <div class="hello">
    <div v-for="playlist in playlists" :key="playlist.id">
      {{ playlist.name }}
      {{ playlist.description }}
      <router-link :to="{ name: 'playlist', props: { id: playlist.id }, params: { id: playlist.id }}">Playlist</router-link>
    </div>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
// import { print as gqlToString } from 'graphql/language';
import { ListPlaylists } from "../graphql/queries";

export default {
  name: "ListPlaylists",
  data() {
    return {
      playlists: []
    };
  },
  async beforeCreate() {
    const data = await API.graphql(graphqlOperation(ListPlaylists));
    this.playlists = data.data.listPlaylists.items;
  },
  async created() {
    // let creds = await Auth.currentUserCredentials(); 
  }
};
</script>
