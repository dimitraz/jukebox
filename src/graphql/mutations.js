// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const CreatePlaylist = gql`
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
    }
  }
`;
export const UpdatePlaylist = gql`
  mutation UpdatePlaylist($input: UpdatePlaylistInput!) {
    updatePlaylist(input: $input) {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
    }
  }
`;
export const DeletePlaylist = gql`
  mutation DeletePlaylist($input: DeletePlaylistInput!) {
    deletePlaylist(input: $input) {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
    }
  }
`;
export const CreateSong = gql`
  mutation CreateSong($input: CreateSongInput!) {
    createSong(input: $input) {
      id
      name
      playlist {
        id
        name
        createdAt
        description
        username
      }
      artist
      album
      genre
      username
      lyrics
    }
  }
`;
export const UpdateSong = gql`
  mutation UpdateSong($input: UpdateSongInput!) {
    updateSong(input: $input) {
      id
      name
      playlist {
        id
        name
        createdAt
        description
        username
      }
      artist
      album
      genre
      username
      lyrics
    }
  }
`;
export const DeleteSong = gql`
  mutation DeleteSong($input: DeleteSongInput!) {
    deleteSong(input: $input) {
      id
      name
      playlist {
        id
        name
        createdAt
        description
        username
      }
      artist
      album
      genre
      username
      lyrics
    }
  }
`;
