<template>
  <div>
    <div class="grid playlist"> 
      <div class="two column item">
        <img src="@/assets/1.png" width="300px" height="300px" alt="">
      </div>

      <div class="three column item">
        <div class="meta">
          <h1>{{ playlist.name }}</h1>
          Created by: {{ playlist.username }} <br>
          <a @click="deletePlaylist(playlist.id)" class="text button delete">Delete Playlist</a>
        </div>
      </div>

      <div class="four column item" style="display: block">
        <h2> 
          <img src="@/assets/search.png" class="search" alt="">
          <span class="text">Add song</span>
        </h2>
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
      </div>
    </div>

    <!-- grid names -->
    <div class="grid gutter-two item strong">
      <div class="two column offset-one">Song name</div>
      <div class="two column">Artist</div>
      <div class="two column">Album</div>
      <div class="two column">User</div>
    </div>

    <!-- grid items -->
    <div 
      v-for="(song, index) in playlistSongs" :key="song.id"
      v-bind:class="[index % 2 == 0 ? 'item-alt' : '']"
      class="item">
      <div class="grid gutter-two">
        <div class="two column offset-one">{{ song.name }}</div>
        <div class="two column">{{ song.artist }}</div>
        <div class="two column">{{ song.album }}</div>
        <div class="two column">{{ song.id }}</div>
        <div class="two column"><a v-on:click="removeSong(song.id)">Remove</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, API, graphqlOperation } from "aws-amplify";
import { GetPlaylist } from "../graphql/queries";
import { OnCreateSong, OnDeleteSong } from "../graphql/subscriptions";
import { CreateSong, DeleteSong } from "../graphql/mutations";
import * as _ from "lodash";
import gql from "graphql-tag";

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

<style>
.grid {
  grid-auto-rows: minmax(20px, auto);
}

h1 {
  font-size: 250%;
}

h2 {
  margin-bottom: 0.5em;
  display: table;
}

.span,
.text {
  vertical-align: middle;
  display: table-cell;
}

.item {
  padding: 1em 0;
}

.item-alt {
  background: #333;
}

.strong {
  font-weight: bold;
}

.playlist {
  border-top: 2px solid #333;
  padding: 3em;
  background: #111;
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

a:hover {
  cursor: pointer;
}
</style>