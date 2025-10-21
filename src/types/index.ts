// Core data types for the Receipt Splitter app

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  claimedBy: string[]; // Array of participant IDs
}

export interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface Receipt {
  id: string;
  imageUrl?: string;
  items: ReceiptItem[];
  participants: Participant[];
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
}

export interface Claim {
  participantId: string;
  itemIds: string[];
  subtotal: number;
}

// Navigation types
export type Page = 'home' | 'review' | 'share' | 'claim' | 'dashboard';
