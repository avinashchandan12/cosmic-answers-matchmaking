
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface FormData {
  name: string;
  partnerName: string;
  [key: string]: string;
}

// Mock compatibility scores - in a real app, these would come from actual calculations
const compatibilityScores = {
  overall: 28, // out of 36
  mangal: 18, // out of 25
  mental: 5, // out of 5
  temperament: 3, // out of 4
  planets: 2, // out of 2
};

const Results = () => {
  const location = useLocation();
  const formData = (location.state?.formData || {}) as FormData;

  // Calculate overall percentage
  const overallPercentage = Math.round((compatibilityScores.overall / 36) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Compatibility Analysis
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Overall Score Card */}
            <Card className="col-span-2 glass-card p-6 text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">Overall Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center gap-4">
                  <div className="relative">
                    <svg className="w-40 h-40">
                      <circle
                        className="text-white/10"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                      />
                      <circle
                        className="text-orange"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 70}`,
                          strokeDashoffset: `${2 * Math.PI * 70 * (1 - overallPercentage / 100)}`,
                          transformOrigin: '50% 50%',
                          transform: 'rotate(-90deg)',
                        }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                      {overallPercentage}%
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xl mb-2">
                      {formData.name} & {formData.partnerName}
                    </p>
                    <p className="text-white/70">
                      {compatibilityScores.overall} out of 36 points
                    </p>
                    <div className="mt-4 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={star <= Math.round(overallPercentage / 20) ? "text-orange fill-orange" : "text-white/30"} 
                          size={24} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mangal Dosha Card */}
            <Card className="glass-card p-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Star className="text-orange mr-2" />
                  Mangal Dosha Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Score: {compatibilityScores.mangal}/25
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kuja Dosha:</span>
                    <span className="text-green-400">Neutralized</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mars Placement:</span>
                    <span>7th House & 2nd House</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remedies:</span>
                    <span className="text-orange">Not Required</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mental Compatibility Card */}
            <Card className="glass-card p-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Heart className="text-orange mr-2" />
                  Mental Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Score: {compatibilityScores.mental}/5
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Moon Sign Harmony:</span>
                    <span className="text-green-400">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Communication:</span>
                    <span className="text-green-400">Harmonious</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emotional Bond:</span>
                    <span className="text-green-400">Strong</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis Cards */}
            <Card className="glass-card p-6">
              <CardHeader className="pb-2">
                <CardTitle>Temperament Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Score: {compatibilityScores.temperament}/4
                </p>
                <div className="space-y-2">
                  <p>You share complementary elements which creates a balanced relationship with good understanding.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card p-6">
              <CardHeader className="pb-2">
                <CardTitle>Planetary Influences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Score: {compatibilityScores.planets}/2
                </p>
                <div className="space-y-2">
                  <p>Venus-Moon conjunction suggests strong emotional and romantic compatibility.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-10 space-x-4">
            <Button className="bg-white/10 hover:bg-white/20 text-white px-6 py-6 rounded-full">
              <Star className="mr-2" />
              View Full Report
            </Button>
            <Link to="/chat">
              <Button className="bg-orange hover:bg-orange-dark text-white px-6 py-6 rounded-full">
                <MessageCircle className="mr-2" />
                Ask Questions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
