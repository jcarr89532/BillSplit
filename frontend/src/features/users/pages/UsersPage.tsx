import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Button } from '../../../shared/components/button';

export const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Content */}
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-6xl">👥</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#a0aec0' }}>Friends</h1>
            <p className="text-xl" style={{ color: '#a0aec0' }}>This feature is not yet implemented</p>
          </div>
        </div>
      </div>
    </div>
  );
};
