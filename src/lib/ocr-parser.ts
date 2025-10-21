import type { ReceiptItem } from '@/types';
import { generateId } from './storage';

/**
 * Simple OCR parser stub that extracts items from receipt text
 * This is a basic implementation using regex patterns
 * In a real app, this would integrate with OCR services like Google Vision API
 */
export const parseReceiptText = (text: string): ReceiptItem[] => {
  if (!text.trim()) return [];

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const items: ReceiptItem[] = [];

  // Common patterns for receipt items
  const patterns = [
    // Pattern 1: "Item Name $X.XX" or "Item Name $X.XX Qty: N"
    /^(.+?)\s+\$(\d+\.?\d*)(?:\s+Qty:\s*(\d+))?$/,
    // Pattern 2: "Item Name - $X.XX"
    /^(.+?)\s*-\s*\$(\d+\.?\d*)$/,
    // Pattern 3: "Item Name $X.XX x N"
    /^(.+?)\s+\$(\d+\.?\d*)\s+x\s*(\d+)$/,
    // Pattern 4: "Item Name" on one line, "$X.XX" on next line
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip common non-item lines
    if (isNonItemLine(line)) continue;

    let item: Partial<ReceiptItem> | null = null;

    // Try each pattern
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const name = match[1].trim();
        const price = parseFloat(match[2]);
        const quantity = match[3] ? parseInt(match[3]) : 1;

        if (name && !isNaN(price) && price > 0) {
          item = {
            id: generateId(),
            name: cleanItemName(name),
            price,
            quantity,
            claimedBy: []
          };
          break;
        }
      }
    }

    // Check for split line pattern (name on one line, price on next)
    if (!item && i < lines.length - 1) {
      const nextLine = lines[i + 1];
      const priceMatch = nextLine.match(/^\$(\d+\.?\d*)$/);
      
      if (priceMatch) {
        const name = line.trim();
        const price = parseFloat(priceMatch[1]);
        
        if (name && !isNaN(price) && price > 0 && !isNonItemLine(name)) {
          item = {
            id: generateId(),
            name: cleanItemName(name),
            price,
            quantity: 1,
            claimedBy: []
          };
          i++; // Skip the next line since we used it
        }
      }
    }

    if (item) {
      items.push(item as ReceiptItem);
    }
  }

  return items;
};

/**
 * Clean up item names by removing common receipt artifacts
 */
const cleanItemName = (name: string): string => {
  return name
    .replace(/^\d+\s*/, '') // Remove leading numbers
    .replace(/\s+$/, '') // Remove trailing spaces
    .replace(/^[^\w\s]+/, '') // Remove leading special characters
    .trim();
};

/**
 * Check if a line is likely not an item (totals, taxes, etc.)
 */
const isNonItemLine = (line: string): boolean => {
  const nonItemPatterns = [
    /^total/i,
    /^subtotal/i,
    /^tax/i,
    /^tip/i,
    /^discount/i,
    /^change/i,
    /^cash/i,
    /^card/i,
    /^visa/i,
    /^mastercard/i,
    /^amex/i,
    /^receipt/i,
    /^thank/i,
    /^date/i,
    /^time/i,
    /^store/i,
    /^address/i,
    /^phone/i,
    /^\d{2}\/\d{2}\/\d{4}/, // Date patterns
    /^\d{2}:\d{2}/, // Time patterns
    /^#\d+/, // Receipt numbers
    /^transaction/i,
    /^authorization/i,
    /^ref/i,
    /^void/i,
    /^return/i,
    /^exchange/i,
  ];

  return nonItemPatterns.some(pattern => pattern.test(line));
};

/**
 * Extract tax and tip amounts from receipt text
 */
export const extractTaxAndTip = (text: string): { tax: number; tip: number } => {
  const lines = text.split('\n').map(line => line.trim());
  let tax = 0;
  let tip = 0;

  for (const line of lines) {
    // Tax patterns
    const taxMatch = line.match(/tax[:\s]*\$?(\d+\.?\d*)/i);
    if (taxMatch) {
      tax = parseFloat(taxMatch[1]);
    }

    // Tip patterns
    const tipMatch = line.match(/tip[:\s]*\$?(\d+\.?\d*)/i);
    if (tipMatch) {
      tip = parseFloat(tipMatch[1]);
    }
  }

  return { tax, tip };
};
