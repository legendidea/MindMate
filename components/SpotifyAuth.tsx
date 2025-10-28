
import React from 'react';
import { SpotifyIcon } from './icons';

interface SpotifyAuthProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ isConnected, onConnect, onDisconnect }) => {
  if (isConnected) {
    return (
      <button
        onClick={onDisconnect}
        className="flex items-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition duration-200 text-sm"
        title="Disconnect your Spotify account"
      >
        <SpotifyIcon className="w-5 h-5" />
        Disconnect
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="flex items-center gap-2 bg-[#1DB954] text-white font-semibold py-2 px-4 rounded-full hover:bg-[#1ED760] transition duration-200 text-sm"
      title="Connect your Spotify account to get music suggestions"
    >
      <SpotifyIcon className="w-5 h-5" />
      Connect Spotify
    </button>
  );
};

export default SpotifyAuth;
