
import type { User, Mechanic, Job, Trip, AnyVehicle, Car, Bus, Truck, SpecializedVehicle, Reservation, ReservationWithVehicle, VehicleCategory } from './types';

// --- Local Storage Database ---

const LOCAL_DB_KEY = 'driveLinkLocalDB';

type LocalDB = {
  users: User[];
  vehicles: AnyVehicle[];
  reservations: Reservation[];
};

function getLocalDB(): LocalDB {
  if (typeof window === 'undefined') {
    return { users: [], vehicles: [], reservations: [] };
  }
  try {
    const dbStr = localStorage.getItem(LOCAL_DB_KEY);
    if (dbStr) {
      const db = JSON.parse(dbStr);
      // Revive dates
      db.users.forEach((u: User) => u.memberSince = new Date(u.memberSince));
      db.reservations.forEach((r: Reservation) => {
        r.startDate = new Date(r.startDate);
        r.endDate = new Date(r.endDate);
      });
      return db;
    }
  } catch (e) {
    console.error("Failed to parse local DB", e);
  }
  return { users: [], vehicles: [], reservations: [] };
}

function saveLocalDB(db: LocalDB) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  }
}

// --- User Management ---

const defaultUser: User = {
  name: "Guest User",
  email: "guest@example.com",
  password: "",
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

export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    return defaultUser;
  }
  try {
    const storedUser = localStorage.getItem('driveLinkUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const memberSince = parsedUser.memberSince ? new Date(parsedUser.memberSince) : new Date();
      return { ...defaultUser, ...parsedUser, memberSince };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }
  saveUserToLocalStorage(defaultUser);
  return defaultUser;
}

function saveUserToLocalStorage(user: User) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('driveLinkUser', JSON.stringify(user));
    }
}

export async function saveUser(user: User) {
  saveUserToLocalStorage(user);

  if (!user.isGuest) {
    const db = getLocalDB();
    const userIndex = db.users.findIndex(u => u.email === user.email);
    if (userIndex > -1) {
      db.users[userIndex] = user;
    } else {
      db.users.push(user);
    }
    saveLocalDB(db);
  }
}

export function logoutUser() {
  saveUserToLocalStorage(defaultUser);
}

export async function registerUser(details: Pick<User, 'name' | 'email' | 'password' | 'partnerType' | 'isPartner'>): Promise<User> {
  const db = getLocalDB();
  if (db.users.find(u => u.email === details.email)) {
    throw new Error("A user with this email already exists.");
  }
  
  const newUser: User = {
    ...defaultUser,
    name: details.name,
    email: details.email,
    password: details.password,
    isPartner: details.isPartner ?? false,
    partnerType: details.partnerType,
    isGuest: false,
    memberSince: new Date(),
    avatarUrl: "",
    jobs: details.partnerType === 'mechanic' ? [] : undefined,
    trips: details.partnerType === 'driver' ? [] : undefined,
    partnerStats: { totalRevenue: 0, avgRating: 0 },
    specialty: details.partnerType === 'mechanic' ? 'General Repair' : undefined,
  };

  db.users.push(newUser);
  saveLocalDB(db);
  return newUser;
}

export async function authenticateUser(email: string, password?: string): Promise<User | null> {
  const db = getLocalDB();
  const user = db.users.find(u => u.email === email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}

// --- Sample Data ---
const sampleCars: Car[] = [
    {
      id: 'sample-car-1', name: 'Maruti Suzuki Swift', category: 'Car', type: 'Sedan', pricePerDay: 2200, images: [], description: 'A reliable and fuel-efficient car, perfect for city driving and short trips.', status: 'Available', ownerId: 'system@drivelink.com', seats: 5, luggage: 2, transmission: 'Manual', mpg: 22, location: 'Mumbai, MH', features: ['Air Conditioning', 'Power Steering', 'Bluetooth Audio'],
    },
    {
      id: 'sample-car-2', name: 'Hyundai Creta', category: 'Car', type: 'SUV', pricePerDay: 3500, images: [], description: 'A comfortable and spacious SUV, ideal for family vacations and long road trips.', status: 'Available', ownerId: 'system@drivelink.com', seats: 5, luggage: 4, transmission: 'Automatic', mpg: 17, location: 'Delhi, DL', features: ['Sunroof', 'Touchscreen Infotainment', 'Cruise Control', 'Air Purifier'],
    },
    {
      id: 'sample-scooter-1', name: 'Honda Activa 6G', category: 'Scooter', type: 'Scooter', pricePerDay: 800, images: [], description: 'The perfect ride for zipping through city traffic with ease and great mileage.', status: 'Available', ownerId: 'system@drivelink.com', seats: 2, luggage: 1, transmission: 'Automatic', mpg: 45, location: 'Bengaluru, KA', features: ['Silent Start', 'External Fuel Filler', 'LED Headlamp'],
    },
     {
      id: 'sample-bike-1', name: 'Royal Enfield Classic 350', category: 'Bike', type: 'Bike', pricePerDay: 1800, images: [], description: 'Experience the thrill of the open road with this iconic and powerful cruiser.', status: 'Available', ownerId: 'system@drivelink.com', seats: 2, luggage: 1, transmission: 'Manual', mpg: 35, location: 'Goa, GA', features: ['Classic Design', 'Comfortable Riding Position', 'Dual-Channel ABS'],
    },
];
const sampleBuses: Bus[] = [
    {
      id: 'sample-bus-1', name: 'Deluxe Voyager', category: 'Bus', type: 'Sleeper', pricePerDay: 18000, images: [], description: 'Luxury sleeper bus for long-distance travel. Fully equipped with comfortable berths, personal screens, and on-board restroom.', status: 'Available', ownerId: 'system@drivelink.com', seats: 38, amenities: ['Air Conditioning', 'Wi-Fi', 'Personal TV', 'Restroom'], driverRating: 4.8, driver: { name: 'Suresh P.', phone: '9876543210' }
    },
    {
      id: 'sample-bus-2', name: 'City Commuter', category: 'Bus', type: 'Seater', pricePerDay: 12000, images: [], description: 'An efficient and comfortable seater bus perfect for corporate outings or city tours. Ample legroom and panoramic windows.', status: 'Available', ownerId: 'system@drivelink.com', seats: 45, amenities: ['Air Conditioning', 'Reading Lights', 'PA System'], driverRating: 4.7, driver: { name: 'Manoj K.', phone: '9876543211' }
    }
];
const sampleTrucks: Truck[] = [
    {
      id: 'sample-truck-1', name: 'Mighty Mover', category: 'Truck', size: 'Medium', pricePerDay: 8500, images: [], description: 'A reliable medium-sized truck, perfect for house shifting or delivering medium to large-sized goods.', status: 'Available', ownerId: 'system@drivelink.com', payload: '5 Ton', driverRating: 4.6
    },
    {
      id: 'sample-truck-2', name: 'Mini Transporter', category: 'Truck', size: 'Mini', pricePerDay: 4500, images: [], description: 'Compact and efficient mini truck for small-scale logistics and last-mile delivery in the city.', status: 'Available', ownerId: 'system@drivelink.com', payload: '1 Ton', driverRating: 4.8
    }
];
const staticSpecializedVehicles: SpecializedVehicle[] = [
    {
        id: 'spec-001', name: 'MobilityMax Van', category: 'Specialized', type: 'Wheelchair Accessible Van', pricePerDay: 4500, images: [], description: 'Spacious and comfortable van equipped with a hydraulic ramp for easy wheelchair access. Perfect for safe and secure travel for passengers with mobility challenges.', status: 'Available', ownerId: 'system@drivelink.com', capacity: '4 Passengers + 1 Wheelchair', features: ['Hydraulic Wheelchair Ramp', 'Secure Wheelchair Restraints', 'Spacious Interior', 'Trained Driver'], driverRating: 4.9,
    },
    {
        id: 'spec-002', name: 'Paws & Go SUV', category: 'Specialized', type: 'Pet-Friendly SUV', pricePerDay: 3500, images: [], description: 'Travel with your furry friends without worry. This SUV comes with protective seat covers, a pet safety harness, and ample space for carriers.', status: 'Available', ownerId: 'system@drivelink.com', capacity: '4 Passengers + Pet Area', features: ['Pet Seat Covers', 'Safety Harness Clip', 'Ventilated Carrier Space', 'Easy-to-clean interior'], driverRating: 4.8,
    },
    {
        id: 'spec-003', name: 'ComfortRide Sedan', category: 'Specialized', type: 'Senior-Friendly Sedan', pricePerDay: 3000, images: [], description: 'A comfortable and easy-to-access sedan ideal for senior citizens. Features extra cushioning, easy entry/exit, and a driver trained in providing assistance.', status: 'Available', ownerId: 'system@drivelink.com', capacity: '4 Passengers', features: ['Easy Entry & Exit', 'Extra Cushion Support', 'Polite & Trained Driver', 'Ample Legroom'], driverRating: 4.9,
    },
    {
        id: 'spec-004', name: 'Guidance Vehicle', category: 'Specialized', type: 'Visually Impaired Support', pricePerDay: 3200, images: [], description: 'This vehicle service provides a specially trained driver to offer descriptive guidance and assistance for visually impaired passengers, ensuring a safe and informed journey.', status: 'Available', ownerId: 'system@drivelink.com', capacity: '3 Passengers', features: ['Specially Trained Driver', 'Verbal Guidance Assistance', 'Braille Info Card', 'Predictable Interior Layout'], driverRating: 5.0,
    },
];

const allSamples = [...sampleCars, ...sampleBuses, ...sampleTrucks, ...staticSpecializedVehicles];


// --- Vehicle & Reservation Management ---

function getAllVehicles(): AnyVehicle[] {
    const db = getLocalDB();
    return [...allSamples, ...db.vehicles];
}

export async function getAllAvailableCars(): Promise<Car[]> {
  const localVehicles = getLocalDB().vehicles;
  const partnerCars = localVehicles.filter(v => v.status === 'Available' && (v.category === 'Car' || v.category === 'Bike' || v.category === 'Scooter')) as Car[];
  return [...sampleCars, ...partnerCars];
}

export async function getAllAvailableBuses(): Promise<Bus[]> {
  const localVehicles = getLocalDB().vehicles;
  const partnerBuses = localVehicles.filter(v => v.status === 'Available' && v.category === 'Bus') as Bus[];
  return [...sampleBuses, ...partnerBuses];
}

export async function getAllAvailableTrucks(): Promise<Truck[]> {
  const localVehicles = getLocalDB().vehicles;
  const partnerTrucks = localVehicles.filter(v => v.status === 'Available' && v.category === 'Truck') as Truck[];
  return [...sampleTrucks, ...partnerTrucks];
}

export async function getAllAvailableSpecializedVehicles(): Promise<SpecializedVehicle[]> {
    return staticSpecializedVehicles.filter(v => v.status === 'Available');
}

export async function findVehicleById(id: string): Promise<AnyVehicle | undefined> {
    const db = getLocalDB();
    const allVehicles = [...allSamples, ...db.vehicles];
    return allVehicles.find(v => v.id === id);
}

export async function addPartnerVehicle(vehicleData: Partial<AnyVehicle>, category: VehicleCategory, owner?: string): Promise<AnyVehicle> {
    const currentUser = getCurrentUser();
    const ownerId = owner || currentUser.email;

    if (!ownerId || (currentUser.isGuest && !owner)) {
        throw new Error("User must be a logged-in partner to add a vehicle.");
    }

    const db = getLocalDB();
    const newId = `vehicle-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    let finalCategory: VehicleCategory = category;
    if (category === 'Car' && (vehicleData as Car).type && ['Bike', 'Scooter'].includes((vehicleData as Car).type)) {
        finalCategory = (vehicleData as Car).type;
    }

    const newVehicle: AnyVehicle = {
        ...vehicleData,
        id: newId,
        ownerId: ownerId,
        category: finalCategory,
        status: 'Available',
    } as AnyVehicle;

    db.vehicles.push(newVehicle);
    saveLocalDB(db);
    return newVehicle;
}

export async function updatePartnerVehicle(vehicle: AnyVehicle): Promise<void> {
    const db = getLocalDB();
    const index = db.vehicles.findIndex(v => v.id === vehicle.id);
    if (index > -1) {
        db.vehicles[index] = vehicle;
        saveLocalDB(db);
    } else {
        throw new Error("Vehicle not found for update.");
    }
}

export async function getVehiclesForPartner(ownerId: string): Promise<AnyVehicle[]> {
    const db = getLocalDB();
    return db.vehicles.filter(v => v.ownerId === ownerId);
}

export async function createReservation(reservation: Omit<Reservation, 'id'>) {
    const db = getLocalDB();
    const newId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newReservation: Reservation = {
      ...reservation,
      id: newId,
    };
    db.reservations.push(newReservation);
    saveLocalDB(db);
    return newId;
}

export async function getReservationsForUser(userId: string): Promise<ReservationWithVehicle[]> {
    const db = getLocalDB();
    const userReservations = db.reservations.filter(r => r.userId === userId);
    
    const reservationsWithVehicle: ReservationWithVehicle[] = [];
    for (const res of userReservations) {
        const vehicle = await findVehicleById(res.vehicleId);
        if (vehicle) {
            reservationsWithVehicle.push({ ...res, vehicle });
        }
    }

    return reservationsWithVehicle.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

export async function cancelReservation(reservationId: string, vehicleId: string) {
    const db = getLocalDB();
    db.reservations = db.reservations.filter(r => r.id !== reservationId);
    
    const vehicle = await findVehicleById(vehicleId);
    if (vehicle && !vehicle.id.startsWith('sample-')) { // Don't update sample vehicles
        vehicle.status = 'Available';
        vehicle.renter = null;
        await updatePartnerVehicle(vehicle);
    }
    
    saveLocalDB(db);
}

export async function isVehicleAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
    const db = getLocalDB();
    const vehicle = await findVehicleById(vehicleId);
    if (!vehicle || vehicle.status !== 'Available') return false;

    const existingReservations = db.reservations.filter(r => r.vehicleId === vehicleId);

    const start = startDate.getTime();
    const end = endDate.getTime();

    for (const res of existingReservations) {
        const resStart = new Date(res.startDate).getTime();
        const resEnd = new Date(res.endDate).getTime();
        if (Math.max(start, resStart) < Math.min(end, resEnd)) {
            return false;
        }
    }
    return true;
}

export async function findOwnerOfVehicle(vehicleId: string): Promise<User | undefined> {
    const db = getLocalDB();
    const vehicle = await findVehicleById(vehicleId);
    if (!vehicle) return undefined;
    return db.users.find(u => u.email === vehicle.ownerId);
}

// --- Mechanic Support ---
export async function getAllRegisteredMechanics(): Promise<Mechanic[]> {
    const db = getLocalDB();
    return db.users
        .filter(u => u.isPartner && u.partnerType === 'mechanic')
        .map((u, index) => ({
            id: index + 100,
            name: u.name,
            location: u.address || 'Location not set',
            phone: u.phone || 'Phone not set',
            rating: u.partnerStats?.avgRating || 4.5,
            specialty: u.specialty || 'General Repair',
            avatarUrl: u.avatarUrl || '',
        }));
}
