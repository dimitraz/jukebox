<template>
  <div class="playlists">

    <div class="header">
      <h1>Playlists</h1>
      <div class="input"><input v-model="playlistName" placeholder="Playlist Name"></div> 
      <div class="input"><input v-model="playlistDesc" placeholder="Playlist Description"></div> 
      <button @click="createPlaylist(playlistName)" class="playlistButton">Create Playlist</button>
    </div>

    <div class="grid"> 
      <div  
        class="five column item"
        v-for="(playlist, index) in playlists" :key="playlist.id"
        v-bind:class="[index % 2 == 0 ? 'offset-one' : '']">

        <img src="@/assets/1.png" width="300px" height="300px" alt="">
        <div class="meta">
          <router-link :to="{ name: 'playlist', props: { id: playlist.id }, params: { id: playlist.id }}"><h1>{{ playlist.name }}</h1></router-link>
          Created by: {{ playlist.username }}
        </div>
      
        <!-- <p @click="deletePlaylist(playlist.id)" class="text button delete">Delete Playlist</p> -->

      </div>
    </div>
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
          name: playlistName,
          description: playlistDesc
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
    this.username = user.username;
  },
  data() {
    return {
      playlistName: "",
      playlistDesc: "",
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

<style scoped>
.header {
  padding: 3em;
}

.grid {
  border-bottom: 2px solid #111;
}

.grid image {
  flex: 0 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.meta {
  background: #222;
  padding: 10px;
  margin-top: 20px;
  margin-left: -40px;
  height: fit-content;
}

.item {
  margin-bottom: 2em;
}

h1 {
  margin: 0;
  padding: 0;
}
</style>
