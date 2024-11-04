import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { AccessControl } from './components/AccessControl';
import { useStore } from './store/useStore';

function App() {
  const { selectedFile } = useStore();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Records Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Securely manage and share your health records with healthcare providers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Records</h2>
                <FileUpload />
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Access Management</h2>
                <AccessControl fileHash={selectedFile || undefined} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Records</h2>
              <FileList />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </Layout>
  );
}

export default App;