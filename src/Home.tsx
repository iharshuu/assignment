// Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

// Utility functions for authentication
const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

interface UserProfile {
  email: string | null;
  createdAt: string;
  instituteId: string | null;
  profileImageUrl: string | null;
  partnerCode: string | null;
  state: string | null;
  city: string | null;
  currentQualification: string;
  gender: string | null;
  grade: string | null;
  updatedAt: string;
  partnerId: string | null;
  fullName: string | null;
  dob: string | null;
}

const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch('https://dev.api.infigon.app/user/get-profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Error while checking authentication:', error);
    return false;
  }
};

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfile | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const isAuthenticatedResult = await isAuthenticated();
      setIsAuthenticatedUser(isAuthenticatedResult);
      setLoading(false);

      if (!isAuthenticatedResult) {
        navigate('/');
      } else {
        const accessToken = getAccessToken();
        const response = await fetch('https://dev.api.infigon.app/user/get-profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data: UserProfile = await response.json();
          setOriginalData(data);
        } else {
          console.error('Error fetching user profile data:', response.statusText);
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  if (loading) {
    return <div className="bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          <FaSignOutAlt className="mr-2" size={20} /> Logout
        </button>
        
        <h2 className="text-2xl sm:text-2xl md:text-2xl font-bold mt-6 mb-6 text-center text-gray-800">Welcome to the Home Page!</h2>
        <div className="grid grid-cols-1 gap-4">
          {originalData &&
            Object.entries(originalData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <p className="text-sm font-medium text-gray-600">{key}</p>
                <p className="mt-1 text-lg">{value !== null ? value : 'N/A'}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
