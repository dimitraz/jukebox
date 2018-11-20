export const OnCreatePlaylist = `
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
export const OnUpdatePlaylist = `
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
export const OnDeletePlaylist = `
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
export const OnCreateSong = `
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
export const OnUpdateSong = `
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
export const OnDeleteSong = `
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
