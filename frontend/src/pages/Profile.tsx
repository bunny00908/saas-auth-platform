import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
              <p className="text-gray-900 dark:text-white capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
