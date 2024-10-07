import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; 

export const fetchGPTResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const gptResponse = response.data.choices[0].message.content.trim();

    // Clean the response: remove numbering, dashes, and introductory text
    const cleanedResponse = gptResponse
      .split('\n')
      .map(item => item.replace(/^[-\d. ]+/, '').trim()) // Remove numbering, dashes, and trim spaces
      .filter(item => item && !item.toLowerCase().includes('sure') && !item.toLowerCase().includes('n/a')); // Remove unwanted text

    return cleanedResponse.map(item => ({
      name: item,
      audience_size_lower_bound: 'N/A', // Audience size not available via OpenAI
      audience_size_upper_bound: 'N/A',
      topic: 'N/A'
    }));
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    throw error;
  }
};
