'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StorePage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'shared'

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('description', description);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a shareable link (in a real app, this would come from your backend)
      const randomId = Math.random().toString(36).substring(2, 8);
      setShareLink(`https://storeanything.com/share/${randomId}`);
      
      setFiles([]);
      setDescription('');
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Store Anything</h1>
          <button 
            onClick={() => router.push('/logout')}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Files
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'shared' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('shared')}
          >
            Shared With Me
          </button>
        </div>

        {activeTab === 'upload' ? (
          /* Upload Tab */
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* File Drop Zone */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-700">Drag and drop files here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-400">Supports any file type</p>
              </label>
            </div>

            {/* Selected Files Preview */}
            {files.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Selected Files ({files.length})</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="truncate max-w-xs">{file.name}</span>
                        <span className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What are you storing?"
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isLoading || files.length === 0}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${(isLoading || files.length === 0) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {isLoading ? 'Storing...' : 'Store It!'}
            </button>

            {/* Share Link */}
            {shareLink && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Shareable Link:</p>
                <div className="flex">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-white text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                      alert('Link copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Shared With Me Tab */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">Files Shared With You</h2>
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-gray-500">No shared files yet</p>
              <p className="text-sm text-gray-400 mt-1">When someone shares files with you, they'll appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}