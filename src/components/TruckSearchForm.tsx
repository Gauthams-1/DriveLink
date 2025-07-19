'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MapPin, Truck } from 'lucide-react';

const formSchema = z.object({
    pickup: z.string().min(2, 'Pickup address is required.'),
    destination: z.string().min(2, 'Destination address is required.'),
    truckSize: z.string().optional(),
});

export function TruckSearchForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pickup: '',
            destination: '',
            truckSize: 'all',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const params = new URLSearchParams();
        params.set('pickup', values.pickup);
        params.set('destination', values.destination);
        if (values.truckSize && values.truckSize !== 'all') {
            params.set('size', values.truckSize);
        }
        router.push(`/trucks?${params.toString()}`);
    }

    return (
        <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4 items-end">
                        <div className="lg:col-span-3 space-y-2">
                            <FormField
                                control={form.control}
                                name="pickup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pickup Address</FormLabel>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., 123 Main St, Anytown" {...field} className="pl-10" />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="lg:col-span-3 space-y-2">
                             <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination Address</FormLabel>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., 456 Oak Ave, Othertown" {...field} className="pl-10" />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                             <FormField
                                control={form.control}
                                name="truckSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Truck Size</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select truck size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="all">All Sizes</SelectItem>
                                                <SelectItem value="Mini">Mini</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Large">Large</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <Button type="submit" className="w-full">
                                Find Truck
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
