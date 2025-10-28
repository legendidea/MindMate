
import React from 'react';
import { LogoIcon } from './icons';
import SpotifyAuth from './SpotifyAuth';

interface HeaderProps {
    isSpotifyConnected: boolean;
    onSpotifyConnect: () => void;
    onSpotifyDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ isSpotifyConnected, onSpotifyConnect, onSpotifyDisconnect }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-10 h-10 text-brand-primary" />
          <div>
            <h1 className="text-2xl font-bold text-brand-text">MindMate</h1>
            <p className="text-sm text-brand-subtle">Your AI Mood Translator</p>
          </div>
        </div>
        <SpotifyAuth
          isConnected={isSpotifyConnected}
          onConnect={onSpotifyConnect}
          onDisconnect={onSpotifyDisconnect}
        />
      </div>
    </header>
  );
};

export default Header;
