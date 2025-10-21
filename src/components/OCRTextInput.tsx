import React, { useState } from 'react';
import type { ReceiptItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { parseReceiptText, extractTaxAndTip } from '@/lib/ocr-parser';
import { FileText, Zap } from 'lucide-react';

interface OCRTextInputProps {
  onItemsExtracted: (items: ReceiptItem[]) => void;
  onTaxTipExtracted: (tax: number, tip: number) => void;
  className?: string;
}

export const OCRTextInput: React.FC<OCRTextInputProps> = ({
  onItemsExtracted,
  onTaxTipExtracted,
  className = ''
}) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParseText = () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      try {
        const items = parseReceiptText(text);
        const { tax, tip } = extractTaxAndTip(text);
        
        onItemsExtracted(items);
        onTaxTipExtracted(tax, tip);
        
        // Clear the text after successful parsing
        setText('');
      } catch (error) {
        console.error('Error parsing receipt text:', error);
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Manual Text Entry</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receipt-text">
            Paste receipt text or type items manually
          </Label>
          <Textarea
            id="receipt-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your receipt text here...&#10;&#10;Example:&#10;Burger $12.99&#10;Fries $4.50&#10;Drink $2.99&#10;Tax $1.65&#10;Tip $3.00"
            className="min-h-[200px]"
          />
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={handleParseText} 
            disabled={!text.trim() || isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Parse Text
              </>
            )}
          </Button>
          
          {text && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          <p className="font-medium mb-1">Supported formats:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Item Name $X.XX</li>
            <li>Item Name - $X.XX</li>
            <li>Item Name $X.XX x Quantity</li>
            <li>Item Name on one line, $X.XX on next line</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
