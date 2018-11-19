<template>
  <div class="container">
    <div v-for="song in songs" :key="song.id">
      Song name: {{ song.name }} <br />
      Song desc: {{ song.description }}<br />
      Song artist: {{ song.artist }}<br />
      Song album: {{ song.album }}
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";

const ListSongs = id => {
  return `query listSongs {
    listSongs(filter: {playlistId: {eq: "${id}" }}) {
      items {
        id
        name
        artist
        album
      }
    }
    }`;
};

export default {
  name: "Playlist",
  data() {
    return {
      songs: []
    };
  },
  async created() {
    console.log(this.$route.params.id);
    console.log(ListSongs(this.$route.params.id));
    const data = await API.graphql(
      graphqlOperation(ListSongs(this.$route.params.id))
    );
    console.log(data);
    this.songs = data.data.listSongs.items;
  }
};
</script>
