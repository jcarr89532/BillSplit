import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  imageUrl?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  onImageRemove,
  imageUrl,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveImage = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Receipt"
            className="w-full h-64 sm:h-80 object-contain rounded-2xl border border-gray-200 shadow-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`p-12 border-2 border-dashed transition-all duration-300 cursor-pointer bg-white border-gray-200 rounded-3xl ${
            isDragOver 
              ? 'border-gray-400 bg-gray-100 shadow-xl scale-105' 
              : 'hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-lg">
              <Upload className="h-12 w-12 text-gray-600" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 mb-3">
                Upload Receipt
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Drag and drop your receipt image here, or click to browse
              </p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="px-8 py-4 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <ImageIcon className="h-6 w-6 mr-3" />
              Choose File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
