
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AstrologyErrorProps {
  error: string;
  onRetry: () => void;
  debugInfo?: any;
}

const AstrologyError: React.FC<AstrologyErrorProps> = ({ error, onRetry, debugInfo }) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      
      <div className="text-center mt-4">
        <Button 
          onClick={onRetry}
          className="bg-purple-light hover:bg-purple-light/90 text-white"
        >
          Try Again
        </Button>
      </div>
      
      {debugInfo && (
        <div className="mt-6 p-4 border border-white/10 rounded-md bg-black/20">
          <h3 className="text-sm font-medium text-white/70 mb-2">Debug Information</h3>
          <pre className="text-xs text-white/60 overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AstrologyError;
