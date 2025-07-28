import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/axios';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  const { token, user } = res.data;
  setUser(user);
  setToken(token);
  await AsyncStorage.setItem('token', token);
  return user; // Asegúrate de retornar el objeto user
};

  const register = async (username, email, password) => {
  const res = await API.post('/auth/register', { username, email, password });
  const { token, user } = res.data;
  setUser(user);
  setToken(token);
  await AsyncStorage.setItem('token', token);
  return user; // Asegúrate de retornar el objeto user
};

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) setToken(savedToken);
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}