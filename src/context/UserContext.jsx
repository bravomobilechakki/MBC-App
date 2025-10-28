import React, { createContext, useState } from 'react';
import { fetchUserProfile as fetchUserProfileApi } from './UserActions';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const fetchUserProfile = async () => {
    await fetchUserProfileApi(token, setUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
