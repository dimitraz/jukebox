<template>
  <div class="container">
    <div v-for="song in songs" :key="song.id">
      <div class="md-elevation-1">
      Song name: {{ song.name }} <br />
      Song desc: {{ song.description }}<br />
      Song artist: {{ song.artist }}<br />
      Song album: {{ song.album }}
      </div>
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

const NewSong = id => {
  return `subscription get {
    playlistUpdated(playlistId: "${id}") {
      id
      artist
      name
      genre
    }
  }`;
};

const DeletedSong = id => {
  return `subscription delete {
    onDeleteSong(playlistId: "${id}") {
      id
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
    const data = await API.graphql(
      graphqlOperation(ListSongs(this.$route.params.id))
    );
    this.songs = data.data.listSongs.items;

    // Subscribe to song create
    const subscribeCreate = API.graphql(
      graphqlOperation(NewSong(this.$route.params.id))
    ).subscribe({
      next: song => this.songs.push(song.value.data.playlistUpdated)
    });

    // Subscribe to song delete
    const subscribeDelete = API.graphql(
      graphqlOperation(DeletedSong(this.$route.params.id))
    ).subscribe({
      next: song => {
        const songId = song.value.data.onDeleteSong.id;
        this.songs.splice(this.songs.findIndex(i => i.id === songId), 1);
      }
    });

    // Stop receiving data updates from the subscription
    // subscribeCreate.unsubscribe();
    // subscribeDelete.unsubscribe();
  }
};
</script>
