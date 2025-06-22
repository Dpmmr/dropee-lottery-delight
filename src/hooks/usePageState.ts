
import { useState } from 'react';

export const usePageState = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const adminLogin = () => {
    if (adminPassword === '000000') {
      setIsAdmin(true);
      setCurrentPage('admin');
      setAdminPassword('');
    } else {
      alert('Invalid password!');
    }
  };

  return {
    currentPage,
    setCurrentPage,
    isAdmin,
    setIsAdmin,
    adminPassword,
    setAdminPassword,
    showPassword,
    setShowPassword,
    adminLogin
  };
};
