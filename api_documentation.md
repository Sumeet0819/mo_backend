# YouTube Music Backend API Documentation

This guide provides all the endpoints required for the frontend to integrate with the YouTube Music backend.

**Base URL**: `http://localhost:3000/api/v1`

---

## 1. System

### `GET /health`
Checks if the API server is up and running.
**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-06-30T17:48:24.000Z"
}
```

---

## 2. Search

### `GET /search`
Searches YouTube for music.
**Query Parameters:**
- `q` (required): The search query (e.g., "lofi hip hop").
- `limit` (optional): Number of results to return (default: `20`).

**Response (200 OK):**
```json
{
  "results": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "duration": 212,
      "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
    }
  ]
}
```

---

## 3. Explore (Trending & Popular)

These endpoints provide curated, popular content using predefined searches.

### `GET /explore/trending`
Returns trending music hits.
**Response (200 OK):** *(Same as `/search`)*
```json
{
  "results": [...]
}
```

### `GET /explore/podcasts`
Returns popular video podcasts.
**Response (200 OK):** *(Same as `/search`)*
```json
{
  "results": [...]
}
```

### `GET /explore/new`
Returns new music releases.
**Response (200 OK):** *(Same as `/search`)*
```json
{
  "results": [...]
}
```

---

## 4. Streaming

### `GET /stream/:videoId`
Streams the audio of the requested YouTube video on the fly.
**Headers:**
- `Range` (optional): Supports standard HTTP Range requests for seeking and scrubbing in the HTML5 `<audio>` player.

**Response (200 OK / 206 Partial Content):**
Returns the raw binary audio stream (typically `audio/mp4` or `audio/webm`).
*Note: You can use this URL directly in your `<audio src="..."></audio>` tag.*

---

## 4. Downloading (Offline Support)

### `POST /downloads`
Enqueues a song to be downloaded permanently to the server.
**Body:**
```json
{
  "videoId": "dQw4w9WgXcQ"
}
```
**Response (202 Accepted):**
```json
{
  "jobId": "uuid-string-here",
  "status": "PENDING"
}
```

### `GET /downloads/queue`
Retrieves the list of all downloads and their current status.
**Response (200 OK):**
```json
{
  "queue": [
    {
      "job_id": "uuid-string-here",
      "video_id": "dQw4w9WgXcQ",
      "status": "DOWNLOADING",
      "progress": 45,
      "error_message": null,
      "created_at": "2026-06-30T18:00:00.000Z"
    }
  ]
}
```

### `DELETE /downloads/:jobId`
Cancels an active download and removes it from the queue.
**Response (200 OK):**
```json
{
  "success": true
}
```

---

## 5. Library Management

These endpoints interact directly with your Supabase database.

### `GET /library/songs`
Retrieves all fully downloaded songs available in your library.
**Response (200 OK):**
```json
{
  "songs": [
    {
      "id": "uuid-string",
      "video_id": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "duration": 212,
      "thumbnail": "https://...",
      "created_at": "2026-06-30T..."
    }
  ]
}
```

### `GET /library/playlists`
Retrieves all user-created playlists.
**Response (200 OK):**
```json
{
  "playlists": [
    {
      "id": "uuid-string",
      "name": "Chill Vibes",
      "created_at": "2026-06-30T..."
    }
  ]
}
```

### `POST /library/playlists`
Creates a new playlist.
**Body:**
```json
{
  "name": "Chill Vibes"
}
```
**Response (201 Created):**
```json
{
  "playlist": {
    "id": "uuid-string",
    "name": "Chill Vibes",
    "created_at": "2026-06-30T..."
  }
}
```

### `POST /library/playlists/:playlistId/songs`
Adds a song to an existing playlist.
**Body:**
```json
{
  "songId": "uuid-string-of-the-song"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "playlist_id": "uuid-string",
    "song_id": "uuid-string",
    "added_at": "2026-06-30T..."
  }
}
```

### `GET /library/history`
Retrieves the user's listening history.
**Response (200 OK):**
```json
{
  "history": [
    {
      "id": "uuid-string",
      "song_id": "uuid-string",
      "played_at": "2026-06-30T...",
      "songs": {
         // Song details object nested here
      }
    }
  ]
}
```

### `POST /library/history`
Records that a song was played (call this when a song starts playing on the frontend).
**Body:**
```json
{
  "songId": "uuid-string-of-the-song"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "song_id": "uuid-string",
    "played_at": "2026-06-30T..."
  }
}
```

### `GET /library/favorites`
Retrieves the user's favorite songs.
**Response (200 OK):**
```json
{
  "favorites": [
    {
      "id": "uuid-string",
      "song_id": "uuid-string",
      "created_at": "2026-06-30T...",
      "songs": {
         // Song details object nested here
      }
    }
  ]
}
```

### `POST /library/favorites`
Adds a song to the favorites list.
**Body:**
```json
{
  "songId": "uuid-string-of-the-song"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "song_id": "uuid-string",
    "created_at": "2026-06-30T..."
  }
}
```

### `DELETE /library/favorites/:songId`
Removes a song from the favorites list.
**Response (200 OK):**
```json
{
  "success": true
}
```
