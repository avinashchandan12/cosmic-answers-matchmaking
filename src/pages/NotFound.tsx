
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Stars } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/10 p-4 rounded-full mb-4">
            <AlertCircle className="h-12 w-12 text-orange" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Page Not Found</h1>
          <p className="text-white/70 mt-2 text-center">
            The cosmic page you're looking for seems to have drifted into another dimension
          </p>
        </div>

        <div className="glass-card p-8 bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg text-center">
          <div className="flex justify-center mb-4">
            <Stars className="text-orange h-16 w-16" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-4">Oops! 404</h2>
          <p className="text-white/70 mb-6">
            The stars haven't aligned for this page. Let's navigate back to a known constellation.
          </p>
          <Link to="/">
            <Button className="bg-orange hover:bg-orange/90 text-white px-8 py-6 h-auto rounded-lg text-lg w-full">
              <ArrowLeft className="mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8 text-white/50 text-sm">
          <p>If you believe this is an error, please contact our support team</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
