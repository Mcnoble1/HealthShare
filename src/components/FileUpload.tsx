import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { usePinata } from '../hooks/usePinata';
import { useStore } from '../store/useStore';

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/*': ['.png', '.jpg', '.jpeg'],
};

export const FileUpload: React.FC = () => {
  const { user } = useStore();
  const { uploadFile, isLoading, listFiles } = usePinata();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user?.email) {
      return;
    }

    try {
      for (const file of acceptedFiles) {
        await uploadFile(file, [
          {
            userEmail: user.email,
            accessLevel: 'write',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      }
      // Refresh the file list after upload
      await listFiles(user.email);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [uploadFile, listFiles, user?.email]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    disabled: isLoading || !user?.email,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-10 h-10 mx-auto mb-3 ${isLoading ? 'text-indigo-400 animate-pulse' : 'text-gray-400'}`} />
      <p className="text-sm font-medium text-gray-900 mb-1">
        {isLoading ? 'Uploading...' : isDragActive ? 'Drop your files here' : 'Drag & drop files here'}
      </p>
      <p className="text-xs text-gray-500">
        or click to select files
      </p>
      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Supported: PDF documents, Images (.jpg, .png)
        </p>
      </div>
    </div>
  );
};