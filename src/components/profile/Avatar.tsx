
import React from 'react';
import { UserCircle } from 'lucide-react';

interface AvatarProps {
  url: string | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Avatar = ({ url, size = 'md', editable = false, onFileChange }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white/20`}>
        {url ? (
          <img 
            src={url} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle className="w-16 h-16 text-white/60" />
          </div>
        )}
      </div>
      {editable && (
        <label className="absolute bottom-0 right-0 bg-orange hover:bg-orange/90 rounded-full p-2 cursor-pointer">
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileChange} 
            className="hidden" 
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </label>
      )}
    </div>
  );
};

export default Avatar;
