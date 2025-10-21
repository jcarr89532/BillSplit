import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Receipt, Participant } from '@/types';
import { getCurrentReceipt, setCurrentReceipt, saveReceipt, clearCurrentReceipt } from '@/lib/storage';
import { ParticipantForm } from '@/components/ParticipantForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Users, Share2 } from 'lucide-react';

export const SharePage: React.FC = () => {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Partial<Receipt>>({});
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const currentReceipt = getCurrentReceipt();
    if (currentReceipt) {
      setReceipt(currentReceipt);
      setParticipants(currentReceipt.participants || []);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleParticipantsChange = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    const updatedReceipt = { ...receipt, participants: newParticipants };
    setReceipt(updatedReceipt);
    setCurrentReceipt(updatedReceipt);
  };

  const handleContinue = () => {
    if (participants.length === 0) {
      alert('Please add at least one participant to continue');
      return;
    }

    // Save the receipt and clear current receipt
    const finalReceipt = { ...receipt, participants } as Receipt;
    saveReceipt(finalReceipt);
    clearCurrentReceipt();

    // Navigate to claim page
    navigate(`/claim/${finalReceipt.id}`);
  };

  const handleBack = () => {
    navigate('/review');
  };

  const handleShare = () => {
    // In a real app, this would generate shareable links or send SMS
    const shareUrl = `${window.location.origin}/claim/${receipt.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Participants</h1>
                <p className="text-sm sm:text-base text-gray-600">Who will be splitting this receipt?</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Participants Form */}
          <div className="order-2 lg:order-1">
            <ParticipantForm
              participants={participants}
              onParticipantsChange={handleParticipantsChange}
            />
          </div>

          {/* Receipt Summary */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Receipt Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{receipt.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    ${receipt.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${receipt.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tip:</span>
                  <span className="font-medium">${receipt.tip?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-green-600">
                      ${receipt.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Share Options */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Share Options</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleShare} 
                  className="w-full h-12 sm:h-auto"
                  disabled={!receipt.id}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Share Link
                </Button>
                <p className="text-sm text-gray-500">
                  Share this link with participants so they can claim their items
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between mt-6 sm:mt-8">
          <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto order-2 sm:order-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Review
          </Button>
          
          <Button 
            onClick={handleContinue} 
            disabled={participants.length === 0}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 h-12 sm:h-auto order-1 sm:order-2"
          >
            Create Receipt & Share
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Instructions */}
        {participants.length > 0 && (
          <Card className="p-4 sm:p-6 mt-6 sm:mt-8 bg-green-50">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''} added
                </h3>
                <p className="text-green-700 text-sm">
                  Ready to create the receipt and share it with participants
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
