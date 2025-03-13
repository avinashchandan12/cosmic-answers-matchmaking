
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Calendar, Clock, Save, Star } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Steps: Personal info, Partner info, Birth details
const TOTAL_STEPS = 3;

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

  const handleGenderChange = (value: string, person: 'user' | 'partner') => {
    if (person === 'user') {
      setFormData(prev => ({ ...prev, gender: value }));
    } else {
      setFormData(prev => ({ ...prev, partnerGender: value }));
    }
  };

  const saveProfile = () => {
    // In a real app, you would save to a database or localStorage
    localStorage.setItem('userProfile', JSON.stringify({
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace
    }));
    
    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully.",
    });
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
    } else {
      // Navigate to home if on first step and back is pressed
      navigate('/');
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center gap-8 mb-8">
        {[1, 2, 3].map((step) => (
          <div 
            key={step} 
            className={`flex items-center justify-center rounded-full h-12 w-12 text-white font-medium 
              ${currentStep === step 
                ? 'bg-orange' 
                : 'bg-white/10'}`}
          >
            {step}
          </div>
        ))}
      </div>
    );
  };

  const renderPersonalInfo = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-orange">
          Enter First Person's Details
        </h2>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Gender</Label>
          <RadioGroup 
            value={formData.gender} 
            onValueChange={(value) => handleGenderChange(value, 'user')}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="male" id="male" className="text-orange border-white/20" />
              <Label htmlFor="male" className="text-white">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="female" id="female" className="text-orange border-white/20" />
              <Label htmlFor="female" className="text-white">Female</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="other" className="text-orange border-white/20" />
              <Label htmlFor="other" className="text-white">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={18} />
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthTime" className="text-white">Birth Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={18} />
            <Input
              id="birthTime"
              name="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthPlace" className="text-white">Birth Place</Label>
          <Input
            id="birthPlace"
            name="birthPlace"
            value={formData.birthPlace}
            onChange={handleInputChange}
            placeholder="City, State, Country"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <Button
          className="w-full bg-purple-light hover:bg-purple text-white"
          onClick={saveProfile}
        >
          <Save className="mr-2" size={18} />
          Save Details
        </Button>
      </div>
    );
  };

  const renderPartnerInfo = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-orange">Enter Second Person's Details</h2>
        
        <div className="space-y-2">
          <Label htmlFor="partnerName" className="text-white">Full Name</Label>
          <Input
            id="partnerName"
            name="partnerName"
            value={formData.partnerName}
            onChange={handleInputChange}
            placeholder="Enter full name"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Gender</Label>
          <RadioGroup 
            value={formData.partnerGender} 
            onValueChange={(value) => handleGenderChange(value, 'partner')}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="male" id="partner-male" className="text-orange border-white/20" />
              <Label htmlFor="partner-male" className="text-white">Male</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="female" id="partner-female" className="text-orange border-white/20" />
              <Label htmlFor="partner-female" className="text-white">Female</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="other" id="partner-other" className="text-orange border-white/20" />
              <Label htmlFor="partner-other" className="text-white">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerBirthDate" className="text-white">Birth Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={18} />
            <Input
              id="partnerBirthDate"
              name="partnerBirthDate"
              type="date"
              value={formData.partnerBirthDate}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerBirthTime" className="text-white">Birth Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={18} />
            <Input
              id="partnerBirthTime"
              name="partnerBirthTime"
              type="time"
              value={formData.partnerBirthTime}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerBirthPlace" className="text-white">Birth Place</Label>
          <Input
            id="partnerBirthPlace"
            name="partnerBirthPlace"
            value={formData.partnerBirthPlace}
            onChange={handleInputChange}
            placeholder="City, State, Country"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
      </div>
    );
  };

  const renderChartOptions = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-orange">Select Charts to View</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white">Person 1: {formData.name}</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D1 (Birth Chart)
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D9 (Navamsa)
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D10 (Career)
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Person 2: {formData.partnerName}</Label>
            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D1 (Birth Chart)
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D9 (Navamsa)
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                D10 (Career)
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Compatibility Analysis</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Ashtakoot Matching
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                Dashas Compatibility
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-background text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white/10 p-3 rounded-full mb-4">
              <Star className="h-8 w-8 text-orange" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Vedic Compatibility Match
            </h1>
            <p className="text-white/70 mt-2 text-center">
              Enter birth details to discover your cosmic compatibility
            </p>
          </div>

          {renderStepIndicator()}
          
          <Card className="w-full bg-white/5 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 pt-6">
              <Tabs value={String(currentStep)} className="w-full">
                <TabsContent value="1">
                  {renderPersonalInfo()}
                </TabsContent>
                <TabsContent value="2">
                  {renderPartnerInfo()}
                </TabsContent>
                <TabsContent value="3">
                  {renderChartOptions()}
                </TabsContent>
              </Tabs>

              <div className="mt-8 flex justify-between">
                <Button 
                  onClick={prevStep}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="mr-2" size={18} />
                  Back
                </Button>
                
                <Button 
                  onClick={nextStep}
                  className="bg-orange hover:bg-orange/90 text-white"
                >
                  {currentStep === TOTAL_STEPS ? 'See Results' : 'Next'}
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Match;
