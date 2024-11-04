import { create } from 'zustand';
import { FileAccess } from '../services/pinata';

interface User {
  email: string;
  name: string;
  role: string;
}

export interface File {
  hash: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  access: FileAccess[];
}

interface Store {
  user: User | null;
  files: File[];
  selectedFile: string | null;
  setUser: (user: User | null) => void;
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  removeFile: (hash: string) => void;
  updateFileAccess: (hash: string, access: FileAccess[]) => void;
  setSelectedFile: (hash: string | null) => void;
}

export const useStore = create<Store>((set) => ({
  user: { 
    email: 'demo@example.com', 
    name: 'Demo User',
    role: 'Patient'
  },
  files: [],
  selectedFile: null,
  setUser: (user) => set({ user }),
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ 
    files: [...state.files, file] 
  })),
  removeFile: (hash) => set((state) => ({
    files: state.files.filter((f) => f.hash !== hash),
    selectedFile: state.selectedFile === hash ? null : state.selectedFile,
  })),
  updateFileAccess: (hash, access) => set((state) => ({
    files: state.files.map((f) => 
      f.hash === hash ? { ...f, access } : f
    ),
  })),
  setSelectedFile: (hash) => set({ selectedFile: hash }),
}));