
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

export function AuthPage({ onLoginSuccess }: { onLoginSuccess: (name: string, email: string) => void }) {
  const signInEmailRef = useRef<HTMLInputElement>(null);
  const signInPasswordRef = useRef<HTMLInputElement>(null);
  const signUpNameRef = useRef<HTMLInputElement>(null);
  const signUpEmailRef = useRef<HTMLInputElement>(null);
  const signUpPasswordRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const handleSignIn = () => {
    const email = signInEmailRef.current?.value || '';
    const password = signInPasswordRef.current?.value || '';
    
    const user = authenticateUser(email, password);

    if (user) {
      onLoginSuccess(user.name, user.email);
    } else {
        toast({
            title: "Sign In Failed",
            description: "Invalid Owner ID or password. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleSignUp = () => {
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
        const newUser = registerUser({ name, email, password });
        onLoginSuccess(newUser.name, newUser.email);
    } catch (error: any) {
        toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
            <Logo />
             <Tabs defaultValue="sign-in" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                    <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="sign-in">
                    <Card>
                    <CardHeader>
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                        Enter your credentials to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 text-left">
                        <Label htmlFor="email-signin">Owner ID</Label>
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
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                        Create an account to get started with DriveLink.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2 text-left">
                           <Label htmlFor="name-signup">Owner ID (Name)</Label>
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
                        <Button className="w-full" onClick={handleSignUp}>Sign Up</Button>
                    </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
