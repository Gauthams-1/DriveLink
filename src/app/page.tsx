
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bus, Truck, Wrench, Users, Ambulance, ShieldCheck, Route, Wallet, UserCircle, Handshake } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
];

const partnerOptions = [
    {
        icon: Car,
        title: "Car Owner",
        href: "/profile"
    },
    {
        icon: Bus,
        title: "Bus Owner",
        href: "/profile"
    },
    {
        icon: Wrench,
        title: "Mechanic",
        href: "/profile"
    },
    {
        icon: UserCircle,
        title: "Driver",
        href: "/profile"
    },
    {
        icon: Truck,
        title: "Truck Service",
        href: "/profile"
    }
]

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32">
        <Image
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Luxury car driving on a road"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 brightness-50"
          priority
          data-ai-hint="car road"
        />
        <div className="relative container mx-auto px-4 flex flex-col items-center justify-center h-full text-center text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
            Your Complete Transportation Solution
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl drop-shadow-md">
            From cars and bikes to buses and trucks, we've got your journey covered.
          </p>
          <Button size="lg" asChild variant="secondary">
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

      <section className="py-16 md:py-24 bg-muted">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">Become a DriveLink Partner</h2>
                    <p className="text-lg text-muted-foreground mt-4">Have a vehicle, a garage, or driving skills? Join our network and start earning. We provide the tools and support you need to grow your business.</p>
                     <Button asChild size="lg" className="mt-6">
                        <Link href="/profile">Get Started</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {partnerOptions.slice(0, 5).map((option) => (
                        <Card key={option.title} className="text-center p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 bg-card">
                            <Link href={option.href} className="flex flex-col items-center justify-center h-full">
                                <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                                    <option.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="font-bold font-headline text-sm">{option.title}</h3>
                            </Link>
                        </Card>
                    ))}
                    <Card className="text-center p-4 hover:shadow-lg hover:-translate-y-1 transition-transform duration-200 bg-card col-span-2 sm:col-span-1">
                        <Link href="/profile" className="flex flex-col items-center justify-center h-full">
                             <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-3">
                                <Handshake className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-bold font-headline text-sm">And more...</h3>
                        </Link>
                    </Card>
                </div>
            </div>
         </div>
      </section>
    </div>
  );
}
