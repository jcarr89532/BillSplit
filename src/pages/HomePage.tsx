import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateId } from '@/lib/storage';
import { setCurrentReceipt } from '@/lib/storage';
import { Receipt as ReceiptIcon, Camera, Upload, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleImageSelect = (file: File) => {
    const url = URL.createObjectURL(file);
    
    // Create initial receipt with image
    const receipt = {
      id: generateId(),
      imageUrl: url,
      items: [],
      participants: [],
      tax: 0,
      tip: 0,
      total: 0,
      createdAt: new Date().toISOString()
    };
    
    setCurrentReceipt(receipt);
  };

  const openCamera = () => {
    // Create a file input that can access camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use back camera on mobile
    
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    
    input.click();
  };

  const openFileUpload = () => {
    // Create a file input for photo selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false; // Single file selection
    
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (file) {
        handleImageSelect(file);
      }
    };
    
    input.click();
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="h-screen flex flex-col">
        {/* Logo Section - Top Half */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <ReceiptIcon className="mx-auto" style={{ width: '250px', height: '250px', color: '#a0aec0' }} />
            </div>
            <h1 className="text-6xl font-light mb-4" style={{ color: '#a0aec0' }}>
              Receipt Splitter
            </h1>
            <p className="text-xl" style={{ color: '#a0aec0' }}>
              Split bills with friends
            </p>
          </div>
        </div>

        {/* Three Sections - Bottom Half */}
        <div className="flex-1 flex">
          {/* Camera Section */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            onClick={openCamera}
          >
            <Camera className="h-20 w-20 mb-4" style={{ color: '#a0aec0' }} />
            <span className="text-lg" style={{ color: '#a0aec0' }}>Camera</span>
          </div>

          {/* Upload Section */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
            onClick={openFileUpload}
          >
            <Upload className="h-20 w-20 mb-4" style={{ color: '#a0aec0' }} />
            <span className="text-lg" style={{ color: '#a0aec0' }}>Upload</span>
          </div>

          {/* Friends Section */}
          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 hover:bg-gray-800 transition-colors duration-300 cursor-pointer"
            onClick={() => navigate('/friends')}
          >
            <Users className="h-20 w-20 mb-4" style={{ color: '#a0aec0' }} />
            <span className="text-lg" style={{ color: '#a0aec0' }}>Friends</span>
          </div>
        </div>
      </div>

    </div>
  );
};
