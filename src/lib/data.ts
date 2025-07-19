
import type { Car, Reservation, Bus, User, PartnerStats, PartnerVehicle, Truck, BusReservation, CarReservationWithDetails, BusReservationWithDetails, SpecializedVehicle, SpecializedVehicleReservation, SpecializedVehicleReservationWithDetails, Mechanic, Job, Trip } from './types';
import { startOfDay } from 'date-fns';

// This file now primarily manages user data and provides functions to access vehicle data.
// The static vehicle arrays are now part of the default partner's data.

const defaultUser: User = {
  name: "Guest User",
  email: "guest@example.com",
  password: "", // Guest user doesn't need a password
  phone: "",
  address: "",
  licenseNumber: "",
  aadhaarNumber: "",
  isVerified: false,
  avatarUrl: "",
  memberSince: new Date(),
  isGuest: true,
  isPartner: false,
};

export const samplePartnerVehicles: PartnerVehicle[] = [
  {
    id: 1,
    name: 'Maruti Suzuki Swift Dzire',
    type: 'Sedan',
    pricePerDay: 2500,
    seats: 5,
    luggage: 2,
    transmission: 'Automatic',
    mpg: 22,
    location: 'Mumbai, MH',
    images: [""],
    description: 'A reliable and fuel-efficient hatchback, perfect for city driving and small families.',
    features: ['Bluetooth', 'Backup Camera', 'Apple CarPlay'],
    status: 'Available',
    renter: null,
    pricePerKm: 15,
  },
  {
    id: 2,
    name: 'Tata Nexon',
    type: 'SUV',
    pricePerDay: 4500,
    seats: 5,
    luggage: 4,
    transmission: 'Automatic',
    mpg: 17,
    location: 'Delhi, DL',
    images: [""],
    description: 'A stylish and safe compact SUV, ready for any adventure, from mountain roads to city streets.',
    features: ['All-Wheel Drive', 'Sunroof', 'Touchscreen Infotainment'],
    status: 'Rented',
    renter: { name: 'Priya Sharma', email: 'priya.s@example.com', phone: '9876543210', rentalPeriod: 'July 15 - July 20'},
    pricePerKm: 18,
  },
  {
    id: 3,
    name: 'Toyota Innova Crysta',
    type: 'Minivan',
    pricePerDay: 5500,
    seats: 7,
    luggage: 6,
    transmission: 'Automatic',
    mpg: 12,
    location: 'Bengaluru, KA',
    images: [""],
    description: 'The ultimate family vehicle with ample space for passengers and luggage. Perfect for long road trips.',
    features: ['Rear Entertainment System', 'Captain Seats', 'Power Sliding Doors'],
    status: 'Maintenance',
    renter: null,
    pricePerKm: 20,
  },
  {
    id: 4,
    name: 'Mahindra Thar',
    type: 'Convertible',
    pricePerDay: 6000,
    seats: 4,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 15,
    location: 'Goa, GA',
    images: [""],
    description: 'Experience true freedom with this iconic off-roader. Ideal for scenic drives and exploring rough terrains.',
    features: ['4x4 Capability', 'Removable Roof', 'Touchscreen with Adventure Stats'],
    status: 'Available',
    renter: null,
    pricePerKm: 25,
  },
   {
    id: 5,
    name: 'Luxury Sleeper Coach',
    type: 'Sleeper',
    seats: 30,
    pricePerDay: 22000,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Personal TV', 'Blankets'],
    images: [''],
    driverRating: 4.9,
    driver: { name: 'Suresh Patil', phone: '9012345678' },
    status: 'Available',
    renter: null,
  },
  {
    id: 6,
    name: 'Workhorse Hauler',
    size: 'Medium',
    pricePerDay: 7000,
    payload: '3 Ton',
    description: 'Ideal for 2-3 BHK house shifting and commercial equipment.',
    images: [''],
    driverRating: 4.9,
    status: 'Available',
    renter: null
  },
  {
    id: 9,
    name: 'Royal Enfield Classic 350',
    type: 'Bike',
    pricePerDay: 1500,
    seats: 2,
    luggage: 0,
    transmission: 'Manual',
    mpg: 40,
    location: 'Goa, GA',
    images: [""],
    description: 'A classic cruiser for exploring scenic routes and coastal roads. Timeless design and a thumping engine.',
    features: ['Classic Styling', 'Comfortable Riding Posture'],
    status: 'Available',
    renter: null,
  },
  {
    id: 10,
    name: 'Ather 450X',
    type: 'Scooter',
    pricePerDay: 1200,
    seats: 2,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 110,
    location: 'Bengaluru, KA',
    images: [""],
    description: 'A smart and stylish electric scooter for zipping through city traffic. Packed with tech features.',
    features: ['Digital Dashboard', 'Fast Charging', 'Reverse Mode'],
    status: 'Available',
    renter: null,
  }
];

export const sampleMechanicJobs: Job[] = [
    {
        id: 1,
        customerName: 'Aarav Patel',
        location: 'Koregaon Park, Pune',
        problemDescription: 'Car is not starting, there is a clicking sound.',
        status: 'Active',
        date: new Date('2024-07-20T10:00:00Z'),
        mechanicId: 2
    },
    {
        id: 2,
        customerName: 'Priya Singh',
        location: 'Juhu, Mumbai',
        problemDescription: 'Flat tire on the highway.',
        status: 'Completed',
        date: new Date('2024-07-19T15:30:00Z'),
        mechanicId: 2,
        invoiceAmount: 500
    },
    {
        id: 3,
        customerName: 'Rohan Mehta',
        location: 'Indiranagar, Bengaluru',
        problemDescription: 'Engine is overheating and smoke is coming out.',
        status: 'Completed',
        date: new Date('2024-07-18T11:00:00Z'),
        mechanicId: 2,
        invoiceAmount: 3500
    }
];

export const sampleDriverTrips: Trip[] = [
    {
        id: 1,
        customerName: 'Ananya Verma',
        route: 'Mumbai Airport to Taj Mahal Palace',
        vehicle: 'Skoda Superb',
        date: new Date('2024-07-21T14:00:00Z'),
        payout: 2500,
        driverId: 3,
    },
    {
        id: 2,
        customerName: 'Ravi Kumar',
        route: 'Pune City to Lonavala',
        vehicle: 'Tata Nexon',
        date: new Date('2024-07-20T09:30:00Z'),
        payout: 3200,
        driverId: 3,
    },
    {
        id: 3,
        customerName: 'Meera Desai',
        route: 'Goa Airport to Calangute Beach',
        vehicle: 'Mahindra Thar',
        date: new Date('2024-07-18T11:00:00Z'),
        payout: 1800,
        driverId: 3,
    }
];

export const mechanics: Mechanic[] = [
    {
        id: 1,
        name: 'Rajesh Kumar',
        location: 'Andheri, Mumbai, MH',
        phone: '9876543210',
        rating: 4.8,
        specialty: 'General Car Repair & Maintenance',
        avatarUrl: '',
    },
    {
        id: 2,
        name: 'Suresh Singh',
        location: 'Dadar, Mumbai, MH',
        phone: '9876543211',
        rating: 4.9,
        specialty: 'Engine & Transmission Expert',
        avatarUrl: '',
    },
    {
        id: 3,
        name: 'Anil Patel',
        location: 'Bandra, Mumbai, MH',
        phone: '9876543212',
        rating: 4.7,
        specialty: 'Tire & Brakes Specialist',
        avatarUrl: '',
    },
    {
        id: 4,
        name: 'Vikas Sharma',
        location: 'Connaught Place, Delhi, DL',
        phone: '9876543213',
        rating: 4.9,
        specialty: 'Luxury Car Specialist',
        avatarUrl: '',
    },
];

export const specializedVehicles: SpecializedVehicle[] = [
  {
    id: 1,
    name: 'Freedom Wheels Transporter',
    type: 'Wheelchair Accessible Van',
    description: 'A spacious van equipped with a hydraulic ramp and secure wheelchair restraints for safe and comfortable travel.',
    pricePerDay: 7000,
    capacity: '1 Wheelchair + 4 Passengers',
    features: ['Hydraulic Ramp', 'Wheelchair Locks', 'High Roof', 'Spacious Interior'],
    images: [''],
    driverRating: 4.9,
  },
  {
    id: 2,
    name: 'Paws & Go Cruiser',
    type: 'Pet-Friendly SUV',
    description: 'Travel with your furry friends without worry. This SUV comes with pet-safe seat covers, a safety harness, and a water bowl.',
    pricePerDay: 5500,
    capacity: '2 Pets + 3 Passengers',
    features: ['Pet Seat Covers', 'Safety Harness', 'Air Purification', 'Spill-proof Water Bowl'],
    images: [''],
    driverRating: 4.8,
  },
  {
    id: 3,
    name: 'Golden Years Comfort Ride',
    type: 'Senior-Friendly Sedan',
    description: 'A comfortable sedan with low-step entry, extra cushioning, and a patient, courteous driver for our senior citizens.',
    pricePerDay: 4000,
    capacity: '4 Passengers',
    features: ['Easy Entry/Exit', 'Extra Legroom', 'Comfort-tuned Suspension', 'First-Aid Kit'],
    images: [''],
    driverRating: 5.0,
  },
  {
    id: 4,
    name: 'Sensory Explorer Sedan',
    type: 'Visually Impaired Support',
    description: 'A comfortable sedan equipped with an advanced AI audio system that provides real-time descriptions of the surroundings for visually impaired passengers.',
    pricePerDay: 6000,
    capacity: '3 Passengers',
    features: ['AI Surround Description', 'Braille Controls', 'Voice Commands', 'Priority Assistance'],
    images: [''],
    driverRating: 4.9,
  },
];


// --- User Management & Data Access ---
let registeredUsers: User[] | null = null;
let defaultPartnersCreated = false;

const getRegisteredUsers = (): User[] => {
    if (typeof window === 'undefined') {
        if (!registeredUsers) {
            registeredUsers = [];
            createDefaultPartners();
        }
        return registeredUsers;
    }

    if (registeredUsers === null) {
        let usersJson = localStorage.getItem('driveLinkRegisteredUsers');
        if (usersJson) {
            registeredUsers = JSON.parse(usersJson).map((user: User) => ({
                ...user,
                memberSince: new Date(user.memberSince)
            }));
            defaultPartnersCreated = true;
        } else {
            registeredUsers = [];
            createDefaultPartners();
            saveRegisteredUsers(registeredUsers);
        }
    }
    
    return registeredUsers;
}

const createDefaultPartners = () => {
    if (defaultPartnersCreated || !registeredUsers) return;

    const defaultOwnerPartner: User = {
        name: "Default Owner Partner",
        email: "owner@example.com",
        password: "password",
        phone: "1234567890",
        address: "123 Partner Lane, Mumbai",
        licenseNumber: "MH123456789",
        aadhaarNumber: "123456789012",
        isVerified: true,
        avatarUrl: "",
        memberSince: new Date(),
        isGuest: false,
        isPartner: true,
        partnerType: 'owner',
        vehicles: samplePartnerVehicles,
        partnerStats: { totalRevenue: 850000, avgRating: 4.9, activeBookings: 1, totalVehicles: samplePartnerVehicles.length },
    };
    const defaultMechanicPartner: User = {
        name: "Default Mechanic Partner",
        email: "mechanic@example.com",
        password: "password",
        phone: "0987654321",
        address: "456 Garage Street, Pune",
        licenseNumber: "MH0987654321",
        aadhaarNumber: "987654321098",
        isVerified: true,
        avatarUrl: "",
        memberSince: new Date(),
        isGuest: false,
        isPartner: true,
        partnerType: 'mechanic',
        specialty: 'General Repair',
        jobs: sampleMechanicJobs,
        partnerStats: { totalRevenue: 48000, avgRating: 4.8, activeJobs: 1, completedJobs: 2 },
    };
    const defaultDriverPartner: User = {
        name: "Default Driver Partner",
        email: "driver@example.com",
        password: "password",
        phone: "9988776655",
        address: "789 Driver's Quarters, Delhi",
        licenseNumber: "DL987654321",
        aadhaarNumber: "567890123456",
        isVerified: true,
        avatarUrl: "",
        memberSince: new Date(),
        isGuest: false,
        isPartner: true,
        partnerType: 'driver',
        trips: sampleDriverTrips,
        partnerStats: { totalRevenue: 155000, avgRating: 4.9, totalTrips: 25 },
    };
    
    registeredUsers.push(defaultOwnerPartner, defaultMechanicPartner, defaultDriverPartner);
    defaultPartnersCreated = true;
}


const saveRegisteredUsers = (users: User[]) => {
    registeredUsers = users; // Update in-memory cache
    if (typeof window !== 'undefined') {
        localStorage.setItem('driveLinkRegisteredUsers', JSON.stringify(users));
    }
}

// --- Public Data Fetchers ---

function getAllPartnerVehicles(): PartnerVehicle[] {
    const users = getRegisteredUsers();
    return users
        .filter(u => u.isPartner && u.partnerType === 'owner' && u.vehicles)
        .flatMap(u => u.vehicles!);
}

export function getAllAvailableCars(): Car[] {
  const allVehicles = getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 
    ('seats' in v && !('amenities' in v)) // A simple way to distinguish cars/bikes
  ) as Car[];
}

export function getAllAvailableBuses(): Bus[] {
  const allVehicles = getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 'amenities' in v
  ) as Bus[];
}

export function getAllAvailableTrucks(): Truck[] {
  const allVehicles = getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 'payload' in v
  ) as Truck[];
}

export function getAllRegisteredMechanics(): Mechanic[] {
    const users = getRegisteredUsers();
    return users
        .filter(u => u.isPartner && u.partnerType === 'mechanic')
        .map((u, index) => ({
            id: index + 100, // Assign a temporary unique ID
            name: u.name,
            location: u.address,
            phone: u.phone,
            rating: u.partnerStats?.avgRating || 0,
            specialty: u.specialty || 'General Repair',
            avatarUrl: u.avatarUrl,
        }));
}

export function findCarById(id: number): Car | undefined {
  const cars = getAllPartnerVehicles().filter(v => 'seats' in v && !('amenities' in v)) as Car[];
  return cars.find(car => car.id === id);
}

export function findBusById(id: number): Bus | undefined {
  const buses = getAllPartnerVehicles().filter(v => 'amenities' in v) as Bus[];
  return buses.find(bus => bus.id === id);
}

export function findTruckById(id: number): Truck | undefined {
  const trucks = getAllPartnerVehicles().filter(v => 'payload' in v) as Truck[];
  return trucks.find(truck => truck.id === id);
}

export const findSpecializedVehicleById = (id: number) => specializedVehicles.find(v => v.id === id);


export const findCarReservations = (): CarReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  const storedCarReservations: Reservation[] = JSON.parse(localStorage.getItem('carReservations') || '[]');
  return storedCarReservations
        .map(r => {
            const car = findCarById(r.carId);
            return car ? { ...r, car, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
        })
        .filter((r): r is CarReservationWithDetails => r !== null);
};

export const findBusReservations = (): BusReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  const storedBusReservations: BusReservation[] = JSON.parse(localStorage.getItem('busReservations') || '[]');
  return storedBusReservations
        .map(r => {
            const bus = findBusById(r.busId);
            return bus ? { ...r, bus, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
        })
        .filter((r): r is BusReservationWithDetails => r !== null);
};

export const findSpecializedVehicleReservations = (): SpecializedVehicleReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  const storedReservations: SpecializedVehicleReservation[] = JSON.parse(localStorage.getItem('specializedVehicleReservations') || '[]');
  return storedReservations
        .map(r => {
            const vehicle = findSpecializedVehicleById(r.vehicleId);
            return vehicle ? { ...r, vehicle, startDate: new Date(r.startDate), endDate: new Date(r.endDate) } : null;
        })
        .filter((r): r is SpecializedVehicleReservationWithDetails => r !== null);
};

/**
 * Checks if a car is available for a given date range.
 * @param carId The ID of the car to check.
 * @param startDate The desired start date for the rental.
 * @param endDate The desired end date for the rental.
 * @returns `true` if the car is available, `false` otherwise.
 */
export function isCarAvailable(carId: number, startDate: Date, endDate: Date): boolean {
    const reservations = findCarReservations();
    const carReservations = reservations.filter(r => r.carId === carId);

    const searchStart = startOfDay(startDate);
    const searchEnd = startOfDay(endDate);

    const isOverlapping = carReservations.some(res => {
        const resStart = startOfDay(new Date(res.startDate));
        const resEnd = startOfDay(new Date(res.endDate));
        return resStart < searchEnd && resEnd > searchStart;
    });

    return !isOverlapping;
}


export function registerUser(details: Pick<User, 'name' | 'email' | 'password' | 'partnerType' | 'isPartner'>): User {
    const users = getRegisteredUsers();
    if (users.some(u => u.email === details.email)) {
        throw new Error("A user with this email already exists.");
    }

    const newUser: User = {
        ...defaultUser,
        name: details.name,
        email: details.email,
        password: details.password,
        isPartner: details.isPartner,
        partnerType: details.partnerType,
        isGuest: false,
        memberSince: new Date(),
        avatarUrl: "",
        vehicles: details.partnerType === 'owner' ? [] : undefined,
        jobs: details.partnerType === 'mechanic' ? [] : undefined,
        trips: details.partnerType === 'driver' ? [] : undefined,
        partnerStats: {
          totalRevenue: 0,
          avgRating: 0,
        },
    };

    users.push(newUser);
    saveRegisteredUsers(users);
    return newUser;
}

export function authenticateUser(email: string, password?: string): User | null {
    // In a real app, never compare passwords in plain text.
    // This is for demonstration purposes only.
    const users = getRegisteredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        return user;
    }
    return null;
}


export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    return defaultUser;
  }
  try {
    const storedUser = localStorage.getItem('driveLinkUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Dates are not automatically converted, so we need to parse them
      return {
        ...defaultUser,
        ...parsedUser,
        memberSince: new Date(parsedUser.memberSince),
      };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }
  // If no user is in local storage, save the default user first.
  saveUser(defaultUser);
  return defaultUser;
};

export function saveUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('driveLinkUser', JSON.stringify(user));

    // Also update the user in the registered users list if they are not a guest
    if (!user.isGuest) {
      const users = getRegisteredUsers();
      const userIndex = users.findIndex(u => u.email === user.email);
      if (userIndex !== -1) {
        users[userIndex] = user;
        saveRegisteredUsers(users);
      }
    }
  }
}

export function logoutUser() {
  saveUser(defaultUser);
}


// --- Partner Vehicle Management ---

export const updatePartnerVehicle = (vehicle: PartnerVehicle): User => {
    const currentUser = getCurrentUser();
    if (!currentUser.isPartner || !currentUser.vehicles) {
      throw new Error("User is not a partner or has no vehicles.");
    }

    const vehicleIndex = currentUser.vehicles.findIndex(v => v.id === vehicle.id);
    if (vehicleIndex !== -1) {
        currentUser.vehicles[vehicleIndex] = vehicle;
    }
    
    saveUser(currentUser);
    return currentUser;
};

export const addPartnerVehicle = (vehicle: Omit<PartnerVehicle, 'id'>): User => {
    const currentUser = getCurrentUser();
    if (!currentUser.isPartner) {
        throw new Error("User is not a partner.");
    }

    const currentVehicles = currentUser.vehicles || [];

    const newVehicle = {
        ...vehicle,
        id: Date.now(), // Use a timestamp for a more unique ID
    };
    
    currentUser.vehicles = [...currentVehicles, newVehicle as PartnerVehicle];
    saveUser(currentUser);
    return currentUser;
};

export const findOwnerOfVehicle = (vehicleId: number): User | undefined => {
    const users = getRegisteredUsers();
    return users.find(u => u.isPartner && u.vehicles?.some(v => v.id === vehicleId));
};

