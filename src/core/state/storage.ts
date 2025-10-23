const STORAGE_KEYS = {
  RECEIPTS: 'receipt-splitter-receipts',
  CURRENT_RECEIPT: 'receipt-splitter-current-receipt',
  PARTICIPANTS: 'receipt-splitter-participants',
} as const;

// Current receipt (for multi-step flow)
export const setCurrentReceipt = (receipt: any): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_RECEIPT, JSON.stringify(receipt));
};

export const getCurrentReceipt = (): any | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_RECEIPT);
  return stored ? JSON.parse(stored) : null;
};

export const clearCurrentReceipt = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_RECEIPT);
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
