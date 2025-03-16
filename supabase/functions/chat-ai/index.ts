
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, chartData, dashaData, currentDateTime, chartType, stream } = await req.json();
    const deepSeekApiKey = Deno.env.get('DEEPSEEK_API_KEY') || 'sk-2f7075c883d44d438f0bcb14fd8b1e0e';
    
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Add the current date and time to the context
    const currentDateTimeString = currentDateTime || new Date().toISOString();
    
    // Get the chart type the user is asking about (default to D1)
    const selectedChartType = chartType || 'D1';
    
    // Prepare the system message for astrology-focused assistant
    let systemMessage = `You are an expert in Vedic astrology with deep knowledge of birth charts, compatibility matching, 
    and astrological predictions. Provide insightful, accurate information about astrological concepts, 
    planetary influences, and relationship compatibility. Your responses should reflect the depth and 
    complexity of Vedic astrological traditions while being accessible to beginners. 
    When discussing compatibility, consider factors like Mangal Dosha, Nakshatras, and planetary positions.
    
    The current date and time is: ${currentDateTimeString}
    
    The user is asking about their ${selectedChartType} chart. In Vedic astrology:
    - D1 (Rashi) is the birth chart showing general life themes
    - D9 (Navamsha) shows marriage and deeper spiritual purpose
    - D3 (Drekkana) relates to siblings and courage
    - D10 (Dashamsha) shows career and professional life
    - D7 (Saptamsha) relates to children and progeny
    - D2 (Hora) relates to wealth and prosperity
    - D4 (Chaturthamsha) shows property and fixed assets
    - D12 (Dwadashamsha) relates to parents and ancestry
    - D5 (Panchamsha) shows spiritual merit
    - D6 (Shashthamsha) relates to health and obstacles
    - D8 (Ashtamsha) shows obstacles and unexpected events
    - D11 (Rudramsha) relates to dharma and righteousness
    - D16 (Shodashamsha) shows vehicles and comforts
    - D20 (Vimshamsha) relates to spiritual practice
    - D24 (Chaturvimshamsha) shows education and learning
    - D27 (Saptavimshamsha) relates to strength and weakness
    - D30 (Trimshamsha) shows misfortunes and difficulties
    - D40 (Khavedamsha) relates to auspicious and inauspicious effects
    - D45 (Akshavedamsha) shows all aspects of life in general
    - D60 (Shashtiamsha) is the most detailed divisional chart showing all aspects of life`;

    // Add chart data context if available
    let userMessageWithContext = prompt;
    if (chartData) {
      userMessageWithContext = `My birth chart data (${selectedChartType} chart): ${JSON.stringify(chartData)}\n\n${prompt}`;
    }
    
    // Add dasha data context if available
    if (dashaData) {
      userMessageWithContext = `My dasha data: ${JSON.stringify(dashaData)}\n\n${userMessageWithContext}`;
      systemMessage += `\n\nYou have access to the user's Dasha periods information, which shows the planetary periods that influence different phases of their life according to Vedic astrology. When asked about past, present, or future phases, refer to the appropriate Dasha and Antardasha (sub-period) information.`;
    }

    console.log('Calling DeepSeek API with prompt:', prompt);
    console.log('Using chart type:', selectedChartType);

    // If streaming is requested, handle it through a streaming response
    if (stream) {
      console.log('Stream requested, setting up streaming response');
      
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepSeekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessageWithContext }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error from DeepSeek API');
      }

      // Create a TransformStream to process the response stream
      const { readable, writable } = new TransformStream();
      
      // Start processing the stream
      (async () => {
        const writer = writable.getWriter();
        const reader = response.body?.getReader();
        if (!reader) {
          writer.close();
          return;
        }
        
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        try {
          console.log('Starting to read stream from DeepSeek');
          let chunk_count = 0;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log('Stream complete');
              break;
            }
            
            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });
            chunk_count++;
            
            if (chunk_count % 10 === 0) {
              console.log('Received chunk from DeepSeek');
            }
            
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
                  // Forward the content as a JSON object
                  await writer.write(
                    encoder.encode(JSON.stringify({ chunk: content }) + '\n')
                  );
                }
              } catch (e) {
                console.error('Error parsing streaming response chunk:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error processing stream:', error);
        } finally {
          writer.close();
        }
      })();
      
      return new Response(readable, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response (original implementation)
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepSeekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessageWithContext }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('DeepSeek API error:', data);
        throw new Error(data.error?.message || 'Error from DeepSeek API');
      }

      const aiResponse = data.choices[0].message.content;
      console.log('Successfully received response from DeepSeek');

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
