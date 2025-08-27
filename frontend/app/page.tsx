// frontend/app/page.js
'use client';
import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useClerk } from '@clerk/nextjs';
import { FileDown, FileUp, Trash2, Cloud, Upload, Download, LogOut, Loader2 } from 'lucide-react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [fileToUpload, setFileToUpload] = useState(null);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  const API_BASE_URL = "https://storebackend-djh4bzfracekhhfk.southeastasia-01.azurewebsites.net/api";
  
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken({ template: 'simple-jwt' });
      const response = await fetch(`${API_BASE_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data);
    } catch (error) {
      showMessage(`Error fetching files: ${error.message}`, 'error');
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload) {
      showMessage('Please select a file to upload.', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const token = await getToken({ template: 'simple-jwt' });
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.text();
      showMessage(result);
      setFileToUpload(null);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      showMessage(`Error uploading file: ${error.message}`, 'error');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const token = await getToken({ template: 'simple-jwt' });
      const response = await fetch(`${API_BASE_URL}/delete/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const result = await response.text();
      showMessage(result);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      showMessage(`Error deleting file: ${error.message}`, 'error');
      console.error('Error deleting file:', error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const token = await getToken({ template: 'simple-jwt' });
      const response = await fetch(`${API_BASE_URL}/download/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename; // Set the filename for download
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showMessage('Download started successfully');
    } catch (error) {
      showMessage(`Error downloading file: ${error.message}`, 'error');
      console.error('Error downloading file:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchFiles();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">StorAnything</h1>
            </div>
            <SignedIn>
              <div className="flex items-center space-x-4">
                <UserButton />
                <button 
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </SignedIn>
          </header>

          {/* Message Alert */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {message}
            </div>
          )}

          <SignedOut>
            {/* Signed Out State */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Welcome to StorAnything
                </h2>
                <p className="text-gray-600 mb-6">
                  Your secure cloud storage solution. Sign in to start storing and managing your files.
                </p>
                <SignInButton>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Sign In to Get Started
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            {/* Upload Section */}
            <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <Upload className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Upload Files</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose a file
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setFileToUpload(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-colors"
                  />
                </div>
                <button 
                  onClick={handleUpload}
                  disabled={!fileToUpload || uploading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 min-w-[120px] justify-center"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                </button>
              </div>
              
              {fileToUpload && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Selected file:</strong> {fileToUpload.name}
                  </p>
                </div>
              )}
            </div>

            {/* Files List Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <Download className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Your Files</h2>
                <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {files.length} files
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="ml-3 text-gray-600">Loading your files...</span>
                </div>
              ) : files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileUp className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700 truncate" title={file.filename}>
                          {file.filename}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          onClick={() => handleDownload(file.filename)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <FileDown className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(file.filename)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No files yet</h3>
                  <p className="text-gray-500">Upload your first file to get started!</p>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}