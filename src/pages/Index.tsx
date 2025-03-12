
import React from 'react';
import { Star, Heart, Clock, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-up">
          Discover Your <span className="text-orange">Celestial</span>
          <br /> Connection
        </h1>
        <p className="text-xl mb-12 opacity-90 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Unlock the cosmic secrets of your relationship with Vedic astrology
        </p>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Star className="w-12 h-12 text-orange mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Birth Chart Analysis</h3>
            <p className="text-sm opacity-75">Create detailed Vedic birth charts with planetary positions and house placements</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <Heart className="w-12 h-12 text-orange mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Relationship Compatibility</h3>
            <p className="text-sm opacity-75">Discover your love compatibility with comprehensive Kundali matching</p>
          </Card>
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <Clock className="w-12 h-12 text-orange mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Astrological Guidance</h3>
            <p className="text-sm opacity-75">Get personalized insights and advice from our AI astrological assistant</p>
          </Card>
        </div>
        <Link to="/match">
          <Button 
            className="bg-orange hover:bg-orange-dark text-white px-8 py-6 rounded-full text-lg font-semibold animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            Start Matching <ArrowRight className="ml-2" />
          </Button>
        </Link>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center animate-fade-up" style={{ animationDelay: "0.7s" }}>
            <h3 className="text-4xl font-bold mb-2">10K+</h3>
            <p className="text-sm opacity-75">Happy Couples</p>
          </div>
          <div className="text-center animate-fade-up" style={{ animationDelay: "0.8s" }}>
            <h3 className="text-4xl font-bold mb-2">98%</h3>
            <p className="text-sm opacity-75">Accuracy Rate</p>
          </div>
          <div className="text-center animate-fade-up" style={{ animationDelay: "0.9s" }}>
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p className="text-sm opacity-75">Astrology Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
