import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser } from '../utils/storage';

// Create the authentication context
export const AuthContext = createContext();

// AuthProvider wraps app components to provide auth state & methods
export const AuthProvider = ({ children }) => {
  // Indicates whether we're loading stored user data
  const [isLoading, setIsLoading] = useState(true);
  // Holds the current user's token/id for API calls
  const [userToken, setUserToken] = useState(null);
  // Stores the current user object (e.g., id, name, email)
  const [user, setUser] = useState(null);

  // On mount, try to restore user session from persistent storage
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Retrieve stored user info (if any)
        const userData = await getCurrentUser();
        if (userData) {
          // If found, update user state and token
          setUser(userData);
          setUserToken(userData.id);
        }
      } catch (error) {
        // Log retrieval errors for debugging
        console.error('Error retrieving user data:', error);
      } finally {
        // Loading complete, hide any splash/loading UI
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []); // Empty array ensures this runs only once

  // Compose auth context value to expose to children
  const authContext = {
    isLoading,
    user,
    userToken,

    // Call this on successful login
    signIn: async (userData) => {
      setUser(userData);
      setUserToken(userData.id);
    },

    // Call this to clear session and logout
    signOut: async () => {
      try {
        await logoutUser();
        // Reset local state on logout
        setUser(null);
        setUserToken(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },

    // Call this after registration; implement real signup logic here
    signUp: async (userData) => {
      setUser(userData);
      setUserToken(userData.id);
    }
  };

  // Provide the authContext object to child components
  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
