import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Copy, CheckCircle, Calendar, MapPin, Info } from 'lucide-react';

const VehicleLookup: React.FC = () => {
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const formatVehicleNumber = (value: string) => {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!number.match(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)) {
      toast.error('Please enter a valid Indian vehicle number (e.g., KA19HV4003)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/search/vehicle', { number });
      setResult(response.data);
      toast.success('Vehicle information retrieved!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch vehicle data');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vehicle Number Lookup</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Indian Vehicle Registration Number
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(formatVehicleNumber(e.target.value))}
              placeholder="KA19HV4003"
              className="input-field uppercase"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Format: State Code + District Code + Series + Number (e.g., KA19HV4003)
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              'Fetching Vehicle Details...'
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Lookup Vehicle
              </>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Vehicle Information</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? <CheckCircle className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.owner_name && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Owner Name</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.owner_name}</p>
              </div>
            )}
            {result.vehicle_model && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Model</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.vehicle_model}</p>
              </div>
            )}
            {result.registration_date && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" /> Registration Date
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.registration_date}</p>
              </div>
            )}
            {result.rto && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> RTO Office
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.rto}</p>
              </div>
            )}
            {result.insurance_validity && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Insurance Validity</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.insurance_validity}</p>
              </div>
            )}
            {result.fuel_type && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.fuel_type}</p>
              </div>
            )}
            {result.engine_number && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Engine Number</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.engine_number}</p>
              </div>
            )}
            {result.chassis_number && (
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Chassis Number</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{result.chassis_number}</p>
              </div>
            )}
          </div>
          
          {result.fitness_validity && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Fitness Validity: {result.fitness_validity}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleLookup;
