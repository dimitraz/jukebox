<template>
  <div class="container" style="margin: 0 auto">
    {{ playlist }}
    <suggestions
        v-model="query"
        :options="options"
        :onInputChange="onSongInputChange">
        <div v-on:click="onSongSelected(props.item)" slot="item" slot-scope="props" class="single-item">
          <strong>{{ props.item.name }}</strong>
          - {{ props.item.artist }}
        </div>
    </suggestions>
  
    <div v-for="song in playlistSongs" :key="song.id">
      <div>
      Song name: {{ song.name }} <br />
      Song artist: {{ song.artist }}<br />
      <!-- Song album: {{ song.album }} -->
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
      { artist: "Kings of Convenience", name: "The Build Up", album: "" },
      { artist: "Chicano Batman", name: "Passed you by", album: "" },
      { artist: "Talking Heads", name: "This must be the place", album: "" },
      { artist: "Still Woozy", name: "Wolf Cat", album: "" },
      { artist: "Niel Frances", name: "Dumb Love", album: "" }
    ];
    return {
      query: "",
      songs: songs,
      selectedSong: null,
      options: {},
      playlist: {},
      playlistSongs: []
    };
  },
  methods: {
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
  apollo: {
    playlist: {
      query: () => GetPlaylist,
      update: data => data.getPlaylist,
      variables() {
        return {
          id: this.$route.params.id
        }
      }
    }
  }
};
</script>
