
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Star, Heart, Clock, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-purple-background text-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your <span className="text-orange">Celestial</span><br />
            <span className="text-orange">Connection</span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 mb-8">
            Unlock the cosmic secrets of your relationship with Vedic astrology
          </p>
        </div>
        
        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="feature-icon mb-4">
              <Star className="text-orange" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Birth Chart Analysis</h3>
            <p className="opacity-80">
              Create detailed Vedic birth charts with planetary positions and house placements
            </p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <div className="feature-icon mb-4">
              <Heart className="text-orange" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Relationship Compatibility</h3>
            <p className="opacity-80">
              Discover your love compatibility with comprehensive Kundali matching
            </p>
          </div>
          
          <div className="glass-card p-8 text-center">
            <div className="feature-icon mb-4">
              <Clock className="text-orange" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Astrological Guidance</h3>
            <p className="opacity-80">
              Get personalized insights and advice from our AI astrological assistant
            </p>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mb-16">
          <Link to="/match">
            <Button 
              size="lg" 
              className="bg-purple-light hover:bg-purple-light/90 text-white px-8 py-6 rounded-lg text-lg h-auto"
            >
              Start Matching <ArrowRight className="ml-2" />
            </Button>
          </Link>
          {!user && (
            <p className="mt-4 text-white/70">
              <Link to="/auth" className="text-orange hover:underline">Sign in</Link> to save your matches and charts
            </p>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center opacity-70 text-sm">
          <p>© 2023 AstroMatch. All rights reserved.</p>
          <p>Powered by ancient wisdom and modern technology.</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
