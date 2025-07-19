
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { DatePickerWithRange } from './DatePickerWithRange';

const formSchema = z.object({
    pickup: z.string().min(2, 'Pickup address is required.'),
    destination: z.string().min(2, 'Destination address is required.'),
    dates: z.object({
        from: z.date(),
        to: z.date(),
    }).optional(),
});

export function TruckSearchForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pickup: '',
            destination: '',
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const params = new URLSearchParams();
        params.set('pickup', values.pickup);
        params.set('destination', values.destination);
        if (values.dates?.from) {
             params.set('from', values.dates.from.toISOString());
        }
        if (values.dates?.to) {
             params.set('to', values.dates.to.toISOString());
        }
        router.push(`/trucks?${params.toString()}`);
    }

    return (
        <Card className="shadow-lg">
            <CardContent className="p-4 md:p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4 space-y-2">
                            <FormField
                                control={form.control}
                                name="pickup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pickup Address</FormLabel>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., Andheri, Mumbai" {...field} className="pl-10" />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-4 space-y-2">
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination Address</FormLabel>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="e.g., Bandra, Mumbai" {...field} className="pl-10" />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <div className="md:col-span-3 lg:col-span-2 space-y-2">
                             <FormField
                                control={form.control}
                                name="dates"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dates</FormLabel>
                                        <DatePickerWithRange onDateChange={field.onChange} />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:col-span-12 lg:col-span-2">
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
