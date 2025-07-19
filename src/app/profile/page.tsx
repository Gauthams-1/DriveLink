
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CustomerProfile } from '@/components/CustomerProfile';
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { Home, PanelLeft, Shield, User } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

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
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
             <Link href="/">
                <Button variant="outline" size="icon">
                    <Home className="h-4 w-4" />
                </Button>
             </Link>
            <h1 className="text-lg font-semibold md:text-2xl">My Account</h1>
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
