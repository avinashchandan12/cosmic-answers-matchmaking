
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover Your <span className="text-orange">Cosmic</span> Compatibility
              </h1>
              <p className="text-lg md:text-xl opacity-80 mb-8">
                Explore the ancient wisdom of Vedic astrology to understand your relationships on a deeper level. Calculate compatibility, analyze birth charts, and receive personalized insights.
              </p>
              <div className="flex flex-wrap gap-4">
                {user ? (
                  <Link to="/match">
                    <Button size="lg" className="bg-orange hover:bg-orange/90 text-white">
                      Start a New Match
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth">
                    <Button size="lg" className="bg-orange hover:bg-orange/90 text-white">
                      Sign Up Free
                    </Button>
                  </Link>
                )}
                <Link to={user ? "/profile" : "/auth"}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/20 bg-white/10 hover:bg-white/20"
                  >
                    {user ? "My Profile" : "Sign In"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="/assets/hero-image.png" 
                alt="Astrology Chart" 
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center mx-auto mb-4">
                <img src="/assets/icon-chart.png" alt="Birth Chart" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Birth Chart Analysis</h3>
              <p className="opacity-80">
                Discover the celestial blueprint of your personality, strengths, challenges, and destiny.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center mx-auto mb-4">
                <img src="/assets/icon-compatibility.png" alt="Compatibility" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Match Compatibility</h3>
              <p className="opacity-80">
                Evaluate relationship potential with detailed Kundli matching and compatibility scoring.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-orange/20 flex items-center justify-center mx-auto mb-4">
                <img src="/assets/icon-ai.png" alt="AI Insights" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Astrologer</h3>
              <p className="opacity-80">
                Receive personalized astrological insights and advice from our advanced AI astrologer.
              </p>
            </div>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-10">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="text-lg font-semibold mb-2">Enter Birth Details</h3>
                <p className="opacity-80">Provide accurate birth information for both individuals.</p>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-orange/30 -z-10"></div>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="text-lg font-semibold mb-2">Generate Charts</h3>
                <p className="opacity-80">Our system calculates precise birth charts using Vedic astrology.</p>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-orange/30 -z-10"></div>
              </div>
              
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="text-lg font-semibold mb-2">Analyze Compatibility</h3>
                <p className="opacity-80">View detailed compatibility assessments across multiple factors.</p>
                {/* Arrow for desktop */}
                <div className="hidden md:block absolute top-8 left-full w-full h-1 bg-orange/30 -z-10"></div>
              </div>
              
              <div>
                <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="text-lg font-semibold mb-2">Receive Insights</h3>
                <p className="opacity-80">Get personalized recommendations and relationship insights.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/10 text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Cosmic Connection?</h2>
            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
              Join thousands of couples who have gained deeper insights into their relationships through the ancient wisdom of Vedic astrology.
            </p>
            <Link to={user ? "/match" : "/auth"}>
              <Button 
                size="lg" 
                className="bg-orange hover:bg-orange/90 text-white"
              >
                {user ? "Start Matching Now" : "Sign Up and Start for Free"}
              </Button>
            </Link>
          </div>
          
          <div className="text-center opacity-70 text-sm">
            <p>© 2023 AstroMatch. All rights reserved.</p>
            <p>Powered by ancient wisdom and modern technology.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
