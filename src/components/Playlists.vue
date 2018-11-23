<template>
  <div class="playlists">
    <!-- Create playlist modal -->
    <modal name="create-playlist" height="auto" width="500px" style="background: #333;">
      <div class="modal-content">
        <h2>Create Jukebox</h2>
        <div class="input"><input v-model="playlistName" placeholder="Name"></div>
        <div class="input"><input v-model="playlistDesc" placeholder="Description"></div>
      </div>
      <div class="btn"><a @click="createPlaylist(playlistName, playlistDesc)">Create Playlist</a></div>
      <!-- <div class="btn"><a>Cancel</a></div> -->
    </modal>

    <div class="header">
      <h1>My Jukeboxes</h1>
      <a @click="show()">Add Jukebox</a> &middot; Join Jukebox
    </div>

    <div class="grid"> 
      <div  
        class="five column block"
        v-for="(playlist, index) in playlists" :key="playlist.id"
        v-bind:class="[index % 2 == 0 ? 'offset-one' : '']">
  
        <span class="overlay">
          <img @click="deletePlaylist(playlist.id)" src="@/assets/close.png" class="close" alt="">
          <img src="@/assets/1.png" width="300px" height="300px" alt="">
        </span>

        <div class="meta">
          <router-link :to="{ name: 'playlist', props: { id: playlist.id }, params: { id: playlist.id }}"><h1>{{ playlist.name }}</h1></router-link>
          Created by: {{ playlist.username }}
        </div>
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
    show() {
      this.$modal.show("create-playlist");
    },
    createPlaylist(playlistName, playlistDesc) {
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
      this.playlistName = ""
      this.playlistDesc = ""
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
        this.$modal.hide("create-playlist");
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

<style>
.header {
  padding: 3em;
}

.grid image {
  flex: 0 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.meta {
  background: #1d1d1d;
  padding: 10px;
  margin-top: 20px;
  margin-left: -40px;
  height: fit-content;
}

.block {
  margin-bottom: 2em;
}

.create {
  display: block;
  margin: 2em 0 4em 0;
  padding: 1em;
}

.btn {
  padding: 1rem;
  width: 50%;
  display: inline-block;
  box-sizing: border-box;
  border-top: 1px solid #333;
}

h3 {
  margin: 0 0 0.5em 0;
}

.btn a {
  color: #aaa;
}

.btn:not(:first-of-type) {
  border-left: 1px solid #333;
}

.btn:hover {
  cursor: pointer;
  background: #1e1e1e;
}

h1 {
  margin: 0;
  padding: 0;
}

.close {
  width: 30px;
  height: 30px;
  position: absolute;
  display: none;
  padding: 0.5em;
}

.overlay:hover {
  opacity: 0.3;
}

.overlay:hover .close {
  display: inline;
  cursor: pointer;
}

.modal-content {
  padding: 1.5em;
}

.v--modal {
  font-size: 80%;
  border: 1px solid #333;
  background: #222 !important;
  padding: 1em;
}

.vue-dialog .vue-dialog-buttons,
.vue-dialog-button:not(:first-of-type) {
  background: #222 !important;
  border-color: #333 !important;
}

.v--modal-overlay {
  background: rgba(0, 0, 0, 0.6) !important;
}
</style>
