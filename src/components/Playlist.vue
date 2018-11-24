<template>
  <div>
    <div class="grid playlist"> 
      <!-- Display playlist info -->
      <div class="two column item">
        <div style="padding:1em">
        <img src="@/assets/1.png" width="300px" height="300px" alt="">
        </div>
      </div>

      <div class="three column item">
        <div class="padding">
          <div class="meta">
            <h1>{{ playlist.name }}</h1>
            Created by: {{ playlist.username }} <br>
            Created on: {{ playlist.createdAt.substring(0, 10) }}
          </div>
        </div>
      </div>

      <!-- Display songs -->
      <div class="seven column item" style="display: block; background: #222; height: 100%;">
        <div class="padding">
          <!-- Suggestion box -->
          <h2>Add song</h2>
          <div>
            <suggestions
              v-model="query"
              :options="options"
              :onInputChange="onSongInputChange">

              <div v-on:click="onSongSelected(props.item)" slot="item" slot-scope="props" class="single-item">
                <strong>{{ props.item.name }}</strong>
                - {{ props.item.artist }}
              </div>
            </suggestions>
          </div>

          <!-- Song queue -->
          <h2 class="margin">Song Queue</h2>
              
          <div 
            v-for="(song, index) in playlistSongs" :key="song.id"
            v-bind:class="[index % 2 == 0 ? 'item-alt' : '']"
            class="item">

            <!-- Song item grid -->
            <div class="grid">
              <div class="eleven column">
                <div class="bold">{{ song.name }}</div>
                <div>
                  {{ song.artist }} &middot; {{ song.username }}
                </div>
              </div>

              <div class="one column">
                <img @click="removeSong(song.id)" class="remove" src="@/assets/close.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
import axios from "axios";
import { GetPlaylist } from "../graphql/queries";
import { OnCreateSong, OnDeleteSong } from "../graphql/subscriptions";
import { CreateSong, DeleteSong } from "../graphql/mutations";
import * as _ from "lodash";
import gql from "graphql-tag";
import songs from "@/assets/songs.json";

export default {
  name: "Playlist",
  data() {
    return {
      query: "",
      songs: songs,
      selectedSong: null,
      options: {},
      playlist: {},
      playlistSongs: []
    };
  },
  created() {
    const headers = {
      "X-Requested-With": "*",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,GET,OPTIONS"
    };
    axios
      .post("", {
        lyrics: "",
        headers: headers
      })
      .then(function(res) {
        console.log(res);
      })
      .catch(function(error) {
        console.log(error);
      });
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
    },
    removeEmptyFields(obj) {
      for (var prop in obj) {
        if (typeof obj[prop] === "object") {
          removeEmptyFields(obj[prop]);
        } else if (obj[prop] === "") {
          delete obj[prop];
        }
      }
      return obj;
    },
    addSong(song) {
      this.$apollo
        .mutate({
          mutation: CreateSong,
          variables: {
            input: {
              ...this.removeEmptyFields(song),
              songPlaylistId: this.$route.params.id
            }
          },
          update: (store, { data: { createSong } }) => {
            const data = store.readQuery({
              query: GetPlaylist,
              variables: { id: this.$route.params.id }
            });
            data.getPlaylist.songs.items.push(createSong);
            store.writeQuery({
              query: GetPlaylist,
              data: data,
              variables: { id: this.$route.params.id }
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            createSong: {
              __typename: "Song",
              id: "lol",
              ...song
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    },
    removeSong(songId) {
      this.$apollo
        .mutate({
          mutation: DeleteSong,
          variables: {
            input: {
              id: songId
            }
          },
          update: (store, { data: { deleteSong } }) => {
            const data = store.readQuery({
              query: GetPlaylist,
              variables: { id: this.$route.params.id }
            });
            data.getPlaylist.songs.items = data.getPlaylist.songs.items.filter(
              item => item.id !== songId
            );
            store.writeQuery({
              query: GetPlaylist,
              data: data,
              variables: { id: this.$route.params.id }
            });
          },
          optimisticResponse: {
            __typename: "Mutation",
            deleteSong: {
              __typename: "Song",
              id: songId
            }
          }
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    }
  },
  apollo: {
    playlist: {
      query: () => GetPlaylist,
      update(data) {
        this.playlistSongs = _.uniqBy(data.getPlaylist.songs.items, "id");
        return data.getPlaylist;
      },
      variables() {
        return {
          id: this.$route.params.id
        };
      },
      subscribeToMore: {
        document: OnCreateSong,
        updateQuery(previousResult, { subscriptionData }) {
          const newSong = subscriptionData.data.onCreateSong;

          // If we added the song already don't do anything
          // This can be caused by the `updateQuery` of the addSong mutation
          if (
            previousResult.getPlaylist.songs.items.find(
              song => song.id === newSong.id
            )
          ) {
            return previousResult;
          }

          // Return the subscription data
          previousResult.getPlaylist.songs.items.push(newSong);
          this.playlistSongs = previousResult.getPlaylist.songs.items;
          return {
            playlist: previousResult.getPlaylist
          };
        }
      }
    }
  }
};
</script>

<style scoped>
body {
  background: #111 !important;
}

.grid {
  grid-auto-rows: minmax(20px, auto);
}

h1 {
  font-size: 250%;
}

h2 {
  margin-top: 1em;
}

.span,
.text {
  vertical-align: middle;
  display: table-cell;
}

.bold {
  font-weight: bold;
}

.item {
  /* font-size: 90%; */
  padding: 1em;
}

.item-alt {
  background: #1d1d1d;
}

.strong {
  font-weight: bold;
}

.padding {
  padding: 1em;
}

.margin {
  margin-bottom: 1em;
}

.search {
  vertical-align: middle;
  height: 33px;
  margin-right: 5px;
}

.meta {
  background: #222;
  padding: 10px;
  margin-top: 50px;
  margin-left: -30px;
  height: fit-content;
}

.remove {
  width: 20px;
  height: 20px;
  opacity: 0.8;
  display: block;
}

a:hover,
.remove:hover {
  cursor: pointer;
}

.column {
  display: block;
}
</style>