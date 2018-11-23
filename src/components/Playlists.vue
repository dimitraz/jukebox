<template>
  <div class="playlists">
    <!-- <amplify-sign-in></amplify-sign-in> -->

    <div class="header">
      <h1>Playlists</h1>
    </div>

    <div class="grid"> 
      <div  
        class="five column item"
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

        <!-- <p @click="deletePlaylist(playlist.id)" class="text button delete">Delete Playlist</p> -->

      </div>
    </div>

    <div class="grid">
      <div class="five column create offset-one">   
        <h2>Create a playlist</h2>
        <div class="input"><input v-model="playlistName" placeholder="Name"></div>
        <div class="input"><input v-model="playlistDesc" placeholder="Description"></div>
        <div class="submit"><a @click="createPlaylist(playlistName, playlistDesc)">Create Playlist</a></div>
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
    console.log(this.$Amplify)
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

.create {
  display: block;
  margin: 2em 0 4em 0;
  padding: 1em;
}

.submit {
  background: #333;
  padding: 0.5em;
  margin-top: 1em;
}

.submit:hover {
  cursor: pointer;
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
/* .overlay > .close {
  position: absolute;
  display: none;
  width: 30px;
  height: 30px;
  padding: 1em;
}

.image:hover > .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #000;
  opacity: 0.8;
}

.image:hover > .overlay .close {
  display: inline;
} */
</style>
