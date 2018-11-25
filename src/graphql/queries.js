// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const GetPlaylist = gql`
  query GetPlaylist($id: ID!) {
    getPlaylist(id: $id) {
      id
      name
      songs {
        items {
          id
          name
          artist
          album
          genre
          username
          lyrics
        }
      }
      createdAt
      description
      username
      mood
    }
  }
`;
export const ListPlaylists = gql`
  query ListPlaylists(
    $filter: ModelPlaylistFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlaylists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        description
        username
        mood
      }
      nextToken
    }
  }
`;
export const GetSong = gql`
  query GetSong($id: ID!) {
    getSong(id: $id) {
      id
      name
      playlist {
        id
        name
        createdAt
        description
        username
        mood
      }
      artist
      album
      genre
      username
      lyrics
    }
  }
`;
export const ListSongs = gql`
  query ListSongs(
    $filter: ModelSongFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSongs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        artist
        album
        genre
        username
        lyrics
      }
      nextToken
    }
  }
`;
