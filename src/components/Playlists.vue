<template>
  <div class="playlists">
    <h1>Playlists</h1>
    <input v-model="playlistName" placeholder="Playlist Name" class="input">
    <button @click="createPlaylist(playlistName)" class="playlistButton">Create Playlist</button>
    <ul>
      <li
        class="playlist"
        v-for="(playlist, index) in playlists" :key="index">
        <p class="text">{{ playlist.name }}</p>
        <p class="text">{{ playlist.username }}</p>
        <p @click="deletePlaylist(playlist.id)" class="text button delete">Delete Playlist</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { CreatePlaylist, DeletePlaylist } from "../graphql/mutations";
import { ListPlaylists } from "../graphql/queries";
import { Auth } from "aws-amplify";
import * as _ from "lodash";

export default {
  name: "Tasks",
  methods: {
    createPlaylist(playlistName) {
      const playlist = {
        input: {
          name: playlistName
        }
      };
      const currentUser = {
        filter: {
          username: {
            eq: this.username
          }
        }
      };
      this.$apollo
        .mutate({
          mutation: CreatePlaylist,
          variables: playlist,
          update: (store, { data: { createPlaylist } }) => {
            const data = store.readQuery({
              query: ListPlaylists,
              variables: currentUser
            });
            data.listPlaylists.items.push(createPlaylist);
            store.writeQuery({
              query: ListPlaylists,
              data: data,
              variables: currentUser
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            createPlaylist: {
              __typename: "Playlist",
              id: "test_id",
              ...playlist.input
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error("error!!!: ", error));
    },
    deletePlaylist(playlistId) {
      const currentUser = {
        filter: {
          username: {
            eq: this.username
          }
        }
      };
      this.$apollo
        .mutate({
          mutation: DeletePlaylist,
          variables: {
            input: {
              id: playlistId
            }
          },
          update: (store, { data: { deletePlaylist } }) => {
            const data = store.readQuery({
              query: ListPlaylists,
              variables: currentUser
            });
            data.listPlaylists.items = data.listPlaylists.items.filter(
              item => item.id !== playlistId
            );
            store.writeQuery({
              query: ListPlaylists,
              data: data,
              variables: currentUser
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            deletePlaylist: {
              __typename: "Playlist",
              id: playlistId
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  },
  async created() {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user);
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
      update(data) {
        return _.uniqBy(data.listPlaylists.items, "id");
      },
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
