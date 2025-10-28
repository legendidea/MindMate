
import { useState, useEffect, useCallback } from 'react';

// IMPORTANT: In a real-world app, these should be environment variables.
const CLIENT_ID = '3a4c49859f754751855905d415b3c54a'; // A sample public client ID
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPES = 'user-read-private user-read-email';

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('spotify_access_token'));

  const login = async () => {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem('spotify_code_verifier', codeVerifier);
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);
    
    const args = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });
    
    window.location.href = `${SPOTIFY_AUTH_URL}?${args}`;
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_auth_state');
  };

  const getAccessToken = useCallback(async (code: string, codeVerifier: string) => {
    try {
      const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch access token');
      }

      const data = await response.json();
      localStorage.setItem('spotify_access_token', data.access_token);
      setAccessToken(data.access_token);
      
      // Clean up URL
      window.history.pushState({}, '', REDIRECT_URI);
    } catch (error) {
      console.error("Error getting access token", error);
      logout();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = localStorage.getItem('spotify_auth_state');
    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    
    if (code && state === storedState && codeVerifier) {
      getAccessToken(code, codeVerifier);
    } else if (params.get('error')) {
      console.error("Spotify login error:", params.get('error'));
      window.history.pushState({}, '', REDIRECT_URI);
    }

  }, [getAccessToken]);

  return { accessToken, login, logout };
};
