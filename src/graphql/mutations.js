export const CreatePlaylist = `
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
export const UpdatePlaylist = `
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
export const DeletePlaylist = `
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
export const CreateSong = `
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
export const UpdateSong = `
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
export const DeleteSong = `
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
