import React, { useState } from 'react';
import { Receipt as ReceiptIcon, Upload, History } from 'lucide-react';
import './MainMenu.css';
import { Spinner } from '../components/Spinner/Spinner';

interface MainMenuProps {
  onImageUpload: (file: File) => void;
  onHistoryClick: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onImageUpload, onHistoryClick }) => {
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

  const openImagePicker = () => {
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
      {uploading && <Spinner />}
      <div className={`main-menu-layout ${uploading ? 'main-menu-disabled' : ''}`}>
        <div className="main-menu-top-section">
          <div className="main-menu-content">
            <div className="main-menu-icon-wrapper">
              <ReceiptIcon className="main-menu-icon" />
            </div>
            <h1 className="main-menu-title">BillSplit</h1>
            <p className="main-menu-subtitle">Split bills with friends</p>
            {error && (
              <div className="main-menu-status main-menu-status-error">
                <p className="main-menu-status-error-text">Error: {error}</p>
              </div>
            )}
          </div>
        </div>
        <div className="main-menu-bottom-section">
          <div className="main-menu-option" onClick={uploading ? undefined : openImagePicker}>
            <Upload className="main-menu-option-icon" />
            <span className="main-menu-option-text">Upload Receipt</span>
          </div>
          <div className="main-menu-option" onClick={uploading ? undefined : onHistoryClick}>
            <History className="main-menu-option-icon" />
            <span className="main-menu-option-text">History</span>
          </div>
        </div>
      </div>
    </div>
  );
};
