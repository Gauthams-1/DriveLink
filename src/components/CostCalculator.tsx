
'use client';

import { useState, useEffect } from 'react';
import { addDays, differenceInDays, format } from 'date-fns';
import type { Car, User } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Checkbox } from './ui/checkbox';
import type { DateRange } from 'react-day-picker';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/data';

const ADDONS = [
  { id: 'insurance', label: 'Full Insurance', price: 1500 },
  { id: 'gps', label: 'GPS Navigation', price: 500 },
  { id: 'child-seat', label: 'Child Seat', price: 400 },
];

export function CostCalculator({ car }: { car: Car }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 4),
  });
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const rentalDays = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0;

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const carCost = rentalDays > 0 ? rentalDays * car.pricePerDay : 0;
      
      const addonsCost = selectedAddons.reduce((total, addonId) => {
        const addon = ADDONS.find(a => a.id === addonId);
        return total + (addon ? addon.price * rentalDays : 0);
      }, 0);

      setTotalCost(carCost + addonsCost);
    } else {
      setTotalCost(0);
    }
  }, [dateRange, selectedAddons, car.pricePerDay, rentalDays]);

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const getReservationUrl = () => {
    if (!dateRange?.from || !dateRange?.to) return '';
    
    const params = new URLSearchParams({
        carId: car.id.toString(),
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        totalCost: totalCost.toFixed(2),
        rentalDays: rentalDays.toString(),
        addons: selectedAddons.join(','),
    });

    return `/reservations/details?${params.toString()}`;
  }

  const reservationUrl = user && !user.isGuest ? getReservationUrl() : '/profile';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Cost & Reserve</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="dates">Rental Dates</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="dates"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} -{' '}
                      {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>Add-ons</Label>
          <div className="space-y-2">
            {ADDONS.map(addon => (
              <div key={addon.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={addon.id}
                  onCheckedChange={() => handleAddonToggle(addon.id)}
                />
                <Label htmlFor={addon.id} className="font-normal flex justify-between w-full">
                  <span>{addon.label}</span>
                  <span className="text-muted-foreground">₹{addon.price}/day</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Base price ({rentalDays} days)</span>
            <span>₹{(rentalDays * car.pricePerDay).toFixed(2)}</span>
          </div>
           {selectedAddons.map(addonId => {
              const addon = ADDONS.find(a => a.id === addonId);
              if (!addon) return null;
              return (
                 <div key={addonId} className="flex justify-between text-sm">
                   <span className="text-muted-foreground">{addon.label}</span>
                   <span>₹{(addon.price * rentalDays).toFixed(2)}</span>
                 </div>
              )
           })}
        </div>

      </CardContent>
      <CardFooter className="flex-col items-stretch space-y-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Total Cost</span>
          <span>₹{totalCost.toFixed(2)}</span>
        </div>
        <Button size="lg" asChild disabled={!dateRange?.from || !dateRange?.to}>
          <Link href={reservationUrl}>Reserve Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
