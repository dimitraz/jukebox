export const GetPlaylist = `
  query GetPlaylist($id: ID!) {
    getPlaylist(id: $id) {
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
export const ListPlaylists = `
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
      }
      nextToken
    }
  }
`;
export const GetSong = `
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
export const ListSongs = `
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
