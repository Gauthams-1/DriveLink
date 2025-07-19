
'use client';

import { CustomerProfile } from '@/components/CustomerProfile';
import { useState, useEffect } from 'react';
import { getCurrentUser, saveUser, logoutUser } from '@/lib/data';
import type { User as UserType } from '@/lib/types';
import { AuthPage } from '@/components/AuthPage';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogin = (name: string, email: string) => {
    const loggedInUser: UserType = {
      name: name || 'New User',
      email: email || 'user@example.com',
      phone: '',
      address: '',
      licenseNumber: '',
      aadhaarNumber: '',
      isVerified: false,
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${name || 'U'}`,
      memberSince: new Date(),
      isGuest: false,
    };
    saveUser(loggedInUser);
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    logoutUser();
    setUser(getCurrentUser());
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (user.isGuest) {
    return <AuthPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <CustomerProfile />
    </div>
  );
}
