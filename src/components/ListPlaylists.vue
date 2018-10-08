<template>
  <div class="hello">
    <div v-for="playlist in playlists" :key="playlist.id">
      {{ playlist.name }}
    </div>
  </div>
</template>

<script>
import { API, graphqlOperation } from "aws-amplify";

const ListPlaylists = `
  query {
    listPlaylists {
      items {
        id name description
      }
    }
  }
`;

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
  }
};
</script>