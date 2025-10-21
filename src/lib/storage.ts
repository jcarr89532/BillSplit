import type { Receipt, Participant, ReceiptItem } from '@/types';

const STORAGE_KEYS = {
  RECEIPTS: 'receipt-splitter-receipts',
  CURRENT_RECEIPT: 'receipt-splitter-current-receipt',
  PARTICIPANTS: 'receipt-splitter-participants',
} as const;

// Receipt storage functions
export const saveReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  const existingIndex = receipts.findIndex(r => r.id === receipt.id);
  
  if (existingIndex >= 0) {
    receipts[existingIndex] = receipt;
  } else {
    receipts.push(receipt);
  }
  
  localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
};

export const getReceipts = (): Receipt[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
  return stored ? JSON.parse(stored) : [];
};

export const getReceipt = (id: string): Receipt | null => {
  const receipts = getReceipts();
  return receipts.find(r => r.id === id) || null;
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts();
  const filtered = receipts.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(filtered));
};

// Current receipt (for multi-step flow)
export const setCurrentReceipt = (receipt: Partial<Receipt>): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_RECEIPT, JSON.stringify(receipt));
};

export const getCurrentReceipt = (): Partial<Receipt> | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_RECEIPT);
  return stored ? JSON.parse(stored) : null;
};

export const clearCurrentReceipt = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_RECEIPT);
};

// Participant storage
export const saveParticipants = (participants: Participant[]): void => {
  localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
};

export const getParticipants = (): Participant[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
  return stored ? JSON.parse(stored) : [];
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateItemTotal = (item: ReceiptItem): number => {
  return item.price * item.quantity;
};

export const calculateReceiptTotal = (items: ReceiptItem[], tax: number, tip: number): number => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  return subtotal + tax + tip;
};
