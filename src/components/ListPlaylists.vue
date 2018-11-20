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
import { ListPlaylists } from "../graphql/queries";

export default {
  name: "ListPlaylists",
  data() {
    return {
      playlists: []
    };
  },
  apollo: {
    playlists: {
      query: () => ListPlaylists,
      update: data => data.listPlaylists.items
    }
  }
};
</script>
