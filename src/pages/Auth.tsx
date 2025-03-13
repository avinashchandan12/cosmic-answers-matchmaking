
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, UserPlus, Stars } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signUp(email, password);
      setActiveTab('login');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-white/10 p-4 rounded-full mb-4">
          <Stars className="h-12 w-12 text-orange" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">AstroMatch</h1>
        <p className="text-white/70 mt-2 text-center max-w-md">
          Discover cosmic compatibility and insights with vedic astrology
        </p>
      </div>
      
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-center">Welcome</CardTitle>
          <CardDescription className="text-white/70 text-center">
            Sign in to access your astrological insights
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-white/10">
            <TabsTrigger value="login" className="text-white data-[state=active]:bg-orange">Sign In</TabsTrigger>
            <TabsTrigger value="register" className="text-white data-[state=active]:bg-orange">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-white">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-white">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                  )}
                  Sign In
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm text-white">Email</label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm text-white">Password</label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm text-white">Confirm Password</label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-orange hover:bg-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  Register
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-8 text-white/50 text-center text-sm">
        <p>By signing up, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default Auth;
