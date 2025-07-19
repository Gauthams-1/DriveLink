export type Car = {
  id: number;
  name: string;
  type: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe';
  pricePerDay: number;
  seats: number;
  luggage: number; // in bags
  transmission: 'Automatic' | 'Manual';
  mpg: number;
  location: string;
  images: string[];
  description: string;
  features: string[];
};

export type Reservation = {
  id: number;
  carId: number;
  startDate: Date;
  endDate: Date;
  totalCost: number;
};

export type Bus = {
  id: number;
  name: string;
  type: 'Sleeper' | 'Seater' | 'MiniBus';
  seats: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
  driver: {
    name: string;
    rating: number;
  };
};
