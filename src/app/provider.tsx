import React from 'react';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      {children}
    </div>
  );
};
