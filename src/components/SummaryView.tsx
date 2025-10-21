import React from 'react';
import type { Receipt, Participant, ReceiptItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, Users } from 'lucide-react';

interface SummaryViewProps {
  receipt: Receipt;
  onEdit?: () => void;
  className?: string;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  receipt,
  onEdit,
  className = ''
}) => {
  const calculateItemTotal = (item: ReceiptItem) => {
    return item.price * item.quantity;
  };

  const calculateSubtotal = () => {
    return receipt.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const getParticipantById = (id: string) => {
    return receipt.participants.find(p => p.id === id);
  };

  const getParticipantTotals = () => {
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

  const participantTotals = getParticipantTotals();
  const subtotal = calculateSubtotal();
  const total = subtotal + receipt.tax + receipt.tip;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Receipt Summary */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Receipt Summary</h2>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              Edit Receipt
            </Button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({receipt.items.length})</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${receipt.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tip</span>
            <span className="font-medium">${receipt.tip.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Participants Summary */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Participants ({receipt.participants.length})</h3>
        </div>
        
        <div className="space-y-3">
          {participantTotals.map(({ participant, total, items }) => (
            <div key={participant.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{participant.name}</div>
                <div className="text-sm text-gray-500">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${total.toFixed(2)}</div>
                {total > 0 && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Claimed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Items Breakdown */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Items Breakdown</h3>
        </div>
        
        <div className="space-y-2">
          {receipt.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                  {item.claimedBy.length > 0 && (
                    <span className="ml-2">
                      • Claimed by {item.claimedBy.map(id => getParticipantById(id)?.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">${calculateItemTotal(item).toFixed(2)}</div>
                {item.claimedBy.length === 0 && (
                  <div className="text-sm text-gray-400">Unclaimed</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
