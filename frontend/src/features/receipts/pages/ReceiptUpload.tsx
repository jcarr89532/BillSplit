import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt as ReceiptIcon, Camera, Upload, Users } from 'lucide-react';

import { setCurrentReceipt } from '../../../core/state/storage';
import { receiptUploadService } from '../services/receiptUpload';

export const ReceiptUpload: React.FC = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageSelect = async (file: File) => {
    console.log('File selected:', file.name);
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      // Simple approach: just create a local receipt for now
      const receipt = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(file),
        items: [
          { id: '1', name: 'Sample Item 1', price: 5.99, quantity: 1 },
          { id: '2', name: 'Sample Item 2', price: 3.50, quantity: 2 }
        ],
        participants: [],
        tax: 1.20,
        tip: 2.00,
        total: 12.69,
        createdAt: new Date().toISOString()
      };
      
      setCurrentReceipt(receipt);
      setUploadSuccess(true);
      console.log('Receipt created:', receipt);
      
      // Optional: Try to upload to backend (commented out for now)
      // await uploadToBackend(file);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Failed to process receipt');
    } finally {
      setUploading(false);
    }
  };

  // Simple upload function (for future use)
  // const uploadToBackend = async (file: File) => {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   
  //   const response = await awsClient.post('/receipts/upload', formData);
  //   return response.data;
  // };

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

  const testBackend = async () => {
    try {
      const result = await receiptUploadService.testConnection();
      alert(`Backend Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      alert(`Backend Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
            
            {/* Upload Status */}
            {uploading && (
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-50 rounded-lg">
                <p className="text-blue-300">Processing receipt...</p>
              </div>
            )}
            
            {uploadError && (
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 rounded-lg">
                <p className="text-red-300">Error: {uploadError}</p>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mt-4 p-4 bg-green-900 bg-opacity-50 rounded-lg">
                <p className="text-green-300">Receipt processed successfully!</p>
              </div>
            )}
            
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
            onClick={testBackend}
          >
            <Users className="h-20 w-20 mb-4" style={{ color: '#a0aec0' }} />
            <span className="text-lg" style={{ color: '#a0aec0' }}>Friends</span>
          </div>
        </div>
      </div>

    </div>
  );

  
};
