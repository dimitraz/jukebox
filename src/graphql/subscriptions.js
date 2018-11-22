import gql from 'graphql-tag';

export const OnCreatePlaylist = gql`
  subscription OnCreatePlaylist {
    onCreatePlaylist(songPlaylistId: ID) {
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
    }
  }
`;
export const OnDeletePlaylist = gql`
  subscription OnDeletePlaylist {
    onDeletePlaylist(songPlaylistId: ID) {
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
export const OnCreateSong = gql`
  subscription OnCreateSong {
    onCreateSong {
      id
      name
      artist
      album
      genre
      playlist {
          id
          name
          createdAt
          description
      }
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
      }
      artist
      album
      genre
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
      }
      artist
      album
      genre
    }
  }
`;
