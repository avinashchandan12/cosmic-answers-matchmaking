
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';

// Steps: Personal info, Partner info, Birth details, Partner birth details
const TOTAL_STEPS = 4;

const Match = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // User data
    name: '',
    gender: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',

    // Partner data
    partnerName: '',
    partnerGender: '',
    partnerBirthDate: '',
    partnerBirthTime: '',
    partnerBirthPlace: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form and navigate to results
      navigate('/results', { state: { formData } });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Vedic Compatibility Analysis
          </h1>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2.5 mb-8">
            <div 
              className="bg-orange h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            ></div>
          </div>
          
          <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-fade-up glass-card">
            {/* Step 1: Your Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
                <div>
                  <label className="block mb-2 text-sm">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange text-white"
                  >
                    <option value="" className="bg-purple text-white">Select Gender</option>
                    <option value="male" className="bg-purple text-white">Male</option>
                    <option value="female" className="bg-purple text-white">Female</option>
                    <option value="other" className="bg-purple text-white">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Your Birth Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Your Birth Details</h2>
                <div>
                  <label className="block mb-2 text-sm">Birth Date</label>
                  <div className="flex items-center relative">
                    <Calendar className="absolute left-3 text-orange" size={18} />
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Birth Time</label>
                  <div className="flex items-center relative">
                    <Clock className="absolute left-3 text-orange" size={18} />
                    <input
                      type="time"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Birth Place</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Partner Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Partner Information</h2>
                <div>
                  <label className="block mb-2 text-sm">Partner's Name</label>
                  <input
                    type="text"
                    name="partnerName"
                    value={formData.partnerName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="Enter partner's full name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm">Gender</label>
                  <select
                    name="partnerGender"
                    value={formData.partnerGender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange text-white"
                  >
                    <option value="" className="bg-purple text-white">Select Gender</option>
                    <option value="male" className="bg-purple text-white">Male</option>
                    <option value="female" className="bg-purple text-white">Female</option>
                    <option value="other" className="bg-purple text-white">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Partner Birth Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4">Partner Birth Details</h2>
                <div>
                  <label className="block mb-2 text-sm">Birth Date</label>
                  <div className="flex items-center relative">
                    <Calendar className="absolute left-3 text-orange" size={18} />
                    <input
                      type="date"
                      name="partnerBirthDate"
                      value={formData.partnerBirthDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Birth Time</label>
                  <div className="flex items-center relative">
                    <Clock className="absolute left-3 text-orange" size={18} />
                    <input
                      type="time"
                      name="partnerBirthTime"
                      value={formData.partnerBirthTime}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm">Birth Place</label>
                  <input
                    type="text"
                    name="partnerBirthPlace"
                    value={formData.partnerBirthPlace}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-orange"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <Button 
                  onClick={prevStep}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Back
                </Button>
              )}
              {currentStep === 1 && <div></div>}
              <Button 
                onClick={nextStep}
                className="bg-orange hover:bg-orange-dark text-white px-6 py-2 rounded-full ml-auto"
              >
                {currentStep === TOTAL_STEPS ? 'See Results' : 'Next'}
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Match;
