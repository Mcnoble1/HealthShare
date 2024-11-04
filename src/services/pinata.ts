import axios from 'axios';

const PINATA_API_URL = 'https://api.pinata.cloud';

export interface FileAccess {
  userEmail: string;
  accessLevel: 'read' | 'write';
  expiresAt: string;
}

export interface FileMetadata {
  hash: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  access: FileAccess[];
}

class PinataService {
  private readonly apiKey: string;
  private readonly secretKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY;
    this.secretKey = import.meta.env.VITE_PINATA_API_SECRET;
    
    if (!this.apiKey || !this.secretKey) {
      throw new Error('Pinata API credentials are not configured');
    }
  }

  private get headers() {
    return {
      'pinata_api_key': this.apiKey,
      'pinata_secret_api_key': this.secretKey,
    };
  }

  async uploadFile(file: File, access: FileAccess[]): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const metadata = {
        name: file.name,
        keyvalues: {
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          access: JSON.stringify(access),
        },
      };

      formData.append('pinataMetadata', JSON.stringify(metadata));

      const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...this.headers,
            'Content-Type': 'multipart/form-data',
          },
          maxBodyLength: Infinity,
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error('Failed to upload file to Pinata');
    }
  }

  async grantAccess(fileHash: string, access: FileAccess): Promise<void> {
    try {
      const metadata = await this.getMetadata(fileHash);
      const currentAccess = JSON.parse(metadata.keyvalues.access || '[]');
      
      const updatedAccess = [...currentAccess, access];
      
      await this.updateMetadata(fileHash, {
        name: metadata.name,
        keyvalues: {
          ...metadata.keyvalues,
          access: JSON.stringify(updatedAccess),
        },
      });
    } catch (error) {
      console.error('Error granting access:', error);
      throw new Error('Failed to grant access');
    }
  }

  async revokeAccess(fileHash: string, userEmail: string): Promise<void> {
    try {
      const metadata = await this.getMetadata(fileHash);
      const currentAccess = JSON.parse(metadata.keyvalues.access || '[]');
      
      const updatedAccess = currentAccess.filter(
        (access: FileAccess) => access.userEmail !== userEmail
      );
      
      await this.updateMetadata(fileHash, {
        name: metadata.name,
        keyvalues: {
          ...metadata.keyvalues,
          access: JSON.stringify(updatedAccess),
        },
      });
    } catch (error) {
      console.error('Error revoking access:', error);
      throw new Error('Failed to revoke access');
    }
  }

  async listFiles(userEmail: string): Promise<FileMetadata[]> {
    try {
      const response = await axios.get(
        `${PINATA_API_URL}/data/pinList`,
        {
          headers: this.headers,
        }
      );

      return response.data.rows
        .filter((pin: any) => {
          try {
            const access = JSON.parse(pin.metadata.keyvalues.access || '[]');
            return access.some((a: FileAccess) => a.userEmail === userEmail);
          } catch {
            return false;
          }
        })
        .map((pin: any) => ({
          hash: pin.ipfs_pin_hash,
          name: pin.metadata.name,
          type: pin.metadata.keyvalues.type,
          size: parseInt(pin.metadata.keyvalues.size),
          uploadedAt: pin.metadata.keyvalues.uploadedAt,
          access: JSON.parse(pin.metadata.keyvalues.access || '[]'),
        }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }

  private async getMetadata(fileHash: string) {
    try {
      const response = await axios.get(
        `${PINATA_API_URL}/data/pinList/${fileHash}`,
        { headers: this.headers }
      );
      return response.data.rows[0].metadata;
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  private async updateMetadata(fileHash: string, metadata: any): Promise<void> {
    try {
      await axios.put(
        `${PINATA_API_URL}/pinning/hashMetadata`,
        {
          ipfsPinHash: fileHash,
          name: metadata.name,
          keyvalues: metadata.keyvalues,
        },
        { headers: this.headers }
      );
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update file metadata');
    }
  }
}

export const pinataService = new PinataService();