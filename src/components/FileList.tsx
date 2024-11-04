import React, { useEffect } from 'react';
import { FileText, Download, Share2, Trash2, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import { usePinata } from '../hooks/usePinata';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const FileList: React.FC = () => {
  const { user, files, setFiles, selectedFile, setSelectedFile } = useStore();
  const { listFiles } = usePinata();

  useEffect(() => {
    const fetchFiles = async () => {
      if (user?.email) {
        const fileList = await listFiles(user.email);
        setFiles(fileList);
      }
    };
    fetchFiles();
  }, [user?.email, listFiles, setFiles]);

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <select className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>All Files</option>
            <option>PDF Documents</option>
            <option>Images</option>
          </select>
          <select className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option>Most Recent</option>
            <option>Oldest</option>
            <option>Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden">
        {files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No files uploaded yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li 
                key={file.hash} 
                className={`py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedFile === file.hash ? 'bg-indigo-50' : ''
                }`}
                onClick={() => setSelectedFile(file.hash)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <FileText className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(file.uploadedAt), 'PP')} · {formatFileSize(file.size)} · {file.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('File downloaded!');
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Share link copied!');
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(file.hash);
                      }}
                      className={`p-1.5 rounded-full ${
                        selectedFile === file.hash
                          ? 'text-indigo-600 bg-indigo-100'
                          : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('File deleted!');
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};