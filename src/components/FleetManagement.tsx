
'use client';

import { useState } from 'react';
import { addPartnerVehicle, updatePartnerVehicle } from '@/lib/data';
import type { PartnerVehicle, User, Car, Bus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Car as CarIcon, Users, Gauge, GitBranch, Briefcase, User as UserIcon, Phone, Calendar, DollarSign, Info, Route, Bus as BusIcon, Wifi, Thermometer, Tv } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { cn } from '@/lib/utils';

type VehicleFormProps = { 
    vehicle: Partial<PartnerVehicle> | null, 
    onSave: (v: PartnerVehicle) => void, 
    onCancel: () => void 
}

function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
    const isEditing = !!vehicle?.id;
    const initialVehicleCategory = vehicle && 'amenities' in vehicle ? 'Bus' : 'Car/Bike';
    const [vehicleCategory, setVehicleCategory] = useState<'Car/Bike' | 'Bus'>(initialVehicleCategory);
    
    const getDefaultStateForCategory = (category: 'Car/Bike' | 'Bus'): Partial<PartnerVehicle> => {
        if (category === 'Bus') {
            return {
                name: '',
                type: 'Seater',
                seats: 45,
                pricePerDay: 15000,
                amenities: ['Air Conditioning', 'Wi-Fi'],
                status: 'Available',
            };
        }
        return {
            name: '',
            type: 'Sedan',
            pricePerDay: 2500,
            pricePerKm: 12,
            seats: 4,
            luggage: 2,
            transmission: 'Automatic',
            mpg: 20,
            description: '',
            features: [],
            status: 'Available',
        };
    };

    const [formData, setFormData] = useState<Partial<PartnerVehicle>>(vehicle || getDefaultStateForCategory(vehicleCategory));

    const handleCategoryChange = (value: 'Car/Bike' | 'Bus') => {
        setVehicleCategory(value);
        if (!isEditing) {
            setFormData(getDefaultStateForCategory(value));
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };
    
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = 'amenities' in formData ? 'amenities' : 'features';
        setFormData(prev => ({ ...prev, [key]: e.target.value.split(',').map(f => f.trim()) }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.pricePerDay) {
            alert('Please fill in all required fields.');
            return;
        }
        onSave(formData as PartnerVehicle);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
            {!isEditing && (
                 <div className="space-y-2">
                    <Label>Vehicle Category</Label>
                    <RadioGroup defaultValue={vehicleCategory} onValueChange={handleCategoryChange} className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="Car/Bike" id="Car/Bike" className="peer sr-only" />
                            <Label htmlFor="Car/Bike" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <CarIcon className="mb-3 h-6 w-6" />
                                Car / Bike
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="Bus" id="Bus" className="peer sr-only" />
                            <Label htmlFor="Bus" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <BusIcon className="mb-3 h-6 w-6" />
                                Bus
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
           
            <div className="space-y-1">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {vehicleCategory === 'Car/Bike' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sedan">Sedan</SelectItem>
                                    <SelectItem value="SUV">SUV</SelectItem>
                                    <SelectItem value="Minivan">Minivan</SelectItem>
                                    <SelectItem value="Coupe">Coupe</SelectItem>
                                    <SelectItem value="Convertible">Convertible</SelectItem>
                                    <SelectItem value="Bike">Bike</SelectItem>
                                    <SelectItem value="Scooter">Scooter</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="pricePerDay">Price Per Day (₹)</Label>
                            <Input id="pricePerDay" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleChange} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="seats">Seats</Label>
                            <Input id="seats" name="seats" type="number" value={formData.seats} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="luggage">Luggage (bags)</Label>
                            <Input id="luggage" name="luggage" type="number" value={(formData as Car).luggage || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="mpg">KMPL/Range</Label>
                            <Input id="mpg" name="mpg" type="number" value={(formData as Car).mpg || ''} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="transmission">Transmission</Label>
                            <Select name="transmission" value={(formData as Car).transmission || 'Automatic'} onValueChange={(val) => handleSelectChange('transmission', val)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Automatic">Automatic</SelectItem>
                                    <SelectItem value="Manual">Manual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={(formData as Car).description} onChange={handleChange} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="features">Features (comma-separated)</Label>
                        <Input id="features" name="features" value={(formData as Car).features?.join(', ')} onChange={handleFeatureChange} />
                    </div>
                </>
            ) : ( // Bus Form
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Seater">Seater</SelectItem>
                                    <SelectItem value="Sleeper">Sleeper</SelectItem>
                                    <SelectItem value="MiniBus">MiniBus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="pricePerDay">Price Per Day (₹)</Label>
                            <Input id="pricePerDay" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleChange} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="seats">Seats</Label>
                            <Input id="seats" name="seats" type="number" value={formData.seats} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="driverRating">Driver Rating</Label>
                            <Input id="driverRating" name="driverRating" type="number" step="0.1" max="5" value={(formData as Bus).driverRating || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input id="amenities" name="amenities" value={(formData as Bus).amenities?.join(', ')} onChange={handleFeatureChange} placeholder="e.g., Wi-Fi, Air Conditioning"/>
                    </div>
                </>
            )}


             <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val as PartnerVehicle['status'])}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Rented">Rented</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                </DialogClose>
                <Button type="submit">{vehicle?.id ? 'Save Changes' : 'Add Vehicle'}</Button>
            </DialogFooter>
        </form>
    );
}

function VehicleCard({ vehicle, onEdit }: { vehicle: PartnerVehicle, onEdit: (v: PartnerVehicle) => void }) {
    
  const getStatusBadge = (status: PartnerVehicle['status']) => {
    switch (status) {
        case 'Available':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Rented':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'Maintenance':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  }

  const isBus = 'amenities' in vehicle;

  return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle>{vehicle.name}</CardTitle>
                <CardDescription>{vehicle.type}</CardDescription>
            </div>
            <Badge className={getStatusBadge(vehicle.status)}>{vehicle.status}</Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
            <div className="flex items-center justify-between text-sm p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg">₹{vehicle.pricePerDay}</span>
                    <span className="text-muted-foreground">/day</span>
                </div>
                {!isBus && vehicle.pricePerKm && (
                <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg">₹{vehicle.pricePerKm}</span>
                    <span className="text-muted-foreground">/km</span>
                </div>
                )}
            </div>
            
            {isBus ? (
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {vehicle.seats} Seats</div>
                    <div className="flex flex-wrap gap-1 col-span-2">
                        {vehicle.amenities.slice(0, 3).map(a => <Badge key={a} variant="outline">{a}</Badge>)}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {vehicle.seats} Seats</div>
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {vehicle.luggage} Bags</div>
                    <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-primary" /> {vehicle.mpg} KMPL</div>
                    <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-primary" /> {vehicle.transmission}</div>
                </div>
            )}
            
            {vehicle.status === 'Rented' && vehicle.renter && (
                <Card className="bg-orange-50 border-orange-200">
                    <CardHeader className="p-3">
                        <CardTitle className="text-sm flex items-center gap-2"><Info className="w-4 h-4"/> Renter Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-sm space-y-1">
                        <div className="flex items-center gap-2"><UserIcon className="w-3 h-3 text-muted-foreground"/> {vehicle.renter.name}</div>
                        <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-muted-foreground"/> {vehicle.renter.phone}</div>
                        <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-muted-foreground"/> {vehicle.renter.rentalPeriod}</div>
                    </CardContent>
                </Card>
            )}
        </CardContent>
        <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onEdit(vehicle)}>
                <Edit className="mr-2" /> Edit Vehicle
            </Button>
        </CardFooter>
    </Card>
  )
}


export function FleetManagement({ user, onFleetUpdate }: { user: User, onFleetUpdate: (user: User) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<PartnerVehicle | null>(null);
  const { toast } = useToast();
  
  const vehicles = user.vehicles || [];

  const handleEdit = (vehicle: PartnerVehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const handleSave = (vehicleData: PartnerVehicle) => {
    let updatedUser;
    if (vehicleData.id) { // Editing existing
      updatedUser = updatePartnerVehicle(vehicleData);
      toast({ title: "Vehicle Updated!", description: `${vehicleData.name} has been updated.` });
    } else { // Adding new
      updatedUser = addPartnerVehicle(vehicleData);
      toast({ title: "Vehicle Added!", description: `${vehicleData.name} has been added to your fleet.` });
    }
    onFleetUpdate(updatedUser);
    setIsDialogOpen(false);
    setEditingVehicle(null);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Fleet</h1>
                <p className="text-muted-foreground">An overview of all your vehicles and buses.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2" /> Add New Vehicle
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
                    </DialogHeader>
                    <VehicleForm 
                        vehicle={editingVehicle} 
                        onSave={handleSave}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
        
        {vehicles.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={handleEdit} />
                ))}
            </div>
        ) : (
            <Card className="text-center py-16 border-2 border-dashed">
                <CarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline">Your fleet is empty</h2>
                <p className="text-muted-foreground mt-2">Get started by adding your first car, bike, or bus.</p>
                <Button onClick={handleAddNew} className="mt-6">
                    <PlusCircle className="mr-2" /> Add Your First Vehicle
                </Button>
            </Card>
        )}
    </div>
  );
}
