import React, { useState, useEffect } from 'react';
import { UserPlus, X, AlertCircle, Loader2 } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { usePinata } from '../hooks/usePinata';
import { FileAccess } from '../services/pinata';

export const AccessControl: React.FC<{ fileHash?: string }> = ({ fileHash }) => {
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'read' | 'write'>('read');
  const [expiresAt, setExpiresAt] = useState(
    format(new Date().setMonth(new Date().getMonth() + 3), 'yyyy-MM-dd')
  );
  const { user, files, updateFileAccess } = useStore();
  const { grantAccess, revokeAccess, isLoading } = usePinata();

  const currentFile = fileHash ? files.find(f => f.hash === fileHash) : null;
  const sharedUsers = currentFile?.access || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !fileHash) return;

    try {
      const newAccess: FileAccess = {
        userEmail: email,
        accessLevel,
        expiresAt: new Date(expiresAt).toISOString(),
      };

      await grantAccess(fileHash, newAccess);
      updateFileAccess(fileHash, [...sharedUsers, newAccess]);

      setEmail('');
      setAccessLevel('read');
      setExpiresAt(format(new Date().setMonth(new Date().getMonth() + 3), 'yyyy-MM-dd'));
    } catch (error) {
      console.error('Failed to grant access:', error);
    }
  };

  const handleRevoke = async (userEmail: string) => {
    if (!fileHash) return;

    try {
      await revokeAccess(fileHash, userEmail);
      updateFileAccess(
        fileHash,
        sharedUsers.filter(access => access.userEmail !== userEmail)
      );
    } catch (error) {
      console.error('Failed to revoke access:', error);
    }
  };

  if (!fileHash) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Select a file to manage access</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Provider's Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              placeholder="doctor@hospital.com"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="access" className="block text-sm font-medium text-gray-700">
              Access Level
            </label>
            <select
              id="access"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as 'read' | 'write')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              disabled={isLoading}
            >
              <option value="read">View Only</option>
              <option value="write">View & Comment</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="expires" className="block text-sm font-medium text-gray-700">
            Access Expires On
          </label>
          <input
            type="date"
            id="expires"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          Grant Access
        </button>
      </form>

      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-4">Current Access List</h4>
        {sharedUsers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No access has been granted yet
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {sharedUsers.map((access, index) => {
              const isExpired = isAfter(new Date(), new Date(access.expiresAt));
              return (
                <li key={index} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{access.userEmail}</p>
                        {isExpired && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Expired
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Access Level: {access.accessLevel} · Expires: {format(new Date(access.expiresAt), 'PP')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRevoke(access.userEmail)}
                      disabled={isLoading}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Revoke access"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};