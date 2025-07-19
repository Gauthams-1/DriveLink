
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CustomerProfile } from '@/components/CustomerProfile';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { Home, LogOut, PanelLeft, Shield, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { getCurrentUser, logoutUser, saveUser } from '@/lib/data';
import type { User as UserType } from '@/lib/types';
import { AuthPage } from '@/components/AuthPage';

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r" side="left" collapsible="icon">
            <SidebarContent className="p-2">
                <div className="p-2 mb-4">
                    <Logo />
                </div>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setActiveTab('profile')}
                        isActive={activeTab === 'profile'}
                        tooltip={{ children: 'My Profile' }}
                        >
                        <User />
                        <span>My Profile</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setActiveTab('partner')}
                        isActive={activeTab === 'partner'}
                        tooltip={{ children: 'Partner Dashboard' }}
                        >
                        <Shield />
                        <span>Partner Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: 'Home' }}>
                            <Link href="/">
                                <Home />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Logout' }}>
                            <LogOut />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
             <SidebarTrigger className="md:hidden"/>
            <h1 className="text-lg font-semibold md:text-2xl capitalize">{activeTab.replace('-', ' ')}</h1>
          </header>

          <main className="flex-1 p-6">
            {activeTab === 'profile' && <CustomerProfile />}
            {activeTab === 'partner' && <PartnerDashboard />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

