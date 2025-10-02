import axios from 'axios';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // or hardcode for testing

export const fetchChannels = async (searchQuery) => {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: searchQuery,
      type: 'channel',
      maxResults: 5, // or more
      key: YOUTUBE_API_KEY
    }
  });
  return response.data.items;
};
