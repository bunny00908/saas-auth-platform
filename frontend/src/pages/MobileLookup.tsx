import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Copy, CheckCircle } from 'lucide-react';

const MobileLookup: React.FC = () => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number.match(/^\d{10}$/)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/search/mobile', { number });
      setResult(response.data);
      toast.success('Search completed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch data');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    const resultText = JSON.stringify(result, null, 2);
    await navigator.clipboard.writeText(resultText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mobile Number Lookup</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter 10-digit Indian Mobile Number
            </label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="9876543210"
              className="input-field"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              'Searching...'
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Lookup Mobile Number
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search Results</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy Results'}
            </button>
          </div>
          
          <div className="space-y-3">
            {result.name && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.name}</p>
              </div>
            )}
            {result.father_name && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.father_name}</p>
              </div>
            )}
            {result.address && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.address}</p>
              </div>
            )}
            {result.circle && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Circle</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.circle}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLookup;
