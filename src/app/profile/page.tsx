
'use client';

import { CustomerProfile } from '@/components/CustomerProfile';
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/data';
import type { User as UserType } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCircle2, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(getCurrentUser()); // Re-set user to guest
    router.push('/'); // Redirect to homepage
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user || user.isGuest) {
    return (
        <div className="container mx-auto py-16 px-4 text-center">
            <UserCircle2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold font-headline">Access Your Profile</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Please log in or create an account to view your profile and reservations.
            </p>
            <Button asChild className="mt-6">
                <Link href="/login">Login or Sign Up</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
       <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                <p className="text-muted-foreground">Manage your personal information and booking history.</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      <CustomerProfile />
    </div>
  );
}
