import axios from 'axios';

// Replace with your actual access token
const ACCESS_TOKEN = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN;

const BASE_URL = 'https://graph.facebook.com/v17.0/search';

export const fetchInterests = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        type: 'adinterest',
        q: query,  // Query string from user input
        limit: 10000,
        locale: 'en_US',
        access_token: ACCESS_TOKEN,  // Use your access token here
      },
    });
    return response.data.data; // Return the list of interests from the response
  } catch (error) {
    console.error('Error fetching interests from Meta API:', error);
    return [];
  }
};
