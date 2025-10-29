import { useApi } from '../../../shared/hooks/useApi';

import { receiptUploadService } from '../services/receiptUpload';
import type { ReceiptUpdateRequest } from '../types';

// Hook for uploading receipts
export function useReceiptUpload() {
  const uploadApi = useApi(receiptUploadService.uploadReceipt.bind(receiptUploadService));

  const uploadReceipt = async (imageFile: File) => {
    return uploadApi.execute(imageFile);
  };

  return {
    uploadReceipt,
    loading: uploadApi.loading,
    data: uploadApi.data,
    error: uploadApi.error,
    reset: uploadApi.reset,
  };
}

// Hook for getting a specific receipt
export function useReceipt(receiptId?: string) {
  const getReceiptApi = useApi(
    receiptId ? () => receiptUploadService.getReceipt(receiptId) : () => Promise.resolve(null)
  );

  return {
    receipt: getReceiptApi.data,
    loading: getReceiptApi.loading,
    error: getReceiptApi.error,
    refetch: getReceiptApi.execute,
  };
}

// Hook for updating receipt
export function useReceiptUpdate() {
  const updateApi = useApi(receiptUploadService.updateReceipt.bind(receiptUploadService));

  const updateReceipt = async (receiptId: string, updateData: ReceiptUpdateRequest) => {
    return updateApi.execute(receiptId, updateData);
  };

  return {
    updateReceipt,
    loading: updateApi.loading,
    data: updateApi.data,
    error: updateApi.error,
    reset: updateApi.reset,
  };
}

// Hook for getting user's receipts
export function useUserReceipts() {
  const receiptsApi = useApi(receiptUploadService.getUserReceipts.bind(receiptUploadService));

  const getUserReceipts = async () => {
    return receiptsApi.execute();
  };

  return {
    getUserReceipts,
    receipts: receiptsApi.data,
    loading: receiptsApi.loading,
    error: receiptsApi.error,
    reset: receiptsApi.reset,
  };
}
