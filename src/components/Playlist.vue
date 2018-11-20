<template>
  <div class="container" style="margin: 0 auto">
    <suggestions
        v-model="query"
        :options="options"
        :onInputChange="onSongInputChange">
        <div v-on:click="onSongSelected(props.item)" slot="item" slot-scope="props" class="single-item">
          <strong>{{ props.item.name }}</strong>
          - {{ props.item.artist }}
        </div>
    </suggestions>

    <div style="margin: 2em 0">
      {{ selectedSong }}
    </div>
  
    <div v-for="song in playlistSongs" :key="song.id">
      <div>
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
import { CreateSong, DeleteSong } from "../graphql/mutations";

export default {
  name: "Playlist",
  data() {
    let songs = [
      { artist: "Kings of Convenience", name: "The Build Up" },
      { artist: "Chicano Batman", name: "Passed you by" },
      { artist: "Talking Heads", name: "This must be the place" },
      { artist: "Still Woozy", name: "Wolf Cat" },
      { artist: "Niel Frances", name: "Dumb Love" }
    ];
    return {
      query: "",
      songs: songs,
      selectedSong: null,
      options: {},
      playlist: {},
      playlistSongs: [],
    };
  },
  methods: {
    removeSong: async function(id) {
      const song = await API.graphql(
        graphqlOperation(DeleteSong, { input: { id: id } })
      );
      const songId = song.data.deleteSong.id;
      this.playlistSongs.splice(this.playlistSongs.findIndex(i => i.id === songId), 1);
    },
    addSong: async function(song) {
      const addSong = await API.graphql(
        graphqlOperation(CreateSong, {
          input: { name: song.name, artist: song.artist, songPlaylistId: this.$route.params.id }
        })
      );
    },
    onSongInputChange(query) {
      if (query.trim().length === 0) {
        return null;
      }

      // return the matching songs as an array
      return this.songs.filter(song => {
        return (
          song.name.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        );
      });
    },
    onSongSelected(item) {
      this.selectedSong = item;
      this.addSong(item);
    },
    onSearchItemSelected(item) {
      this.selectedSearchItem = item;
    }
  },
  async created() {
    const playlist = await API.graphql(
      graphqlOperation(GetPlaylist, { id: this.$route.params.id })
    );
    this.playlist = playlist.data.getPlaylist;
    this.playlistSongs = this.playlist.songs.items;

    // Subscribe to creation of song
    const subscriptionCreate = API.graphql(
      graphqlOperation(OnCreateSong, { songPlaylistId: this.$route.params.id })
    ).subscribe({
      next: song => {
        this.playlistSongs.push(song.value.data.onCreateSong);
      }
    });

    // Subscribe to deletion of song
    const subscriptionDel = API.graphql(
      graphqlOperation(OnDeleteSong, { songPlaylistId: this.$route.params.id })
    ).subscribe({
      next: song => {
        const songId = song.value.data.onDeleteSong.id;
        this.playlistSongs.splice(this.playlistSongs.findIndex(i => i.id === songId), 1);
      }
    });

    // Stop receiving data updates from the subscription
    // subscriptionCreate.unsubscribe();
    // subscriptionDel.unsubscribe();
  }
};
</script>
