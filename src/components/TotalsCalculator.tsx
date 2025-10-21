import React from 'react';
import type { ReceiptItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface TotalsCalculatorProps {
  items: ReceiptItem[];
  tax: number;
  tip: number;
  onTaxChange: (tax: number) => void;
  onTipChange: (tip: number) => void;
  className?: string;
}

export const TotalsCalculator: React.FC<TotalsCalculatorProps> = ({
  items,
  tax,
  tip,
  onTaxChange,
  onTipChange,
  className = ''
}) => {
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + tax + tip;
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Receipt Totals</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax">Tax</Label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">$</span>
            <Input
              id="tax"
              type="number"
              step="0.01"
              min="0"
              value={tax}
              onChange={(e) => onTaxChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tip">Tip</Label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">$</span>
            <Input
              id="tip"
              type="number"
              step="0.01"
              min="0"
              value={tip}
              onChange={(e) => onTipChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="flex-1"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-green-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
