import { apiClient, ApiClient } from '../../../core/api';
import type { 
  ReceiptUploadResponse, 
  ReceiptUpdateRequest, 
  ReceiptUpdateResponse 
} from '../types';

// Receipt upload service using generic API client
export class ReceiptUploadService {
  private baseEndpoint = '/receipts';

  // Upload receipt image for OCR processing
  async uploadReceipt(imageFile: File): Promise<ReceiptUploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Create a custom API client instance without default Content-Type for FormData
    const customClient = new ApiClient({
      baseURL: apiClient.getBaseURL(),
      headers: {
        // Don't include Content-Type - let browser set it for FormData
      },
    });
    
    const response = await customClient.post<ReceiptUploadResponse>(
      `${this.baseEndpoint}/upload`,
      formData
    );

    return response.data;
  }

  // Get receipt by ID
  async getReceipt(receiptId: string): Promise<ReceiptUploadResponse> {
    const response = await apiClient.get<ReceiptUploadResponse>(
      `${this.baseEndpoint}/${receiptId}`
    );

    return response.data;
  }

  // Update receipt items and calculations
  async updateReceipt(
    receiptId: string, 
    updateData: ReceiptUpdateRequest
  ): Promise<ReceiptUpdateResponse> {
    const response = await apiClient.post<ReceiptUpdateResponse>(
      `${this.baseEndpoint}/${receiptId}/update`,
      updateData
    );

    return response.data;
  }

  // Delete receipt
  async deleteReceipt(receiptId: string): Promise<void> {
    await apiClient.post(`${this.baseEndpoint}/${receiptId}/delete`);
  }

  // Get all receipts for current user
  async getUserReceipts(): Promise<ReceiptUploadResponse[]> {
    const response = await apiClient.get<ReceiptUploadResponse[]>(
      `${this.baseEndpoint}/user`
    );

    return response.data;
  }
}

// Create and export service instance
export const receiptUploadService = new ReceiptUploadService();
