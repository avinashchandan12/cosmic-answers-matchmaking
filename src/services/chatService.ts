
// WARNING: This is a temporary solution. In production, API keys should not be exposed in frontend code
const DEEPSEEK_API_KEY = 'sk-2f7075c883d44d438f0bcb14fd8b1e0e';

export const getChatResponse = async (message: string, onChunk: (chunk: string) => void) => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a Vedic astrology expert providing insights and analysis based on astrological charts and positions.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error from DeepSeek API');
    }

    // Process the stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    let accumulatedResponse = '';
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk
      const chunk = decoder.decode(value, { stream: true });
      
      // Process the chunk (split by lines and parse each as JSON)
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        // Remove the "data: " prefix and handle special cases
        const cleanedLine = line.replace(/^data: /, '').trim();
        
        if (cleanedLine === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(cleanedLine);
          if (parsed.choices && parsed.choices[0]?.delta?.content) {
            const content = parsed.choices[0].delta.content;
            accumulatedResponse += content;
            onChunk(content); // Call the callback with just the new content
          }
        } catch (e) {
          console.error('Error parsing streaming response chunk:', e);
        }
      }
    }
    
    return accumulatedResponse;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
};
