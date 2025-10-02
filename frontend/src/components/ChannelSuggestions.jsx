import React, { useState } from 'react';
import { fetchChannels } from '../services/youtubeApi';

const ChannelSuggestions = () => {
  const [query, setQuery] = useState('');
  const [channels, setChannels] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const results = await fetchChannels(query);
    setChannels(results);
  };

  return (
    <div style={{ color: "#fff", maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>YouTube Channel Suggestions</h2>
      <div style={{ marginBottom: 24 }}>
        <input
          style={{
            padding: '8px 12px',
            borderRadius: 4,
            border: 'none',
            marginRight: 12,
            width: 220,
            fontSize: 16
          }}
          type="text"
          placeholder="Search for a role/channel..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          style={{
            padding: '8px 18px',
            borderRadius: 4,
            border: 'none',
            background: '#4c51bf',
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer'
          }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {channels.map((channel) => (
          <li
            key={channel.id.channelId}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 22,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.07)',
              padding: 10
            }}
          >
            <img
              src={channel.snippet.thumbnails.default.url}
              alt={channel.snippet.title}
              style={{
                width: 44,
                height: 44,
                borderRadius: '100%',
                marginRight: 18,
                background: "#fff"
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>
                {channel.snippet.title}
              </div>
              <div style={{ fontSize: 14, color: '#b3b3b3' }}>
                {channel.snippet.channelTitle || channel.snippet.title}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelSuggestions;
