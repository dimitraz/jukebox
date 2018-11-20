<template>
  <div class="container">
    <!-- {{ playlist }}  -->
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
import { GetPlaylist } from "../graphql/queries";
import { OnCreateSong, OnDeleteSong } from "../graphql/subscriptions";
import { DeleteSong } from "../graphql/mutations";

export default {
  name: "Playlist",
  data() {
    return {
      songs: [],
      playlist: {}
    };
  },
  methods: {
    removeSong: async function(id) {
      console.log(id);
      const song = await API.graphql(
        graphqlOperation(DeleteSong, { input: { id: id } })
      );
      const songId = song.data.deleteSong.id;
      this.songs.splice(this.songs.findIndex(i => i.id === songId), 1);
    }
  },
  async created() {
    const playlist = await API.graphql(
      graphqlOperation(GetPlaylist, { id: this.$route.params.id })
    );
    this.playlist = playlist.data.getPlaylist;
    this.songs = this.playlist.songs.items;
    // console.log(playlist.data.getPlaylist)

    // Subscribe to creation of song
    const subscriptionCreate = API.graphql(
      graphqlOperation(OnCreateSong, { songPlaylistId: this.$route.params.id })
    ).subscribe({
      next: song => {
        this.songs.push(song.value.data.onCreateSong);
      }
    });

    // Subscribe to deletion of song
    const subscriptionDel = API.graphql(
      graphqlOperation(OnDeleteSong, { songPlaylistId: this.$route.params.id })
    ).subscribe({
      next: song => {
        console.log(song)
        const songId = song.value.data.onDeleteSong.id;
        this.songs.splice(this.songs.findIndex(i => i.id === songId), 1);
      }
    });

    // Stop receiving data updates from the subscription
    // subscriptionCreate.unsubscribe();
    // subscriptionDel.unsubscribe();
  }
};
</script>
