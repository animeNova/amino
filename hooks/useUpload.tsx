'use client';

import { useState } from 'react';
import axios from 'axios';

interface UploadResponse {
  success: boolean;
  ipfsHash: string;
  pinataUrl: string;
  fileName: string;
  fileType: string;
  size: number;
}

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<UploadResponse | null>(null);

  const uploadAsync = async (file: File): Promise<UploadResponse> => {
    try {
      setIsUploading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      setProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const responseData = response.data;
      setData(responseData);
      setIsSuccess(true);
      return responseData;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(errorObj);
      setIsError(true);
      throw errorObj;
    } finally {
      setIsUploading(false);
    }
  };

  const upload = (file: File) => {
    uploadAsync(file).catch(() => {
      // Error is already handled in uploadAsync
    });
  };

  const reset = () => {
    setProgress(0);
    setIsUploading(false);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setData(null);
  };

  return {
    upload,
    uploadAsync,
    progress,
    isUploading,
    isSuccess,
    isError,
    error,
    data,
    reset,
  };
}