import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Receipt, Participant, ReceiptItem } from '@/types';
import { getReceipt } from '@/lib/storage';
import { SummaryView } from '@/components/SummaryView';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Share2, Users, DollarSign, Receipt as ReceiptIcon } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { receiptId } = useParams<{ receiptId: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/claim/${receiptId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const handleEdit = () => {
    // In a real app, this would allow editing the receipt
    alert('Edit functionality would be implemented here');
  };

  const calculateItemTotal = (item: ReceiptItem) => {
    return item.price * item.quantity;
  };

  const getParticipantTotals = () => {
    if (!receipt) return [];

    const participantTotals: { [key: string]: { participant: Participant; total: number; items: ReceiptItem[] } } = {};
    
    receipt.participants.forEach(participant => {
      participantTotals[participant.id] = {
        participant,
        total: 0,
        items: []
      };
    });

    receipt.items.forEach(item => {
      item.claimedBy.forEach(participantId => {
        if (participantTotals[participantId]) {
          participantTotals[participantId].total += calculateItemTotal(item);
          participantTotals[participantId].items.push(item);
        }
      });
    });

    return Object.values(participantTotals);
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

  const participantTotals = getParticipantTotals();
  const totalClaimed = participantTotals.reduce((sum, p) => sum + p.total, 0);
  const unclaimedAmount = (receipt.total || 0) - totalClaimed;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <div className="flex items-center space-x-3">
              <ReceiptIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Receipt Dashboard</h1>
                <p className="text-sm sm:text-base text-gray-600">Track who owes what</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleEdit} className="w-full sm:w-auto h-12 sm:h-auto">
              Edit Receipt
            </Button>
            <Button onClick={handleShare} className="w-full sm:w-auto h-12 sm:h-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 text-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <ReceiptIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{receipt.items.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Items</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">{receipt.participants.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Participants</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">${receipt.total?.toFixed(2) || '0.00'}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </Card>
          
          <Card className="p-4 sm:p-6 text-center">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm sm:text-base">$</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-900">${unclaimedAmount.toFixed(2)}</div>
            <div className="text-xs sm:text-sm text-gray-600">Unclaimed</div>
          </Card>
        </div>

        {/* Participant Breakdown */}
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold mb-4">Who Owes What</h3>
          <div className="space-y-3">
            {participantTotals.map(({ participant, total, items }) => (
              <div key={participant.id} className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{participant.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {items.length} item{items.length !== 1 ? 's' : ''} • {participant.phoneNumber}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-semibold text-base sm:text-lg">
                    ${total.toFixed(2)}
                  </div>
                  {total > 0 && (
                    <div className="text-sm text-green-600">Claimed</div>
                  )}
                </div>
              </div>
            ))}
            
            {participantTotals.length === 0 && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                No items claimed yet
              </div>
            )}
          </div>
        </Card>

        {/* Detailed Summary */}
        <SummaryView receipt={receipt} onEdit={handleEdit} />

        {/* Share Section */}
        <Card className="p-4 sm:p-6 mt-6 sm:mt-8 bg-blue-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Share with Participants</h3>
              <p className="text-blue-700 text-sm">
                Send this link to participants so they can claim their items
              </p>
            </div>
            <Button onClick={handleShare} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-12 sm:h-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
