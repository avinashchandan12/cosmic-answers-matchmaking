
// WARNING: This is a temporary solution. In production, API keys should not be exposed in frontend code
const DEEPSEEK_API_KEY = 'sk-2f7075c883d44d438f0bcb14fd8b1e0e';

export const getChatResponse = async (message: string) => {
  try {
    // Using Supabase edge function instead of direct API call for better security
    const response = await fetch(`${window.location.origin}/functions/v1/chat-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        currentDateTime: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get chat response');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response stream available');
    }
    
    let fullResponse = '';
    
    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk
      const chunk = new TextDecoder().decode(value);
      
      // Split by newlines (if multiple JSON objects were sent)
      const jsonStrings = chunk.split('\n').filter(str => str.trim());
      
      for (const jsonStr of jsonStrings) {
        try {
          const data = JSON.parse(jsonStr);
          
          // Check for error message
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Handle complete response
          if (data.response || data.done) {
            fullResponse = data.response || data.fullResponse || '';
            return fullResponse;
          }
          
          // Handle streaming updates (we'll accumulate them here)
          if (data.fullResponse) {
            fullResponse = data.fullResponse;
          } else if (data.delta) {
            fullResponse += data.delta;
          }
        } catch (error) {
          console.error('Error parsing chunk:', error, jsonStr);
        }
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
};
