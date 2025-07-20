
'use client';

import { useState, useEffect } from 'react';
import { addPartnerVehicle, updatePartnerVehicle, getVehiclesForPartner } from '@/lib/data';
import type { AnyVehicle, User, Car, Bus, Truck, VehicleCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Car as CarIcon, Users, Gauge, GitBranch, Briefcase, User as UserIcon, Phone, Calendar, DollarSign, Info, Route, Bus as BusIcon, Truck as TruckIcon, Weight, UserCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

type VehicleFormProps = { 
    vehicle: Partial<AnyVehicle> | null, 
    onSave: (v: AnyVehicle, category: VehicleCategory) => void, 
    onCancel: () => void 
}

function VehicleForm({ vehicle, onSave, onCancel }: VehicleFormProps) {
    const isEditing = !!vehicle?.id;
    
    const getInitialCategory = (): 'Car' | 'Bus' | 'Truck' | 'Specialized' => {
        if (!vehicle || !vehicle.category) return 'Car';
        if (vehicle.category === 'Bus') return 'Bus';
        if (vehicle.category === 'Truck') return 'Truck';
        if (vehicle.category === 'Specialized') return 'Specialized';
        // Default to car for Bike/Scooter types
        if (vehicle.category === 'Bike' || vehicle.category === 'Scooter') return 'Car';
        return 'Car';
    }

    const [vehicleCategory, setVehicleCategory] = useState<'Car' | 'Bus' | 'Truck'>(() => {
        const cat = getInitialCategory();
        return cat === 'Specialized' ? 'Car' : cat;
    });
    
    const getDefaultStateForCategory = (category: 'Car' | 'Bus' | 'Truck'): Partial<AnyVehicle> => {
        if (category === 'Bus') {
            return {
                name: '', type: 'Seater', seats: 45, pricePerDay: 15000,
                amenities: ['Air Conditioning', 'Wi-Fi'], category: 'Bus',
                driver: { name: '', phone: '' }, status: 'Available',
            };
        }
        if (category === 'Truck') {
            return {
                name: '', size: 'Medium', pricePerDay: 7000, payload: '3 Ton',
                description: '', status: 'Available', category: 'Truck',
            }
        }
        return { // Car/Bike/Scooter
            name: '', type: 'Sedan', pricePerDay: 2500, pricePerKm: 12, seats: 4,
            luggage: 2, transmission: 'Automatic', mpg: 20, description: '',
            features: [], status: 'Available', category: 'Car',
        };
    };

    const [formData, setFormData] = useState<Partial<AnyVehicle>>(() => {
        if (vehicle) return vehicle;
        return getDefaultStateForCategory(vehicleCategory);
    });

    const handleCategoryChange = (value: 'Car' | 'Bus' | 'Truck') => {
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

    const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            driver: {
                ...((prev as Bus).driver || {}),
                [name]: value,
            },
        }));
    }
    
    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let key: 'features' | 'amenities' = 'features';
        if (vehicleCategory === 'Bus') key = 'amenities';

        setFormData(prev => ({ ...prev, [key]: e.target.value.split(',').map(f => f.trim()) }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || !formData.pricePerDay) {
            alert('Please fill in all required fields.');
            return;
        }

        let finalCategory: VehicleCategory = vehicleCategory;
        if(vehicleCategory === 'Car' && ['Bike', 'Scooter'].includes((formData as Car).type)) {
            finalCategory = (formData as Car).type as VehicleCategory;
        }

        onSave(formData as AnyVehicle, finalCategory);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
            {!isEditing && (
                 <div className="space-y-2">
                    <Label>Vehicle Category</Label>
                    <RadioGroup defaultValue={vehicleCategory} onValueChange={handleCategoryChange as any} className="grid grid-cols-3 gap-4">
                        <div>
                            <RadioGroupItem value="Car" id="Car" className="peer sr-only" />
                            <Label htmlFor="Car" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
                        <div>
                            <RadioGroupItem value="Truck" id="Truck" className="peer sr-only" />
                            <Label htmlFor="Truck" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                <TruckIcon className="mb-3 h-6 w-6" />
                                Truck
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            )}
           
            <div className="space-y-1">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {vehicleCategory === 'Car' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={(formData as Car).type} onValueChange={(val) => handleSelectChange('type', val)}>
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
                         <div className="space-y-1">
                            <Label htmlFor="pricePerKm">Price Per Kilometer (₹)</Label>
                            <Input id="pricePerKm" name="pricePerKm" type="number" value={(formData as Car).pricePerKm || ''} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="seats">Seats</Label>
                            <Input id="seats" name="seats" type="number" value={(formData as Car).seats} onChange={handleChange} />
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
            )}
            
            {vehicleCategory === 'Bus' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" value={(formData as Bus).type} onValueChange={(val) => handleSelectChange('type', val)}>
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
                            <Input id="seats" name="seats" type="number" value={(formData as Bus).seats} onChange={handleChange} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="driverRating">Driver Rating</Label>
                            <Input id="driverRating" name="driverRating" type="number" step="0.1" max="5" value={(formData as Bus).driverRating || ''} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label>Driver Details</Label>
                         <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                            <div className="space-y-1">
                                <Label htmlFor="driverName" className="text-xs">Driver Name</Label>
                                <Input id="driverName" name="name" value={(formData as Bus).driver?.name || ''} onChange={handleDriverChange} placeholder="e.g. Ramesh Kumar" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="driverPhone" className="text-xs">Driver Phone</Label>
                                <Input id="driverPhone" name="phone" value={(formData as Bus).driver?.phone || ''} onChange={handleDriverChange} placeholder="e.g. 9876543210"/>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                        <Input id="amenities" name="amenities" value={(formData as Bus).amenities?.join(', ')} onChange={handleFeatureChange} placeholder="e.g., Wi-Fi, Air Conditioning"/>
                    </div>
                </>
            )}

            {vehicleCategory === 'Truck' && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="size">Size</Label>
                            <Select name="size" value={(formData as Truck).size} onValueChange={(val) => handleSelectChange('size', val)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mini">Mini (e.g., Tata Ace)</SelectItem>
                                    <SelectItem value="Medium">Medium (e.g., Eicher 19ft)</SelectItem>
                                    <SelectItem value="Large">Large (e.g., Tata 22ft)</SelectItem>
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
                            <Label htmlFor="payload">Payload</Label>
                            <Input id="payload" name="payload" value={(formData as Truck).payload || ''} onChange={handleChange} placeholder="e.g., 1 Ton, 5 Ton+" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="driverRating">Driver Rating</Label>
                            <Input id="driverRating" name="driverRating" type="number" step="0.1" max="5" value={(formData as Truck).driverRating || ''} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" value={(formData as Truck).description} onChange={handleChange} />
                    </div>
                </>
            )}

             <div className="space-y-1">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(val) => handleSelectChange('status', val as AnyVehicle['status'])}>
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

function VehicleCard({ vehicle, onEdit }: { vehicle: AnyVehicle, onEdit: (v: AnyVehicle) => void }) {
    
  const getStatusBadge = (status: AnyVehicle['status']) => {
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
  const isTruck = 'payload' in vehicle;
  const isCar = !isBus && !isTruck;
  
  const getVehicleIcon = () => {
    if (isBus) return <BusIcon className="w-5 h-5 mr-2"/>;
    if (isTruck) return <TruckIcon className="w-5 h-5 mr-2"/>;
    return <CarIcon className="w-5 h-5 mr-2"/>;
  }
  
  const getVehicleType = () => {
    if (isTruck) return (vehicle as Truck).size;
    return (vehicle as Car).type;
  }

  return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center">{getVehicleIcon()} {vehicle.name}</CardTitle>
                <CardDescription>{getVehicleType()}</CardDescription>
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
                {isCar && (vehicle as Car).pricePerKm && (
                <div className="flex items-center gap-2">
                    <Route className="w-4 h-4 text-muted-foreground" />
                    <span className="font-bold text-lg">₹{(vehicle as Car).pricePerKm}</span>
                    <span className="text-muted-foreground">/km</span>
                </div>
                )}
            </div>
            
            {isCar && (
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {(vehicle as Car).seats} Seats</div>
                    <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> {(vehicle as Car).luggage} Bags</div>
                    <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-primary" /> {(vehicle as Car).mpg} KMPL</div>
                    <div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-primary" /> {(vehicle as Car).transmission}</div>
                </div>
            )}
            
            {isBus && (
                <>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {(vehicle as Bus).seats} Seats</div>
                        <div className="flex flex-wrap gap-1 col-span-2">
                            {(vehicle as Bus).amenities.slice(0, 3).map(a => <Badge key={a} variant="outline">{a}</Badge>)}
                        </div>
                    </div>
                    {(vehicle as Bus).driver && (
                        <div className="text-sm space-y-1 border-t pt-2 mt-2">
                            <p className="font-semibold flex items-center gap-2"><UserCircle className="w-4 h-4" /> Driver Details</p>
                            <div className="flex items-center gap-2 text-muted-foreground"><UserIcon className="w-3 h-3"/> {(vehicle as Bus).driver?.name}</div>
                            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3 h-3"/> {(vehicle as Bus).driver?.phone}</div>
                        </div>
                    )}
                </>
            )}

            {isTruck && (
                 <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><TruckIcon className="w-4 h-4 text-primary" /> {(vehicle as Truck).size}</div>
                    <div className="flex items-center gap-2"><Weight className="w-4 h-4 text-primary" /> {(vehicle as Truck).payload}</div>
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
                <Edit className="mr-2 h-4 w-4" /> Edit Vehicle
            </Button>
        </CardFooter>
    </Card>
  )
}


export function FleetManagement({ user, onFleetUpdate }: { user: User, onFleetUpdate: (user: User) => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<AnyVehicle | null>(null);
  const [vehicles, setVehicles] = useState<AnyVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    getVehiclesForPartner(user.email).then(data => {
        setVehicles(data);
        setLoading(false);
    });
  }, [user.email]);

  const handleEdit = (vehicle: AnyVehicle) => {
    setEditingVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingVehicle(null);
    setIsDialogOpen(true);
  };

  const handleSave = async (vehicleData: AnyVehicle, category: VehicleCategory) => {
    try {
        if (vehicleData.id) { // Editing existing
            await updatePartnerVehicle({...vehicleData, category });
            setVehicles(prev => prev.map(v => v.id === vehicleData.id ? {...vehicleData, category} : v));
            toast({ title: "Vehicle Updated!", description: `${vehicleData.name} has been updated.` });
        } else { // Adding new
            await addPartnerVehicle(vehicleData, category);
            // Re-fetch to get the new vehicle with its ID
            getVehiclesForPartner(user.email).then(setVehicles);
            toast({ title: "Vehicle Added!", description: `${vehicleData.name} has been added to your fleet.` });
        }
        setIsDialogOpen(false);
        setEditingVehicle(null);
    } catch (error) {
        console.error("Failed to save vehicle", error);
        toast({ title: "Save Failed", description: "Could not save vehicle details.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-headline">My Fleet</h1>
                <p className="text-muted-foreground">An overview of all your vehicles, buses, and trucks.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Vehicle
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
                <p className="text-muted-foreground mt-2">Get started by adding your first car, bike, bus, or truck.</p>
                <Button onClick={handleAddNew} className="mt-6">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Vehicle
                </Button>
            </Card>
        )}
    </div>
  );
}
