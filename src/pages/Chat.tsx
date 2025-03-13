import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, User, Star, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Sample pre-defined responses based on keywords
const sampleResponses: Record<string, string[]> = {
  'compatibility': [
    "Based on your birth charts, your compatibility is quite strong. Venus in your chart connects well with your partner's Jupiter, indicating growth and prosperity in the relationship.",
    "Your Moon signs are in harmony, suggesting emotional compatibility and understanding between you two."
  ],
  'marriage': [
    "The 7th house in both charts shows positive indications for marriage. The timing looks favorable around your Saturn return.",
    "Your Navamsa charts show a strong connection, which is very important for marital happiness according to Vedic astrology."
  ],
  'career': [
    "Your 10th house is strong with Sun and Jupiter aspects, indicating leadership roles and success in your profession.",
    "The current planetary period (dasha) is favorable for career growth over the next 2-3 years."
  ],
  'mangal': [
    "The Mangal Dosha in your chart is neutralized by the placement of Venus in the 7th house.",
    "While there is Mangal Dosha, it's not affecting your relationship compatibility significantly due to other harmonious aspects."
  ],
  'dasha': [
    "You're currently running Venus-Mercury dasha which is favorable for relationships and communication.",
    "Your partner is in Saturn mahadasha, which can bring stability but also some responsibilities in the relationship."
  ]
};

// Default responses when no keywords match
const defaultResponses = [
  "According to your birth charts, the planetary positions indicate a period of growth and transformation.",
  "The current transit of Jupiter will bring positive energy to your relationship over the next few months.",
  "Based on Vedic principles, your Moon signs suggest a natural emotional understanding between you two.",
  "Your ascendants are compatible, creating a strong foundation for your relationship."
];

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AstroMatch AI assistant. How can I help you with your astrological chart or relationship compatibility questions?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch previous chat messages from Supabase
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) {
          console.error('Error fetching chat history:', error);
          return;
        }
        
        if (data && data.length > 0) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            text: msg.message,
            sender: msg.is_from_ai ? 'ai' : 'user',
            timestamp: new Date(msg.created_at)
          }));
          
          // Keep the welcome message at the top
          setMessages([messages[0], ...formattedMessages]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    
    fetchChatHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const saveMessage = async (message: string, isFromAI: boolean) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: user.id,
            message,
            is_from_ai: isFromAI
          }
        ]);
        
      if (error) {
        console.error('Error saving message:', error);
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;
    
    setLoading(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to Supabase
    await saveMessage(input, false);
    
    setInput('');
    
    // Simulate AI response with a slight delay
    setTimeout(async () => {
      try {
        // Check for keywords in the user's message
        const lowercaseInput = input.toLowerCase();
        let responseText = '';
        
        // Find matching keywords
        const matchedKeyword = Object.keys(sampleResponses).find(keyword => 
          lowercaseInput.includes(keyword)
        );
        
        if (matchedKeyword) {
          // Get a random response for the matched keyword
          const responses = sampleResponses[matchedKeyword];
          responseText = responses[Math.floor(Math.random() * responses.length)];
        } else {
          // Use default response if no keywords match
          responseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: responseText,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Save AI response to Supabase
        await saveMessage(responseText, true);
      } catch (error) {
        console.error('Error generating response:', error);
        toast({
          title: "Error",
          description: "Failed to generate a response. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Astrological Consultation
          </h1>
          
          <Card className="glass-card p-4 h-[70vh] flex flex-col bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex items-center mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center mr-3">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-medium">AstroMatch AI</h2>
                <p className="text-sm text-white/70">Vedic Astrology Specialist</p>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user' 
                        ? 'bg-orange text-white rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === 'ai' ? (
                        <Star className="text-orange mr-2" size={16} />
                      ) : (
                        <User className="text-white mr-2" size={16} />
                      )}
                      <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about your relationship compatibility..."
                className="w-full p-4 pr-14 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange resize-none"
                rows={2}
                disabled={loading}
              />
              <Button 
                onClick={handleSend}
                className="absolute right-2 bottom-2 p-2 bg-orange hover:bg-orange/90 text-white rounded-lg"
                disabled={input.trim() === '' || loading}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </Button>
            </div>
          </Card>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Suggested Questions</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "What does our compatibility score mean?",
                "How is our Mangal Dosha affecting us?",
                "When is a good time for marriage?",
                "What planetary dasha are we in?",
                "How can we improve our relationship?"
              ].map((question, index) => (
                <Button
                  key={index}
                  className="bg-white/10 hover:bg-white/20 text-white"
                  onClick={() => setInput(question)}
                  disabled={loading}
                >
                  <MessageCircle className="mr-2" size={16} />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
