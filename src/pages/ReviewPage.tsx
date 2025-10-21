import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Receipt, ReceiptItem } from '@/types';
import { getCurrentReceipt, setCurrentReceipt, calculateReceiptTotal } from '@/lib/storage';
import { EditableTable } from '@/components/EditableTable';
import { TotalsCalculator } from '@/components/TotalsCalculator';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Receipt as ReceiptIcon } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Partial<Receipt>>({});
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [tax, setTax] = useState(0);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const currentReceipt = getCurrentReceipt();
    if (currentReceipt) {
      setReceipt(currentReceipt);
      setItems(currentReceipt.items || []);
      setTax(currentReceipt.tax || 0);
      setTip(currentReceipt.tip || 0);
    } else {
      // If no current receipt, redirect to home
      navigate('/');
    }
  }, [navigate]);

  const handleItemsChange = (newItems: ReceiptItem[]) => {
    setItems(newItems);
    const updatedReceipt = { ...receipt, items: newItems };
    setReceipt(updatedReceipt);
    setCurrentReceipt(updatedReceipt);
  };

  const handleTaxChange = (newTax: number) => {
    setTax(newTax);
    const updatedReceipt = { ...receipt, tax: newTax };
    setReceipt(updatedReceipt);
    setCurrentReceipt(updatedReceipt);
  };

  const handleTipChange = (newTip: number) => {
    setTip(newTip);
    const updatedReceipt = { ...receipt, tip: newTip };
    setReceipt(updatedReceipt);
    setCurrentReceipt(updatedReceipt);
  };

  const handleContinue = () => {
    if (items.length === 0) {
      alert('Please add at least one item to continue');
      return;
    }

    const total = calculateReceiptTotal(items, tax, tip);
    const updatedReceipt = { ...receipt, items, tax, tip, total };
    setCurrentReceipt(updatedReceipt);
    navigate('/share');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#2d3748', color: '#a0aec0' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4">
            <ReceiptIcon className="h-12 w-12" style={{ color: '#a0aec0' }} />
            <div>
              <h1 className="text-3xl font-light" style={{ color: '#a0aec0' }}>Review Receipt</h1>
              <p className="text-lg" style={{ color: '#a0aec0' }}>Edit items and verify totals</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Items Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <EditableTable
              items={items}
              onItemsChange={handleItemsChange}
            />
          </div>

          {/* Totals Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <TotalsCalculator
              items={items}
              tax={tax}
              tip={tip}
              onTaxChange={handleTaxChange}
              onTipChange={handleTipChange}
            />

            {/* Receipt Image Preview */}
            {receipt.imageUrl && (
              <Card className="p-4 mt-4 sm:mt-6">
                <h3 className="font-semibold mb-3">Receipt Image</h3>
                <img
                  src={receipt.imageUrl}
                  alt="Receipt"
                  className="w-full h-32 sm:h-48 object-contain rounded-lg border"
                />
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleContinue} 
            disabled={items.length === 0} 
            className="px-8 py-4 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-xl font-medium text-lg transition-all duration-300 disabled:opacity-50"
          >
            Continue to Participants
            <ArrowRight className="h-5 w-5 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
