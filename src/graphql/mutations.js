import gql from 'graphql-tag';

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
      }
      artist
      album
      genre
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
      }
      artist
      album
      genre
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
      }
      artist
      album
      genre
    }
  }
`;
