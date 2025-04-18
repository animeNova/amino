'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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

  const uploadMutation = useMutation<UploadResponse, Error, File>({
    mutationFn: async (file: File) => {
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

      return response.data;
    },
  });

  const upload = (file: File) => {
    setProgress(0);
    return uploadMutation.mutate(file);
  };

  const uploadAsync = (file: File) => {
    setProgress(0);
    return uploadMutation.mutateAsync(file);
  };

  return {
    upload,
    uploadAsync,
    progress,
    isUploading: uploadMutation.isPending,
    isSuccess: uploadMutation.isSuccess,
    isError: uploadMutation.isError,
    error: uploadMutation.error,
    data: uploadMutation.data,
    reset: uploadMutation.reset,
  };
}