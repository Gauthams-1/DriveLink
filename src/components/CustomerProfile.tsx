
'use client';

import { getCurrentUser, findCarReservations, saveUser } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { format } from "date-fns";
import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateAvatarAction } from "@/app/actions";
import { Loader2, Sparkles, UserCheck, UserX, ShieldCheck, Mail, Phone, MapPin, Edit, X, Upload, Car } from "lucide-react";
import type { User, CarReservationWithDetails } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

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
  const [reservations, setReservations] = useState<CarReservationWithDetails[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [avatarGenState, avatarFormAction] = useActionState(generateAvatarAction, initialAvatarState);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setFormData(user);
    
    // Move side-effectful code to useEffect to ensure it runs only on the client
    if (typeof window !== 'undefined') {
        setReservations(findCarReservations());
    }
  }, []);

  useEffect(() => {
    // When a new avatar is generated, update the form data
    if (avatarGenState.avatarDataUri) {
        setFormData(prev => ({ ...prev, avatarUrl: avatarGenState.avatarDataUri!}));
        toast({
            title: "Avatar updated!",
            description: "Click 'Save Changes' to keep it."
        })
    }
  }, [avatarGenState.avatarDataUri, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSave = () => {
    if (!currentUser) return;
    
    const updatedUser: User = {
        ...currentUser,
        name: formData.name || currentUser.name,
        email: formData.email || currentUser.email,
        phone: formData.phone || currentUser.phone,
        address: formData.address || currentUser.address,
        licenseNumber: formData.licenseNumber || currentUser.licenseNumber,
        aadhaarNumber: formData.aadhaarNumber || currentUser.aadhaarNumber,
        isVerified: !!(formData.licenseNumber && formData.aadhaarNumber),
        avatarUrl: formData.avatarUrl || currentUser.avatarUrl,
    };
    
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    setIsEditing(false);
    toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
    });
  };

  const handleCancel = () => {
    if (currentUser) {
        setFormData(currentUser);
    }
    setIsEditing(false);
  }

  if (!currentUser) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Loading Profile...</CardTitle>
            </CardHeader>
            <CardContent>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between mb-8">
        <div>
            {/* Title moved to parent page */}
        </div>
        {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4"/>Edit Profile</Button>
        ) : (
            <div className="flex gap-2">
                <Button variant="ghost" onClick={handleCancel}><X className="mr-2 h-4 w-4"/>Cancel</Button>
                <Button onClick={handleSave}><ShieldCheck className="mr-2 h-4 w-4"/>Save Changes</Button>
            </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader className="text-center">
                    <Avatar className="h-24 w-24 border-4 border-background ring-4 ring-primary mx-auto">
                        <AvatarImage src={isEditing ? formData.avatarUrl : currentUser.avatarUrl} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="pt-4">{isEditing ? formData.name : currentUser.name}</CardTitle>
                    <CardDescription>Member since {format(currentUser.memberSince, 'MMMM yyyy')}</CardDescription>
                </CardHeader>
                 {isEditing ? (
                     <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                        </div>
                     </CardContent>
                 ) : null}
            </Card>

            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Avatar Generator</CardTitle>
                  <CardDescription>Describe your ideal avatar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form action={avatarFormAction} className="space-y-4">
                    <Textarea name="prompt" placeholder="e.g., a futuristic sports car logo" required />
                    <GenerateAvatarButton />
                    {avatarGenState.message && avatarGenState.message !== 'success' && <p className="text-sm text-destructive mt-2">{avatarGenState.message}</p>}
                  </form>
                  
                  {avatarGenState.avatarDataUri && (
                    <div className="mt-4 text-center">
                      <p className="font-semibold mb-2">Generated Avatar Preview</p>
                      <Avatar className="h-24 w-24 mx-auto">
                        <AvatarImage src={avatarGenState.avatarDataUri} />
                        <AvatarFallback><Sparkles/></AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
        </div>

        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your contact and address details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} />
                            </div>
                        </>
                    ) : (
                        <div className="text-sm space-y-2">
                           <div className="flex items-center"><Mail className="w-4 h-4 mr-3 text-muted-foreground" /> <span>{currentUser.email}</span></div>
                           <div className="flex items-center"><Phone className="w-4 h-4 mr-3 text-muted-foreground" /> <span>{currentUser.phone || 'Not provided'}</span></div>
                           <div className="flex items-start"><MapPin className="w-4 h-4 mr-3 mt-1 text-muted-foreground" /> <span className="whitespace-pre-wrap">{currentUser.address || 'Not provided'}</span></div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Identity Verification</CardTitle>
                    <div className="flex items-center justify-between">
                        <CardDescription>Submit your documents to get verified.</CardDescription>
                        <Badge variant={currentUser.isVerified ? "secondary" : "destructive"} className={currentUser.isVerified ? 'bg-green-100 text-green-800' : ''}>
                          {currentUser.isVerified ? <UserCheck className="mr-2 h-4 w-4"/> : <UserX className="mr-2 h-4 w-4"/>}
                          {currentUser.isVerified ? 'Verified' : 'Not Verified'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isEditing ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <Label htmlFor="licenseNumber">Driving License Number</Label>
                                <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} />
                                <Button asChild variant="outline" className="w-full mt-2">
                                  <label><Upload className="mr-2 h-4 w-4" /> Upload Document<input type="file" className="hidden" /></label>
                                </Button>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="aadhaarNumber">Aadhaar Card Number</Label>
                                <Input id="aadhaarNumber" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} />
                                <Button asChild variant="outline" className="w-full mt-2">
                                  <label><Upload className="mr-2 h-4 w-4" /> Upload Document<input type="file" className="hidden" /></label>
                                </Button>
                            </div>
                        </div>
                    ) : (
                         <div className="text-sm space-y-2">
                           <p><strong>Driving License:</strong> {currentUser.licenseNumber ? `**** **** **** ${currentUser.licenseNumber.slice(-4)}` : 'Not Provided'}</p>
                           <p><strong>Aadhaar Card:</strong> {currentUser.aadhaarNumber ? `**** **** **** ${currentUser.aadhaarNumber.slice(-4)}` : 'Not Provided'}</p>
                        </div>
                    )}
                </CardContent>
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
                                <div className="w-16 h-12 rounded-md bg-muted flex items-center justify-center">
                                    <Car className="w-6 h-6 text-muted-foreground" />
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
                    <p className="text-muted-foreground text-center py-4">You have no recent bookings.</p>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
