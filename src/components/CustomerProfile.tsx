
'use client';

import { getCurrentUser, findReservations } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import Image from "next/image";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";
import { generateAvatarAction } from "@/app/actions";
import { Loader2, Sparkles } from "lucide-react";
import type { User } from "@/lib/types";

const initialAvatarState = {
  message: '',
  avatarDataUri: null,
};

function GenerateAvatarButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate Avatar
    </Button>
  );
}


export function CustomerProfile() {
  const reservations = findReservations();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [avatarGenState, avatarFormAction] = useActionState(generateAvatarAction, initialAvatarState);
  
  // Use state to manage the user object
  const [currentUser, setCurrentUser] = useState<User>(() => getCurrentUser());

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
  });

  // Effect to update form data if currentUser changes from outside
  useEffect(() => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    });
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSave = () => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      name: formData.name,
      email: formData.email,
      avatarUrl: avatarGenState.avatarDataUri || prevUser.avatarUrl,
    }));
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
    })
  };

  const handleCancel = () => {
    setFormData({ name: currentUser.name, email: currentUser.email });
    setIsEditing(false);
  }

  const handleUseAvatar = () => {
    if (avatarGenState.avatarDataUri) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        avatarUrl: avatarGenState.avatarDataUri!,
      }));
      toast({
        title: "Avatar updated!",
        description: "Click 'Save Changes' to keep it."
      })
    }
  }


  return (
    <div className="space-y-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and booking history.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background ring-4 ring-primary">
                  <AvatarImage src={isEditing && avatarGenState.avatarDataUri ? avatarGenState.avatarDataUri : currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              
              {!isEditing ? (
                <div>
                    <h2 className="text-3xl font-bold">{currentUser.name}</h2>
                    <p className="text-muted-foreground">{currentUser.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">Member since {format(currentUser.memberSince, 'MMMM yyyy')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                </div>
              )}
            </div>

            {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save Changes</Button>
                </div>
            )}
          </div>
        </CardHeader>

        {isEditing && (
          <>
            <Separator className="my-4" />
            <CardContent>
              <form action={avatarFormAction}>
                <CardTitle className="text-lg mb-2">AI Avatar Generator</CardTitle>
                <CardDescription className="mb-4">Describe the avatar you want, and our AI will create it for you.</CardDescription>
                <div className="flex gap-2">
                  <Input name="prompt" placeholder="e.g., a futuristic sports car logo" required />
                  <GenerateAvatarButton />
                </div>
                {avatarGenState.message && avatarGenState.message !== 'success' && <p className="text-sm text-destructive mt-2">{avatarGenState.message}</p>}
              </form>
              
              {avatarGenState.avatarDataUri && (
                <div className="mt-6 text-center">
                  <CardTitle className="text-lg mb-4">Generated Avatar</CardTitle>
                  <div className="flex justify-center items-center gap-4">
                    <Image src={avatarGenState.avatarDataUri} alt="Generated Avatar" width={100} height={100} className="rounded-full" />
                    <Button variant="outline" onClick={handleUseAvatar}>Use this Avatar</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your past and upcoming reservations.</CardDescription>
        </CardHeader>
        <CardContent>
           {reservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Car</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 rounded-md overflow-hidden">
                          <Image src={reservation.car.images[0]} alt={reservation.car.name} layout="fill" objectFit="cover" data-ai-hint="car" />
                        </div>
                        <div>
                          <div className="font-medium">{reservation.car.name}</div>
                          <div className="text-sm text-muted-foreground">{reservation.car.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(reservation.startDate, 'MMM d, yyyy')} - {format(reservation.endDate, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">₹{reservation.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
           ) : (
            <p className="text-muted-foreground">You have no recent bookings.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
