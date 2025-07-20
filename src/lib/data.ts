
import type { User, Mechanic, Job, Trip, DB, AnyVehicle, Car, Bus, Truck, SpecializedVehicle, Reservation, ReservationWithVehicle } from './types';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';


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

const getRegisteredUsers = async (): Promise<User[]> => {
    if (!db) {
        console.warn("Firestore is not initialized. Returning empty user list.");
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

async function getAllVehicles(): Promise<AnyVehicle[]> {
    if (!db) return [];
    const vehiclesCol = collection(db, 'vehicles');
    const vehicleSnapshot = await getDocs(vehiclesCol);
    return vehicleSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AnyVehicle));
}


export async function getAllAvailableCars(): Promise<Car[]> {
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && 
    (v.category === 'Car' || v.category === 'Bike' || v.category === 'Scooter')
  ) as Car[];
}

export async function getAllAvailableBuses(): Promise<Bus[]> {
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && v.category === 'Bus'
  ) as Bus[];
}

export async function getAllAvailableTrucks(): Promise<Truck[]> {
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && v.category === 'Truck'
  ) as Truck[];
}

export async function getAllAvailableSpecializedVehicles(): Promise<SpecializedVehicle[]> {
  const allVehicles = await getAllVehicles();
  return allVehicles.filter(v => 
    v.status === 'Available' && v.category === 'Specialized'
  ) as SpecializedVehicle[];
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

export async function findVehicleById(id: string): Promise<AnyVehicle | undefined> {
    if (!db) {
        console.warn("Firestore is not initialized. Cannot find vehicle.");
        return undefined;
    };
    const docRef = doc(db, 'vehicles', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as AnyVehicle;
    }
    return undefined;
}


export async function getReservationsForUser(userId: string): Promise<ReservationWithVehicle[]> {
    if (!db) {
        console.warn("Firestore is not initialized. Cannot get reservations.");
        return [];
    }
    
    const reservationsRef = collection(db, 'reservations');
    const q = query(reservationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const reservations: ReservationWithVehicle[] = [];

    for (const docSnap of querySnapshot.docs) {
        const resData = docSnap.data() as DB.Reservation;
        const vehicle = await findVehicleById(resData.vehicleId);
        if (vehicle) {
            reservations.push({
                ...resData,
                id: docSnap.id,
                startDate: resData.startDate.toDate(),
                endDate: resData.endDate.toDate(),
                vehicle,
            });
        }
    }
    
    return reservations.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

export async function isVehicleAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
    if (!db) {
        console.warn("Firestore is not initialized. Assuming vehicle is available.");
        return true;
    }

    const vehicle = await findVehicleById(vehicleId);
    if (vehicle?.status !== 'Available') return false;

    const reservationsRef = collection(db, "reservations");
    const q = query(
      reservationsRef,
      where("vehicleId", "==", vehicleId)
    );
  
    const snapshot = await getDocs(q);
    const existingReservations = snapshot.docs.map(doc => (doc.data() as DB.Reservation));
  
    const start = startDate.getTime();
    const end = endDate.getTime();
  
    for (const res of existingReservations) {
      const resStart = res.startDate.toDate().getTime();
      const resEnd = res.endDate.toDate().getTime();
      // Check for overlap
      if (Math.max(start, resStart) < Math.min(end, resEnd)) {
        return false;
      }
    }
  
    return true;
}

export async function registerUser(details: Pick<User, 'name' | 'email' | 'password' | 'partnerType' | 'isPartner'>): Promise<User> {
    if (!db) {
        console.error("Firestore not initialized. Cannot register user.");
        throw new Error("Database is not configured. Please contact support.");
    }
    
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
        console.warn("Firestore is not initialized. Cannot authenticate user.");
        return null;
    }
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const user = docSnap.data() as DB.User;
        // In a real app, use a secure method to verify the password hash.
        if (user.password === password) {
            return {
              ...user,
              memberSince: user.memberSince.toDate(),
            } as User;
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
      // Ensure date objects are correctly parsed
      const memberSince = parsedUser.memberSince ? new Date(parsedUser.memberSince) : new Date();
      return {
        ...defaultUser,
        ...parsedUser,
        memberSince,
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

export async function updatePartnerVehicle(vehicle: AnyVehicle): Promise<void> {
    if (!db || !vehicle.id) {
        console.error("Firestore not initialized or vehicle ID missing. Cannot update vehicle.");
        return;
    };
    const vehicleRef = doc(db, 'vehicles', vehicle.id);
    await updateDoc(vehicleRef, { ...vehicle });
};

export async function addPartnerVehicle(vehicle: Omit<AnyVehicle, 'id'>): Promise<void> {
    const currentUser = getCurrentUser();
    if (!currentUser.isPartner) {
        throw new Error("User is not a partner.");
    }
    if (!db) {
        console.error("Firestore not initialized. Cannot add vehicle.");
        return;
    };
    await addDoc(collection(db, 'vehicles'), { ...vehicle, ownerId: currentUser.email });
};

export async function getVehiclesForPartner(ownerId: string): Promise<AnyVehicle[]> {
    if (!db) {
        console.warn("Firestore is not initialized. Cannot get vehicles for partner.");
        return [];
    }
    const vehiclesRef = collection(db, 'vehicles');
    const q = query(vehiclesRef, where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AnyVehicle));
}


export async function findOwnerOfVehicle(vehicleId: string): Promise<User | undefined> {
    if (!db) {
        console.warn("Firestore not initialized. Cannot find owner.");
        return undefined;
    };
    const vehicle = await findVehicleById(vehicleId);
    if (!vehicle) return undefined;

    const userRef = doc(db, "users", vehicle.ownerId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const user = userSnap.data() as DB.User;
        return {
            ...user,
            memberSince: user.memberSince.toDate(),
        } as User;
    }
    return undefined;
};


export async function createReservation(reservation: Omit<Reservation, 'id'>) {
    if (!db) {
        console.error("Firestore not initialized. Cannot create reservation.");
        throw new Error("Database not available.");
    };
    const docRef = await addDoc(collection(db, "reservations"), reservation);
    return docRef.id;
}


export async function cancelReservation(reservationId: string, vehicleId: string) {
    if (!db) {
        console.error("Firestore not initialized. Cannot cancel reservation.");
        return;
    };

    // In a real app, you would probably just mark the reservation as "cancelled"
    // and handle the vehicle status update in a more robust way (e.g., cloud function).
    // For simplicity, we delete the reservation and update the vehicle status directly.
    
    const reservationRef = doc(db, 'reservations', reservationId);
    await deleteDoc(reservationRef);
    
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, {
        status: 'Available',
        renter: null
    });
}
