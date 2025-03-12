
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, MessageCircle, ChevronLeft } from 'lucide-react';
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
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/match" 
            className="inline-flex items-center text-white mb-6 hover:text-orange transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back to Match</span>
          </Link>

          <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-center">
            Compatibility Analysis
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            {/* Overall Score Card */}
            <Card className="col-span-1 md:col-span-2 glass-card p-4 md:p-6 text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl md:text-2xl">Overall Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <div className="relative">
                    <svg className="w-32 h-32 md:w-40 md:h-40">
                      <circle
                        className="text-white/10"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="60"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-orange"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="60"
                        cx="64"
                        cy="64"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 60}`,
                          strokeDashoffset: `${2 * Math.PI * 60 * (1 - overallPercentage / 100)}`,
                          transformOrigin: '50% 50%',
                          transform: 'rotate(-90deg)',
                        }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-3xl md:text-4xl font-bold">
                      {overallPercentage}%
                    </span>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-xl mb-2">
                      {formData.name || "You"} & {formData.partnerName || "Partner"}
                    </p>
                    <p className="text-white/70">
                      {compatibilityScores.overall} out of 36 points
                    </p>
                    <div className="mt-4 flex justify-center md:justify-start">
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
            <Card className="glass-card p-4 md:p-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg md:text-xl">
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
            <Card className="glass-card p-4 md:p-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg md:text-xl">
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
            <Card className="glass-card p-4 md:p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg md:text-xl">Temperament Compatibility</CardTitle>
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

            <Card className="glass-card p-4 md:p-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg md:text-xl">Planetary Influences</CardTitle>
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

          {/* Charts Selection */}
          <Card className="glass-card p-4 mb-6 md:mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl">Chart Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">{formData.name || "Your"} Charts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D1 (Rashi)</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D9 (Navamsa)</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D10 (Dashamsa)</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{formData.partnerName || "Partner's"} Charts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D1 (Rashi)</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D9 (Navamsa)</Button>
                    <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20">D10 (Dashamsa)</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row justify-center mt-4 md:mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white/10 hover:bg-white/20 text-white px-6 py-6 rounded-full w-full sm:w-auto">
              <Star className="mr-2" />
              View Full Report
            </Button>
            <Link to="/chat" className="w-full sm:w-auto">
              <Button className="bg-orange hover:bg-orange-dark text-white px-6 py-6 rounded-full w-full">
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
