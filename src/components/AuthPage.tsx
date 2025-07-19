
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

export function AuthPage() {
  // In a real app, these handlers would call your authentication service
  const handleSignIn = () => {
    alert('Sign in functionality not implemented.');
  };

  const handleSignUp = () => {
    alert('Sign up functionality not implemented.');
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
                        <Label htmlFor="email-signin">Email</Label>
                        <Input id="email-signin" type="email" placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2 text-left">
                        <Label htmlFor="password-signin">Password</Label>
                        <Input id="password-signin" type="password" />
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
                           <Label htmlFor="name-signup">Name</Label>
                           <Input id="name-signup" placeholder="Your Name" />
                         </div>
                        <div className="space-y-2 text-left">
                           <Label htmlFor="email-signup">Email</Label>
                           <Input id="email-signup" type="email" placeholder="m@example.com" />
                        </div>
                        <div className="space-y-2 text-left">
                           <Label htmlFor="password-signup">Password</Label>
                           <Input id="password-signup" type="password" />
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
