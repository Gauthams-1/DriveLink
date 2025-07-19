

export type Car = {
  id: number;
  name: string;
  type: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe' | 'Bike' | 'Scooter';
  pricePerDay: number;
  pricePerKm?: number;
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
  pickup: string;
  dropoff: string;
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

export type SpecializedVehicleReservation = {
  id: number;
  vehicleId: number;
  contactName: string;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  caretakerAssistance?: boolean;
}

export type Bus = {
  id: number;
  name: string;
  type: 'Sleeper' | 'Seater' | 'MiniBus';
  seats: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
  driverRating: number;
};

export type Truck = {
  id: number;
  name: string;
  size: 'Mini' | 'Medium' | 'Large';
  pricePerDay: number;
  payload: string;
  description: string;
  images: string[];
  driverRating: number;
};

export type SpecializedVehicle = {
  id: number;
  name: string;
  type: 'Wheelchair Accessible Van' | 'Pet-Friendly SUV' | 'Senior-Friendly Sedan' | 'Visually Impaired Support';
  description: string;
  pricePerDay: number;
  capacity: string;
  features: string[];
  images: string[];
  driverRating: number;
};

export type User = {
  name: string;
  email: string;
  password?: string; // Should be hashed in a real app
  phone: string;
  address: string;
  licenseNumber: string;
  aadhaarNumber: string;
  isVerified: boolean;
  avatarUrl: string;
  memberSince: Date;
  isGuest?: boolean;
  isPartner?: boolean;
};

export type PartnerStats = {
  totalRevenue: number;
  activeBookings: number;
  totalVehicles: number;
  avgRating: number;
};

export type PartnerVehicle = Car & {
  status: 'Available' | 'Rented' | 'Maintenance';
  renter?: {
    name: string;
    email: string;
    phone: string;
    rentalPeriod: string;
  } | null;
};

export type Mechanic = {
    id: number;
    name: string;
    location: string;
    phone: string;
    rating: number;
    specialty: string;
    avatarUrl: string;
    reasoning?: string;
};


// Types with joined details
export type CarReservationWithDetails = Reservation & { car: Car };
export type BusReservationWithDetails = BusReservation & { bus: Bus };
export type SpecializedVehicleReservationWithDetails = SpecializedVehicleReservation & { vehicle: SpecializedVehicle };
