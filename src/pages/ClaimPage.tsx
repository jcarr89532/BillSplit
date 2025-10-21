import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Receipt, ReceiptItem } from '@/types';
import { getReceipt, saveReceipt } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CheckCircle, DollarSign } from 'lucide-react';

export const ClaimPage: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [claimedItems, setClaimedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (receiptId) {
      const foundReceipt = getReceipt(receiptId);
      if (foundReceipt) {
        setReceipt(foundReceipt);
        setLoading(false);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [receiptId, navigate]);

  const handleParticipantSelect = (participantId: string) => {
    setSelectedParticipant(participantId);
    // Reset claimed items when switching participants
    setClaimedItems([]);
  };

  const handleItemToggle = (itemId: string) => {
    setClaimedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSaveClaims = () => {
    if (!receipt || !selectedParticipant) return;

    const updatedItems = receipt.items.map(item => {
      if (claimedItems.includes(item.id)) {
        // Add participant to claimedBy if not already there
        if (!item.claimedBy.includes(selectedParticipant)) {
          return { ...item, claimedBy: [...item.claimedBy, selectedParticipant] };
        }
      } else {
        // Remove participant from claimedBy
        return { ...item, claimedBy: item.claimedBy.filter(id => id !== selectedParticipant) };
      }
      return item;
    });

    const updatedReceipt = { ...receipt, items: updatedItems };
    setReceipt(updatedReceipt);
    saveReceipt(updatedReceipt);
    
    // Show success message
    alert('Your claims have been saved!');
  };

  const getParticipantById = (id: string) => {
    return receipt?.participants.find(p => p.id === id);
  };

  const calculateItemTotal = (item: ReceiptItem) => {
    return item.price * item.quantity;
  };

  const calculateParticipantTotal = () => {
    if (!receipt || !selectedParticipant) return 0;
    
    return receipt.items
      .filter(item => item.claimedBy.includes(selectedParticipant))
      .reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Receipt Not Found</h1>
          <p className="text-gray-600 mb-6">This receipt may have been deleted or the link is invalid.</p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Claim Your Items</h1>
              <p className="text-sm sm:text-base text-gray-600">Select which items you'll be paying for</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Participant Selection */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Select Yourself</h3>
              <div className="space-y-2">
                {receipt.participants.map((participant) => (
                  <Button
                    key={participant.id}
                    variant={selectedParticipant === participant.id ? 'default' : 'outline'}
                    onClick={() => handleParticipantSelect(participant.id)}
                    className="w-full justify-start h-12 sm:h-auto"
                  >
                    {participant.name}
                  </Button>
                ))}
              </div>
              
              {selectedParticipant && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="font-medium text-sm sm:text-base">Your Total</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    ${calculateParticipantTotal().toFixed(2)}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Items Selection */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Select Items</h3>
              
              {!selectedParticipant ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500">Please select yourself first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receipt.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                        claimedItems.includes(item.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Checkbox
                            checked={claimedItems.includes(item.id)}
                            onChange={() => handleItemToggle(item.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="font-semibold text-sm sm:text-base">
                            ${calculateItemTotal(item).toFixed(2)}
                          </div>
                          {item.claimedBy.length > 0 && (
                            <div className="text-xs text-gray-500 truncate">
                              Claimed by {item.claimedBy.map(id => getParticipantById(id)?.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        {selectedParticipant && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <Button 
              onClick={handleSaveClaims}
              disabled={claimedItems.length === 0}
              size="lg"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 h-12 sm:h-auto"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Save My Claims ({claimedItems.length} items)
            </Button>
          </div>
        )}

        {/* Receipt Summary */}
        <Card className="p-4 sm:p-6 mt-6 sm:mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Receipt Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {receipt.items.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {receipt.participants.length}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Participants</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ${receipt.total?.toFixed(2) || '0.00'}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
