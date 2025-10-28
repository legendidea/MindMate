
import { SpotifyPlaylist } from '../types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function searchPlaylists(query: string, accessToken: string): Promise<SpotifyPlaylist | null> {
  try {
    // Step 1: Search for the playlist to get its ID
    const searchResponse = await fetch(`${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=playlist&limit=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (searchResponse.status === 401) {
      // Token may have expired. In a more complex app, we'd handle token refresh here.
      // For now, we'll let the user re-authenticate.
      localStorage.removeItem('spotify_access_token');
      window.location.reload(); // Simplest way to reset state
      return null;
    }

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('Spotify API Search Error:', errorData);
      throw new Error('Failed to search for playlists on Spotify');
    }

    const searchData = await searchResponse.json();
    if (!searchData.playlists || searchData.playlists.items.length === 0) {
      return null; // No playlist found
    }
    
    const playlistId = searchData.playlists.items[0].id;

    // Step 2: Fetch detailed information for that playlist, including tracks
    const fields = 'name,description,external_urls,images,tracks.items(track(name,artists(name)))';
    const playlistResponse = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}?fields=${encodeURIComponent(fields)}&limit=3`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!playlistResponse.ok) {
        const errorData = await playlistResponse.json();
        console.error('Spotify API Playlist Fetch Error:', errorData);
        throw new Error('Failed to fetch playlist details from Spotify');
    }

    const playlistData: SpotifyPlaylist = await playlistResponse.json();
    
    // The description can contain HTML entities, let's decode them for clean display
    if (playlistData.description) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = playlistData.description;
        playlistData.description = tempDiv.textContent || tempDiv.innerText || "";
    }

    return playlistData;

  } catch (error) {
    console.error("Error in searchPlaylists:", error);
    throw error;
  }
}