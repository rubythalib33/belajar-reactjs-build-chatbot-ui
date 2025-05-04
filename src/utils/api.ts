import axios from 'axios';

// Make API request to ChatGPT
export const sendChatMessage = async (messages: Array<{ role: string, content: string }>) => {
  try {
    // Replace with your own API endpoint and key
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          // Add system message to instruct markdown formatting
          {
            role: 'system',
            content: 'You are a helpful assistant. Format your responses using Markdown syntax when appropriate. Use code blocks with language specification for code, tables for tabular data, and other markdown features to make your responses clear and well-formatted.'
          },
          ...messages
        ],
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
};