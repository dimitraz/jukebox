<template>
  <div class="container">
    <div v-for="song in songs" :key="song.id">
      <div class="md-elevation-1">
      Song name: {{ song.name }} <br />
      Song id: {{ song.id }}<br />
      <!-- Song artist: {{ song.artist }}<br />
      Song album: {{ song.album }} -->
      </div>
      <div style="padding-bottom: 2em;">
        <a v-on:click="removeSong(song.id)">Remove</a>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
import { OnCreateSong } from "../graphql/subscriptions";

export default {
  name: "Playlist",
  data() {
    return {
      songs: []
    };
  },
  methods: {
    removeSong: async function(id) {
      const data = await API.graphql(graphqlOperation(DeleteSong(id)));
      const songId = data.data.deleteSong.id;
      this.songs.splice(this.songs.findIndex(i => i.id === songId), 1);
    }
  },
  async created() {
    // Subscribe to creation of song
    const subscription = API.graphql(
      graphqlOperation(OnCreateSong)
    ).subscribe({
      next: song => console.log(song.value.data.onCreateSong)
    });

    // Stop receiving data updates from the subscription
    // subscription.unsubscribe();
  }
};
</script>
