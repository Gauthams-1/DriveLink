export type Car = {
  id: number;
  name: string;
  type: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe' | 'Bike' | 'Scooter';
  pricePerDay: number;
  seats: number;
  luggage: number; // in bags
  transmission: 'Automatic' | 'Manual';
  mpg: number; // kmpl or km/charge
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

export type BusReservation = {
    id: number;
    busId: number;
    groupName: string;
    contactName: string;
    startDate: Date;
    endDate: Date;
    totalCost: number;
}

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

export type Truck = {
  id: number;
  name: string;
  size: 'Mini' | 'Medium' | 'Large';
  pricePerDay: number;
  payload: string;
  description: string;
  images: string[];
  driver: {
    name:string;
    rating: number;
  };
};

export type User = {
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;
  aadhaarNumber: string;
  isVerified: boolean;
  avatarUrl: string;
  memberSince: Date;
};

export type PartnerStats = {
  totalRevenue: number;
  activeBookings: number;
  totalVehicles: number;
  avgRating: number;
};

export type PartnerVehicle = {
  id: number;
  name: string;
  type: string;
  status: 'Available' | 'Rented' | 'Maintenance';
  pricePerDay: number;
};


// Types with joined details
export type CarReservationWithDetails = Reservation & { car: Car };
export type BusReservationWithDetails = BusReservation & { bus: Bus };
