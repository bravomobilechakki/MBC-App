import React, { createContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfile as fetchUserProfileApi } from './UserActions';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const fetchUserProfile = async () => {
    await fetchUserProfileApi(token, setUser);
  };

  const updateUser = async (newUserData) => {
    setUser(newUserData);
    await AsyncStorage.setItem('user', JSON.stringify(newUserData));
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, token, setToken, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
