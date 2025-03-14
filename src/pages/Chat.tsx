
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
  const [chartData, setChartData] = useState<any>(null);
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

  // Fetch user's chart data if available
  useEffect(() => {
    const fetchUserChartData = async () => {
      if (!user) return;
      
      try {
        // Check if we have saved chart data
        const { data, error } = await supabase
          .from('saved_charts')
          .select('*')
          .eq('user_id', user.id)
          .eq('chart_type', 'birth_chart')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Error fetching user chart data:', error);
          return;
        }
        
        if (data && data.length > 0) {
          setChartData(data[0].chart_data);
        }
      } catch (error) {
        console.error('Error fetching user chart data:', error);
      }
    };
    
    fetchUserChartData();
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
        .insert({
          user_id: user.id,
          message,
          is_from_ai: isFromAI
        });
        
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
    
    try {
      // Call our Supabase Edge Function for AI response
      const { data, error } = await supabase.functions.invoke('astro-ai', {
        body: { 
          question: input,
          chartData: chartData 
        }
      });
      
      if (error) throw error;
      
      const aiResponse = data.answer;
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to Supabase
      await saveMessage(aiResponse, true);
    } catch (error) {
      console.error('Error calling AI function:', error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-purple-background text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
            Astrological Consultation
          </h1>
          
          <Card className="glass-card p-4 h-[70vh] flex flex-col bg-white/5 backdrop-blur-lg border-white/20">
            <div className="flex items-center mb-4 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center mr-3">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-medium text-white">AstroMatch AI</h2>
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
                    <p className="text-white">{message.text}</p>
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
                placeholder="Ask about your astrological chart or compatibility..."
                className="w-full p-4 pr-14 rounded-xl bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange resize-none text-white placeholder:text-white/50"
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
            <h3 className="text-xl font-semibold mb-3 text-orange">Suggested Questions</h3>
            <div className="flex flex-wrap gap-2">
              {[
                "What does my birth chart reveal about my personality?",
                "How does my Moon sign affect my emotions?",
                "What career paths are favorable based on my chart?",
                "When is my next favorable period for relationships?",
                "How can I balance the challenging aspects in my chart?"
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
