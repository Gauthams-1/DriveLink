import { CarSearchForm } from "@/components/CarSearchForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Lightbulb, LocateFixed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        <Image
          src="https://placehold.co/1800x900.png"
          alt="A scenic road with a rental car"
          layout="fill"
          objectFit="cover"
          className="z-0"
          data-ai-hint="scenic road car"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 drop-shadow-lg">
            Your Journey, Your Car.
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md">
            Find the perfect rental car for your next adventure. Unbeatable prices, unlimited miles.
          </p>
          <div className="w-full max-w-4xl">
            <CarSearchForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2 text-lg">Rent a car in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <LocateFixed className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Choose Location</h3>
                <p className="text-muted-foreground">Enter your destination and desired dates to find available cars near you.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Car className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Select a Car</h3>
                <p className="text-muted-foreground">Browse our wide selection and pick the car that best suits your needs.</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-none bg-transparent">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Lightbulb className="h-10 w-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Get a Recommendation</h3>
                <p className="text-muted-foreground">Not sure what to choose? Our AI assistant can help you find the perfect match.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">Can't Decide? Let AI Help.</h2>
                  <p className="text-lg text-muted-foreground mb-6">Our smart recommendation tool analyzes your travel needs to suggest the ideal vehicle. Answer a few simple questions and get a personalized recommendation in seconds.</p>
                  <Button asChild size="lg">
                     <Link href="/recommendations">Try the AI Assistant</Link>
                  </Button>
               </div>
               <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                 <Image src="https://placehold.co/600x400.png" alt="AI illustration" layout="fill" objectFit="cover" data-ai-hint="artificial intelligence futuristic" />
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
