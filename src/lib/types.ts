

export type VehicleCategory = 'Car' | 'Bike' | 'Scooter' | 'Bus' | 'Truck' | 'Specialized';

export type BaseVehicle = {
  id: string; // Firestore document ID
  name: string;
  category: VehicleCategory;
  pricePerDay: number;
  images: string[];
  description: string;
  status: 'Available' | 'Rented' | 'Maintenance';
  ownerId: string; // email of the owner
  renter?: {
    name: string;
    email: string;
    phone: string;
    rentalPeriod: string;
  } | null;
}

export type Car = BaseVehicle & {
  category: 'Car' | 'Bike' | 'Scooter';
  type: 'Sedan' | 'SUV' | 'Minivan' | 'Convertible' | 'Coupe' | 'Bike' | 'Scooter';
  pricePerKm?: number;
  seats: number;
  luggage: number; // in bags
  transmission: 'Automatic' | 'Manual';
  mpg: number; // kmpl or km/charge
  location?: string;
  features: string[];
};

export type Bus = BaseVehicle & {
  category: 'Bus';
  type: 'Sleeper' | 'Seater' | 'MiniBus';
  seats: number;
  amenities: string[];
  driverRating: number;
  driver?: {
    name: string;
    phone: string;
  };
};

export type Truck = BaseVehicle & {
  category: 'Truck';
  size: 'Mini' | 'Medium' | 'Large';
  payload: string;
  driverRating: number;
};

export type SpecializedVehicle = BaseVehicle & {
  category: 'Specialized';
  type: 'Wheelchair Accessible Van' | 'Pet-Friendly SUV' | 'Senior-Friendly Sedan' | 'Visually Impaired Support';
  capacity: string;
  features: string[];
  driverRating: number;
};

export type AnyVehicle = Car | Bus | Truck | SpecializedVehicle;

export type Reservation = {
  id: string;
  userId: string; // email of the user
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: VehicleCategory;
  startDate: Date;
  endDate: Date;
  totalCost: number;
  pickup?: string;
  dropoff?: string;
  driverAssistance?: boolean; // For cars
  groupName?: string; // For buses
  contactName?: string; // For buses and specialized
  caretakerAssistance?: boolean; // For specialized
};

export type User = {
  name: string;
  email: string; // This will be the document ID in Firestore
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
  partnerType?: 'owner' | 'mechanic' | 'driver';
  specialty?: string; // For mechanics
  jobs?: Job[];
  trips?: Trip[];
  partnerStats?: PartnerStats;
};

// This namespace is kept for compatibility but is no longer tied to Firestore.
export namespace DB {
  export type User = Omit<User, "memberSince"> & {
    memberSince: Date | string; // Allow string for JSON compatibility
  }
  export type Reservation = Omit<Reservation, "startDate" | "endDate"> & {
    startDate: Date | string; // Allow string for JSON compatibility
    endDate: Date | string; // Allow string for JSON compatibility
  }
  export type Vehicle = AnyVehicle;
}

export type PartnerStats = {
  totalRevenue: number;
  avgRating: number;
  activeBookings?: number;
  totalVehicles?: number;
  activeJobs?: number;
  completedJobs?: number;
  totalTrips?: number;
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

export type Job = {
    id: number;
    customerName: string;
    location: string;
    problemDescription: string;
    status: 'Active' | 'Completed' | 'Cancelled';
    date: Date;
    mechanicId: number;
    invoiceAmount?: number;
};

export type Trip = {
    id: number;
    customerName: string;
    route: string; // e.g., "Mumbai to Pune"
    vehicle: string; // e.g., "Tata Nexon"
    date: Date;
    payout: number;
    driverId: number;
};


// Types with joined details
export type ReservationWithVehicle = Reservation & { vehicle: AnyVehicle };
