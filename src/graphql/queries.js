import gql from 'graphql-tag';

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
        }
      }
      createdAt
      description
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
      }
      artist
      album
      genre
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
      }
      nextToken
    }
  }
`;
