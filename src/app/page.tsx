import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bus, Truck, Wrench, Users, Ambulance, ShieldCheck, Route, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  { 
    icon: Car, 
    title: "Car, Bike & Scooter Rental",
    description: "Personal rides for daily commutes or weekend trips. Choose from a wide range of vehicles.",
    href: "/cars",
    cta: "Rent a Vehicle"
  },
  { 
    icon: Bus, 
    title: "Bus Trip Booking",
    description: "Plan your group travel with ease. Perfect for family vacations, corporate outings, and events.",
    href: "/bus-trips",
    cta: "Book a Bus"
  },
  { 
    icon: Truck, 
    title: "Container Truck Booking",
    description: "Reliable trucks for house shifting or moving large equipment. We handle the heavy lifting.",
    href: "/trucks",
    cta: "Book a Truck"
  },
  { 
    icon: Wrench, 
    title: "Breakdown Support",
    description: "Stuck on the road? Our AI-powered SOS finds the nearest mechanic for you, day or night.",
    href: "/support",
    cta: "Get Help"
  },
  {
    icon: Users,
    title: "Specialized Vehicles",
    description: "Safe and comfortable travel for pets and the elderly. We cater to your special needs.",
    href: "/specialized",
    cta: "Book Now"
  },
  {
    icon: Ambulance,
    title: "Emergency Ambulance",
    description: "Fast and reliable ambulance service at your fingertips. Your safety is our priority.",
    href: "/emergency",
    cta: "Request Ambulance"
  }
];

const aboutFeatures = [
    {
        icon: ShieldCheck,
        title: "Safety First",
        description: "Verified partners, real-time tracking, and 24/7 support ensure your peace of mind on every journey."
    },
    {
        icon: Route,
        title: "Seamless Experience",
        description: "From booking to destination, our app provides a smooth, intuitive, and hassle-free experience."
    },
    {
        icon: Wallet,
        title: "Transparent Pricing",
        description: "No hidden fees. Get clear, upfront pricing for all services before you book."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[70vh] md:h-[80vh]">
        <Image
          src="https://placehold.co/1800x900.png"
          alt="A lineup of modern cars ready for rental"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="modern cars"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center justify-end h-full text-center text-white px-4 pb-20">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
            Your Complete Transportation Solution
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl drop-shadow-md">
            From cars and bikes to buses and trucks, we've got your journey covered.
          </p>
          <Button size="lg" asChild>
            <Link href="#about">Learn More</Link>
          </Button>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">About DriveLink</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              DriveLink is your all-in-one transportation partner, designed to simplify your life. Whether you need a quick ride across town, a bus for a group getaway, or a truck for a major move, we connect you with reliable, safe, and affordable options. Our mission is to make mobility seamless for everyone, everywhere.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {aboutFeatures.map(feature => (
                <div key={feature.title} className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <feature.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">One App, All Your Needs</h2>
            <p className="text-muted-foreground mt-2 text-lg">Select a service to get started.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="text-center flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
                <CardHeader className="flex-grow">
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <service.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={service.href}>{service.cta}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                 <Image src="https://placehold.co/600x400.png" alt="A partner managing their fleet on a dashboard" layout="fill" objectFit="cover" data-ai-hint="dashboard fleet management" />
               </div>
               <div>
                  <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Become a DriveLink Partner</h2>
                  <p className="text-lg text-muted-foreground mb-6">Have a vehicle? Join our network and start earning. We provide the tools and support you need to manage your fleet, track bookings, and grow your business.</p>
                  <Button asChild size="lg">
                     <Link href="/partner">Learn More</Link>
                  </Button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
