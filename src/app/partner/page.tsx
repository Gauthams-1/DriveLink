
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
import { PartnerDashboard } from '@/components/PartnerDashboard';
import { FleetManagement } from '@/components/FleetManagement';
import { LogOut, PanelLeft, DollarSign, Car, BarChart, Settings, LifeBuoy } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { getCurrentUser, logoutUser } from '@/lib/data';
import type { User as UserType } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PartnerPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.isGuest || !user.isPartner)) {
      router.push('/partner/login');
    }
  }, [loading, user, router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  if (loading || !user || user.isGuest || !user.isPartner) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar className="border-r" side="left" collapsible="icon">
            <SidebarHeader>
                 <div className="p-2 flex items-center gap-2">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setActiveTab('dashboard')}
                        isActive={activeTab === 'dashboard'}
                        tooltip={{ children: 'Dashboard' }}
                        >
                        <BarChart />
                        <span>Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setActiveTab('fleet')}
                        isActive={activeTab === 'fleet'}
                        tooltip={{ children: 'My Fleet' }}
                        >
                        <Car />
                        <span>My Fleet</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton
                        onClick={() => setActiveTab('earnings')}
                        isActive={activeTab === 'earnings'}
                        tooltip={{ children: 'Earnings' }}
                        >
                        <DollarSign />
                        <span>Earnings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={{ children: 'Support' }}>
                            <Link href="/support">
                                <LifeBuoy />
                                <span>Support</span>
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
          <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
             <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-2xl capitalize">{activeTab.replace('-', ' ')}</h1>
            </div>
             <div className="flex items-center gap-4">
                <Button variant="outline" asChild><Link href="/profile">View My Profile</Link></Button>
                <Avatar>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
             </div>
          </header>

          <main className="flex-1 p-6">
            {activeTab === 'dashboard' && <PartnerDashboard />}
            {activeTab === 'fleet' && <FleetManagement />}
            {activeTab === 'earnings' && <div>Earnings Details Coming Soon</div>}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
