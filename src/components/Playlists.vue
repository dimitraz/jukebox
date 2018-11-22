<template>
  <div class="playlists">
    <h1>Playlists</h1>
    <input v-model="playlistName" placeholder="Playlist Name" class="input">
    <button @click="createPlaylist()" class="playlistButton">Create Playlist</button>
    <ul>
      <li
        class="playlist"
        v-for="(playlist, index) in playlists" :key="index">
        <p class="text">{{ playlist.name }}</p>
        <p class="text">{{ playlist.username }}</p>
        <p @click="deletePlaylist(playlist)" class="text button delete">Delete Playlist</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { CreatePlaylist, DeletePlaylist } from "../graphql/mutations";
import { ListPlaylists } from "../graphql/queries";
import { Auth } from "aws-amplify";

export default {
  name: "Tasks",
  methods: {
    createPlaylist() {
      const playlist = {
        input: {
          name: "hello"
        }
      };
      this.$apollo
        .mutate({
          mutation: CreatePlaylist,
          variables: playlist,
          update: (store, { data: { createPlaylist } }) => {
            const data = store.readQuery({ query: ListPlaylists });
            data.listPlaylists.items.push(createPlaylist);
            store.writeQuery({ query: ListPlaylists, data });
          },
          optimisticResponse: {
            __typename: "Mutation",
            createPlaylist: {
              __typename: "Playlist",
              id: "lol",
              ...playlist.input
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error("error!!!: ", error));
    },
    deletePlaylist(playlist) {
      this.$apollo
        .mutate({
          mutation: DeletePlaylist,
          variables: {
            input: {
              id: playlist.id
            }
          },
          update: (store, { data: { deletePlaylist } }) => {
            const data = store.readQuery({ query: ListPlaylists });
            data.listPlaylists.items = data.listPlaylists.items.filter(
              item => item.id !== deletePlaylist.id
            );
            store.writeQuery({ query: ListPlaylists, data });
          },
          optimisticResponse: {
            __typename: "Mutation",
            deletePlaylist: {
              __typename: "Playlist",
              ...playlist
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  },
  async created() {
    const user = await Auth.currentAuthenticatedUser();
    this.username = user.username;
  },
  data() {
    return {
      playlistName: "",
      playlists: [],
      username: ""
    };
  },
  apollo: {
    playlists: {
      query: ListPlaylists,
      update: data => data.listPlaylists.items,
      variables() {
        return {
          filter: {
            username: {
              eq: this.username
            }
          }
        };
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}

.playlistButton {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #2196f3;
  border: none;
  color: white;
  outline: none;
}
.input {
  width: 100%;
  padding: 8px;
  font-size: 18px;
  border: none;
  border-bottom: 2px solid #2196f3;
  outline: none;
}
.button {
  cursor: pointer;
}
.button:hover {
  opacity: 0.5;
}
.text {
  margin-top: 4px;
  margin-bottom: 0px;
}
.delete {
  color: #2196f3;
}
.playlist {
  display: block;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding-top: 8px;
  padding-bottom: 9px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
