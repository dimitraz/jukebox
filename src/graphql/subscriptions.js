// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const OnCreatePlaylist = gql`
  subscription OnCreatePlaylist {
    onCreatePlaylist {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
      mood
    }
  }
`;
export const OnUpdatePlaylist = gql`
  subscription OnUpdatePlaylist {
    onUpdatePlaylist {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
      mood
    }
  }
`;
export const OnDeletePlaylist = gql`
  subscription OnDeletePlaylist {
    onDeletePlaylist {
      id
      name
      songs {
        nextToken
      }
      createdAt
      description
      username
      mood
    }
  }
`;
export const OnCreateSong = gql`
  subscription OnCreateSong {
    onCreateSong {
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
export const OnUpdateSong = gql`
  subscription OnUpdateSong {
    onUpdateSong {
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
export const OnDeleteSong = gql`
  subscription OnDeleteSong {
    onDeleteSong {
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
