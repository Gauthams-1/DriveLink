
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from './Logo';
import { useRef, useState } from 'react';
import { authenticateUser, registerUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { User as UserType } from '@/lib/types';
import { saveUser } from '@/lib/data';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Car, Wrench, User as UserIcon } from 'lucide-react';

export function AuthPage() {
  const router = useRouter();
  const signInEmailRef = useRef<HTMLInputElement>(null);
  const signInPasswordRef = useRef<HTMLInputElement>(null);
  const signUpNameRef = useRef<HTMLInputElement>(null);
  const signUpEmailRef = useRef<HTMLInputElement>(null);
  const signUpPasswordRef = useRef<HTMLInputElement>(null);
  const [partnerType, setPartnerType] = useState<'owner' | 'mechanic' | 'driver'>('owner');
  
  const { toast } = useToast();

  const handleLoginSuccess = (user: UserType) => {
    saveUser({ ...user, isPartner: true });
    router.push('/partner');
  };

  const handleSignIn = async () => {
    const email = signInEmailRef.current?.value || '';
    const password = signInPasswordRef.current?.value || '';
    
    const user = await authenticateUser(email, password);

    if (user && user.isPartner) {
      handleLoginSuccess(user);
    } else {
        toast({
            title: "Sign In Failed",
            description: "Invalid Partner ID or password. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleSignUp = async () => {
    const name = signUpNameRef.current?.value || '';
    const email = signUpEmailRef.current?.value || '';
    const password = signUpPasswordRef.current?.value || '';
    
    if (!name || !email || !password) {
        toast({
            title: "Sign Up Failed",
            description: "Please fill in all fields.",
            variant: "destructive",
        });
        return;
    }
    
    try {
        const newUser = await registerUser({ name, email, password, partnerType, isPartner: true });
        handleLoginSuccess(newUser);
    } catch (error: any) {
        toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
            <Logo />
             <Tabs defaultValue="sign-in" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Partner Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Partner Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <Card>
                    <CardHeader>
                        <CardTitle>Partner Sign In</CardTitle>
                        <CardDescription>
                        Enter your credentials to access your partner dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-left">
                        <Label htmlFor="email-signin">Partner Email</Label>
                        <Input id="email-signin" type="email" placeholder="your-email@example.com" ref={signInEmailRef} required />
                        </div>
                        <div className="space-y-2 text-left">
                        <Label htmlFor="password-signin">Password</Label>
                        <Input id="password-signin" type="password" ref={signInPasswordRef} required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSignIn}>Sign In</Button>
                    </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="sign-up">
                    <Card>
                    <CardHeader>
                        <CardTitle>Become a Partner</CardTitle>
                        <CardDescription>
                        Create an account to list your services on DriveLink.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-left">
                           <Label>I am a...</Label>
                           <RadioGroup value={partnerType} onValueChange={(val) => setPartnerType(val as 'owner' | 'mechanic' | 'driver')} className="grid grid-cols-3 gap-2">
                                <div>
                                    <RadioGroupItem value="owner" id="owner" className="peer sr-only" />
                                    <Label htmlFor="owner" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm">
                                        <Car className="mb-2 h-5 w-5" />
                                        Owner
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="mechanic" id="mechanic" className="peer sr-only" />
                                    <Label htmlFor="mechanic" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm">
                                        <Wrench className="mb-2 h-5 w-5" />
                                        Mechanic
                                    </Label>
                                </div>
                                 <div>
                                    <RadioGroupItem value="driver" id="driver" className="peer sr-only" />
                                    <Label htmlFor="driver" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-sm">
                                        <UserIcon className="mb-2 h-5 w-5" />
                                        Driver
                                    </Label>
                                </div>
                           </RadioGroup>
                        </div>
                         <div className="space-y-2 text-left">
                           <Label htmlFor="name-signup">Full Name or Company</Label>
                           <Input id="name-signup" placeholder="Your Name" ref={signUpNameRef} required/>
                         </div>
                        <div className="space-y-2 text-left">
                           <Label htmlFor="email-signup">Email</Label>
                           <Input id="email-signup" type="email" placeholder="your-email@example.com" ref={signUpEmailRef} required/>
                        </div>
                        <div className="space-y-2 text-left">
                           <Label htmlFor="password-signup">Password</Label>
                           <Input id="password-signup" type="password" ref={signUpPasswordRef} required/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleSignUp}>Sign Up as Partner</Button>
                    </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
