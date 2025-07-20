
import type { Car, Reservation, Bus, User, PartnerVehicle, Truck, BusReservation, CarReservationWithDetails, BusReservationWithDetails, SpecializedVehicle, SpecializedVehicleReservation, SpecializedVehicleReservationWithDetails, Mechanic, Job, Trip, DB } from './types';
import { startOfDay } from 'date-fns';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';


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

export const anotherSampleMechanicJobs: Job[] = [
    {
        id: 4,
        customerName: 'Vikram Singh',
        location: 'Bandra, Mumbai',
        problemDescription: 'Brakes are making a squealing noise.',
        status: 'Active',
        date: new Date('2024-07-21T11:00:00Z'),
        mechanicId: 3
    },
    {
        id: 5,
        customerName: 'Saanvi Gupta',
        location: 'Powai, Mumbai',
        problemDescription: 'Check engine light is on.',
        status: 'Completed',
        date: new Date('2024-07-20T14:00:00Z'),
        mechanicId: 3,
        invoiceAmount: 2200
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

const getRegisteredUsers = async (): Promise<User[]> => {
    if (!db) {
        console.error("Firestore is not initialized.");
        return [];
    }
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => {
        const data = doc.data() as DB.User;
        return {
            ...data,
            memberSince: data.memberSince.toDate(),
        } as User;
    });
    return userList;
};

// --- Public Data Fetchers ---

async function getAllPartnerVehicles(): Promise<PartnerVehicle[]> {
    const users = await getRegisteredUsers();
    return users
        .filter(u => u.isPartner && u.partnerType === 'owner' && u.vehicles)
        .flatMap(u => u.vehicles!);
}

export async function getAllAvailableCars(): Promise<Car[]> {
  const allVehicles = await getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 
    ('seats' in v && !('amenities' in v)) // A simple way to distinguish cars/bikes
  ) as Car[];
}

export async function getAllAvailableBuses(): Promise<Bus[]> {
  const allVehicles = await getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 'amenities' in v
  ) as Bus[];
}

export async function getAllAvailableTrucks(): Promise<Truck[]> {
  const allVehicles = await getAllPartnerVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 'payload' in v
  ) as Truck[];
}

export async function getAllRegisteredMechanics(): Promise<Mechanic[]> {
    const users = await getRegisteredUsers();
    return users
        .filter(u => u.isPartner && u.partnerType === 'mechanic')
        .map((u, index) => ({
            id: index + 100, // Assign a temporary unique ID
            name: u.name,
            location: u.address,
            phone: u.phone,
            rating: u.partnerStats?.avgRating || 4.5,
            specialty: u.specialty || 'General Repair',
            avatarUrl: u.avatarUrl || '',
        }));
}

export async function findCarById(id: number): Promise<Car | undefined> {
  const cars = (await getAllPartnerVehicles()).filter(v => 'seats' in v && !('amenities' in v)) as Car[];
  return cars.find(car => car.id === id);
}

export async function findBusById(id: number): Promise<Bus | undefined> {
  const buses = (await getAllPartnerVehicles()).filter(v => 'amenities' in v) as Bus[];
  return buses.find(bus => bus.id === id);
}

export async function findTruckById(id: number): Promise<Truck | undefined> {
  const trucks = (await getAllPartnerVehicles()).filter(v => 'payload' in v) as Truck[];
  return trucks.find(truck => truck.id === id);
}

export const findSpecializedVehicleById = (id: number) => specializedVehicles.find(v => v.id === id);


export const findCarReservations = (): CarReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  const storedCarReservations: Reservation[] = JSON.parse(localStorage.getItem('carReservations') || '[]');
  // This function needs to be async now to fetch car details from Firestore
  // For now, it will only work with cars that are in the static list, which is a limitation.
  // A full migration would require storing and fetching reservations from Firestore as well.
  return []; 
};

export const findBusReservations = (): BusReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  return [];
};

export const findSpecializedVehicleReservations = (): SpecializedVehicleReservationWithDetails[] => {
  if (typeof window === 'undefined') return [];
  return [];
};

export async function isCarAvailable(carId: number, startDate: Date, endDate: Date): Promise<boolean> {
    // This function will need to be updated to check reservations in Firestore.
    // For now, we'll assume a car is available if it's marked as 'Available'.
    const car = await findCarById(carId);
    return car?.status === 'Available';
}

export async function registerUser(details: Pick<User, 'name' | 'email' | 'password' | 'partnerType' | 'isPartner'>): Promise<User> {
    if (!db) throw new Error("Firestore not initialized.");
    
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", details.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        throw new Error("A user with this email already exists.");
    }

    const newUser: User = {
        ...defaultUser,
        name: details.name,
        email: details.email,
        password: details.password, // In a real app, this should be hashed on the server.
        isPartner: details.isPartner ?? false,
        partnerType: details.partnerType,
        isGuest: false,
        memberSince: new Date(),
        avatarUrl: "",
        vehicles: details.partnerType === 'owner' ? [] : undefined,
        jobs: details.partnerType === 'mechanic' ? [] : undefined,
        trips: details.partnerType === 'driver' ? [] : undefined,
        partnerStats: { totalRevenue: 0, avgRating: 0 },
        specialty: details.partnerType === 'mechanic' ? 'General Repair' : undefined,
    };
    
    // Save to Firestore
    await setDoc(doc(db, "users", newUser.email), newUser);

    return newUser;
}

export async function authenticateUser(email: string, password?: string): Promise<User | null> {
    if (!db) {
        console.error("Firestore is not initialized.");
        return null;
    }
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const user = docSnap.data() as User;
        // In a real app, use a secure method to verify the password hash.
        if (user.password === password) {
            return {
              ...user,
              memberSince: (user.memberSince as any).toDate(),
            };
        }
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
      return {
        ...defaultUser,
        ...parsedUser,
        memberSince: new Date(parsedUser.memberSince),
      };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }
  saveUserToLocalStorage(defaultUser);
  return defaultUser;
};

// Saves user to local storage for client-side session management
function saveUserToLocalStorage(user: User) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('driveLinkUser', JSON.stringify(user));
    }
}

// Saves user to both local storage and Firestore
export async function saveUser(user: User) {
  saveUserToLocalStorage(user);

  if (!user.isGuest && db) {
    try {
      await setDoc(doc(db, "users", user.email), user, { merge: true });
    } catch (error) {
      console.error("Failed to save user to Firestore", error);
    }
  }
}

export function logoutUser() {
  saveUserToLocalStorage(defaultUser);
}


// --- Partner Vehicle Management ---

export async function updatePartnerVehicle(vehicle: PartnerVehicle): Promise<User> {
    const currentUser = getCurrentUser();
    if (!currentUser.isPartner || !currentUser.vehicles) {
      throw new Error("User is not a partner or has no vehicles.");
    }

    const vehicleIndex = currentUser.vehicles.findIndex(v => v.id === vehicle.id);
    if (vehicleIndex !== -1) {
        currentUser.vehicles[vehicleIndex] = vehicle;
    }
    
    await saveUser(currentUser);
    return currentUser;
};

export async function addPartnerVehicle(vehicle: Omit<PartnerVehicle, 'id'>): Promise<User> {
    const currentUser = getCurrentUser();
    if (!currentUser.isPartner) {
        throw new Error("User is not a partner.");
    }

    const currentVehicles = currentUser.vehicles || [];

    const newVehicle = {
        ...vehicle,
        id: Date.now(),
    };
    
    currentUser.vehicles = [...currentVehicles, newVehicle as PartnerVehicle];
    await saveUser(currentUser);
    return currentUser;
};

export async function findOwnerOfVehicle(vehicleId: number): Promise<User | undefined> {
    const users = await getRegisteredUsers();
    return users.find(u => u.isPartner && u.vehicles?.some(v => v.id === vehicleId));
};

    