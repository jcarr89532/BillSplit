// Receipt upload types
export interface ReceiptUploadRequest {
  image: File;
}

export interface ReceiptUploadResponse {
  id: string;
  imageUrl: string;
  extractedText: string;
  items: ReceiptItem[];
  total: number;
  tax: number;
  tip: number;
  createdAt: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface ReceiptUpdateRequest {
  items: ReceiptItem[];
  tax: number;
  tip: number;
}

export interface ReceiptUpdateResponse {
  id: string;
  items: ReceiptItem[];
  tax: number;
  tip: number;
  total: number;
  updatedAt: string;
}
