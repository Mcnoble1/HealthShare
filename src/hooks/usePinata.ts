import { useState, useCallback } from 'react';
import { pinataService, FileAccess, FileMetadata } from '../services/pinata';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export function usePinata() {
  const [isLoading, setIsLoading] = useState(false);
  const { addFile, setFiles } = useStore();

  const uploadFile = useCallback(async (file: File, access: FileAccess[]) => {
    setIsLoading(true);
    try {
      const metadata = await pinataService.uploadFile(file, access);
      const newFile: FileMetadata = {
        hash: metadata.hash,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        access,
      };
      addFile(newFile);
      toast.success('File uploaded successfully');
      return metadata.hash;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addFile]);

  const listFiles = useCallback(async (userEmail: string) => {
    setIsLoading(true);
    try {
      const files = await pinataService.listFiles(userEmail);
      setFiles(files);
      return files;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to list files';
      toast.error(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [setFiles]);

  const revokeAccess = useCallback(async (fileHash: string, userEmail: string) => {
    setIsLoading(true);
    try {
      await pinataService.revokeAccess(fileHash, userEmail);
      toast.success('Access revoked successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revoke access';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const grantAccess = useCallback(async (fileHash: string, access: FileAccess) => {
    setIsLoading(true);
    try {
      await pinataService.grantAccess(fileHash, access);
      toast.success('Access granted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to grant access';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    uploadFile,
    revokeAccess,
    grantAccess,
    listFiles,
  };
}