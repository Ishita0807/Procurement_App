import { useState } from 'react';

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(25);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setProgress(50);

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      return result;
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = async (fileUrl: string, schema = null) => {
    setIsProcessing(true);
    setProgress(75);

    try {
      const response = await fetch('/api/process-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_url: fileUrl,
          json_schema: schema
        }),
      });

      const result = await response.json();
      setProgress(100);

      if (result.status !== 'success') {
        throw new Error(result.details || 'Processing failed');
      }

      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    uploadFile,
    processFile,
    isUploading,
    isProcessing,
    progress
  };
}