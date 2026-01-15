import React, { useState } from 'react';
import { Receipt as ReceiptIcon, Camera, Upload } from 'lucide-react';
import './MainMenu.css';

interface MainMenuProps {
  onImageUpload: (file: File) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onImageUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await onImageUpload(file);
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const openCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  const openFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (file) handleImageSelect(file);
    };
    input.click();
  };

  return (
    <div className="main-menu-container">
      <div className="main-menu-layout">
        <div className="main-menu-top-section">
          <div className="main-menu-content">
            <div className="main-menu-icon-wrapper">
              <ReceiptIcon className="main-menu-icon" />
            </div>
            <h1 className="main-menu-title">Receipt Splitter</h1>
            <p className="main-menu-subtitle">Split bills with friends</p>
            {uploading && (
              <div className="main-menu-status main-menu-status-uploading">
                <p className="main-menu-status-uploading-text">Processing receipt...</p>
              </div>
            )}
            {error && (
              <div className="main-menu-status main-menu-status-error">
                <p className="main-menu-status-error-text">Error: {error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="main-menu-bottom-section">
          <div className="main-menu-option" onClick={openCamera}>
            <Camera className="main-menu-option-icon" />
            <span className="main-menu-option-text">Camera</span>
          </div>
          <div className="main-menu-option" onClick={openFileUpload}>
            <Upload className="main-menu-option-icon" />
            <span className="main-menu-option-text">Upload</span>
          </div>
        </div>
      </div>
    </div>
  );
};
