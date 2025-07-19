import type { Car, Reservation, Bus, User, PartnerStats, PartnerVehicle, Truck, BusReservation, CarReservationWithDetails, BusReservationWithDetails } from './types';

export const cars: Car[] = [
  {
    id: 1,
    name: 'Maruti Suzuki Swift',
    type: 'Sedan',
    pricePerDay: 2500,
    seats: 5,
    luggage: 2,
    transmission: 'Automatic',
    mpg: 22, // kmpl
    location: 'Mumbai, MH',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A reliable and fuel-efficient hatchback, perfect for city driving and small families.',
    features: ['Bluetooth', 'Backup Camera', 'Apple CarPlay'],
  },
  {
    id: 2,
    name: 'Tata Nexon',
    type: 'SUV',
    pricePerDay: 4500,
    seats: 5,
    luggage: 4,
    transmission: 'Automatic',
    mpg: 17, // kmpl
    location: 'Delhi, DL',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A stylish and safe compact SUV, ready for any adventure, from mountain roads to city streets.',
    features: ['All-Wheel Drive', 'Sunroof', 'Touchscreen Infotainment'],
  },
  {
    id: 3,
    name: 'Toyota Innova Crysta',
    type: 'Minivan',
    pricePerDay: 5500,
    seats: 7,
    luggage: 6,
    transmission: 'Automatic',
    mpg: 12, // kmpl
    location: 'Bengaluru, KA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'The ultimate family vehicle with ample space for passengers and luggage. Perfect for long road trips.',
    features: ['Rear Entertainment System', 'Captain Seats', 'Power Sliding Doors'],
  },
  {
    id: 4,
    name: 'Mahindra Thar',
    type: 'Convertible',
    pricePerDay: 6000,
    seats: 4,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 15, // kmpl
    location: 'Goa, GA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'Experience true freedom with this iconic off-roader. Ideal for scenic drives and exploring rough terrains.',
    features: ['4x4 Capability', 'Removable Roof', 'Touchscreen with Adventure Stats'],
  },
  {
    id: 5,
    name: 'Hyundai i20 N Line',
    type: 'Coupe',
    pricePerDay: 5000,
    seats: 5,
    luggage: 2,
    transmission: 'Automatic',
    mpg: 20, // kmpl
    location: 'Pune, MH',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A sporty and agile hatchback that makes navigating city traffic a breeze. Perfect for enthusiasts.',
    features: ['Sport Mode', 'Leather Seats', 'Navigation System'],
  },
  {
    id: 6,
    name: 'Maruti Suzuki Alto',
    type: 'Sedan',
    pricePerDay: 2000,
    seats: 4,
    luggage: 1,
    transmission: 'Manual',
    mpg: 25, // kmpl
    location: 'Chennai, TN',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'An affordable and efficient choice for budget-conscious travelers. Great fuel economy.',
    features: ['Aux Input', 'Air Conditioning'],
  },
  {
    id: 7,
    name: 'Kia Seltos',
    type: 'SUV',
    pricePerDay: 4800,
    seats: 5,
    luggage: 5,
    transmission: 'Automatic',
    mpg: 16, // kmpl
    location: 'Hyderabad, TS',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A feature-packed SUV with a premium interior. Perfect for both city and highway driving.',
    features: ['Ventilated Seats', 'Bose Sound System', 'Android Auto'],
  },
  {
    id: 8,
    name: 'Skoda Superb',
    type: 'Sedan',
    pricePerDay: 7500,
    seats: 5,
    luggage: 3,
    transmission: 'Automatic',
    mpg: 15, // kmpl
    location: 'Mumbai, MH',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'Travel in style and comfort with this premium luxury sedan. Top-of-the-line features and a smooth ride.',
    features: ['Panoramic Sunroof', 'Virtual Cockpit', 'Advanced Safety Suite'],
  },
  {
    id: 9,
    name: 'Royal Enfield Classic 350',
    type: 'Bike',
    pricePerDay: 1500,
    seats: 2,
    luggage: 0,
    transmission: 'Manual',
    mpg: 40, // kmpl
    location: 'Goa, GA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A classic cruiser for exploring scenic routes and coastal roads. Timeless design and a thumping engine.',
    features: ['Classic Styling', 'Comfortable Riding Posture'],
  },
  {
    id: 10,
    name: 'Ather 450X',
    type: 'Scooter',
    pricePerDay: 1200,
    seats: 2,
    luggage: 1, // Under-seat storage
    transmission: 'Automatic',
    mpg: 110, // km per charge
    location: 'Bengaluru, KA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A smart and stylish electric scooter for zipping through city traffic. Packed with tech features.',
    features: ['Digital Dashboard', 'Fast Charging', 'Reverse Mode'],
  },
  {
    id: 11,
    name: 'Honda Activa 6G',
    type: 'Scooter',
    pricePerDay: 800,
    seats: 2,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 50, // kmpl
    location: 'Delhi, DL',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'India\'s favorite scooter, known for its reliability and ease of use. Perfect for daily commutes.',
    features: ['Silent Start', 'Telescopic Suspension'],
  },
  {
    id: 12,
    name: 'Bajaj Pulsar NS200',
    type: 'Bike',
    pricePerDay: 1800,
    seats: 2,
    luggage: 0,
    transmission: 'Manual',
    mpg: 35, // kmpl
    location: 'Pune, MH',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A powerful and agile street bike for an exhilarating riding experience. Great for city and highway.',
    features: ['Liquid Cooling', 'Perimeter Frame', 'ABS'],
  },
];

export const buses: Bus[] = [
  {
    id: 1,
    name: 'Intercity Express',
    type: 'Seater',
    seats: 45,
    pricePerDay: 15000,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Reading Lights'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Ramesh Kumar', rating: 4.8 },
  },
  {
    id: 2,
    name: 'Luxury Sleeper Coach',
    type: 'Sleeper',
    seats: 30,
    pricePerDay: 22000,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Personal TV', 'Blankets'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Sunita Devi', rating: 4.9 },
  },
  {
    id: 3,
    name: 'Corporate Commuter',
    type: 'MiniBus',
    seats: 20,
    pricePerDay: 12000,
    amenities: ['Air Conditioning', 'Wi-Fi'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Anil Patel', rating: 4.7 },
  },
  {
    id: 4,
    name: 'Bharat Yatra Voyager',
    type: 'Seater',
    seats: 50,
    pricePerDay: 18000,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Restroom', 'Snack Bar'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Priya Sharma', rating: 4.8 },
  },
];

export const trucks: Truck[] = [
    {
        id: 1,
        name: 'Chota Hathi',
        size: 'Mini',
        pricePerDay: 4000,
        payload: '1 Ton',
        description: 'Perfect for small apartment moves and single-item delivery in the city.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'Manoj Singh', rating: 4.7 },
    },
    {
        id: 2,
        name: 'Workhorse Hauler',
        size: 'Medium',
        pricePerDay: 7000,
        payload: '3 Ton',
        description: 'Ideal for 2-3 BHK house shifting and commercial equipment.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'David Dsouza', rating: 4.9 },
    },
    {
        id: 3,
        name: 'Heavy-Duty Freighter',
        size: 'Large',
        pricePerDay: 10000,
        payload: '5 Ton+',
        description: 'The best choice for large house moves and heavy industrial equipment.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'Karthik Reddy', rating: 4.8 },
    },
];

export const carReservations: Reservation[] = [
    {
      id: 1,
      carId: 2,
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-15'),
      totalCost: 22500,
    },
    {
      id: 2,
      carId: 4,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-04'),
      totalCost: 18000,
    },
];

export const busReservations: BusReservation[] = [
  {
    id: 1,
    busId: 2,
    groupName: "Corporate Event",
    contactName: "Priya Singh",
    startDate: new Date('2024-08-20'),
    endDate: new Date('2024-08-22'),
    totalCost: 66000,
  },
];

const user: User = {
  name: "Aarav Sharma",
  email: "aarav.s@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  memberSince: new Date("2022-03-15"),
};

export const partnerStats: PartnerStats = {
  totalRevenue: 850000,
  activeBookings: 5,
  totalVehicles: 8,
  avgRating: 4.9,
};

export const partnerVehicles: PartnerVehicle[] = [
  { id: 1, name: "Hyundai i20", type: 'Coupe', status: 'Available', pricePerDay: 5000 },
  { id: 2, name: "Tata Nexon", type: 'SUV', status: 'Rented', pricePerDay: 4500 },
  { id: 3, name: "Skoda Superb", type: 'Sedan', status: 'Available', pricePerDay: 7500 },
  { id: 4, name: "Kia Seltos", type: 'SUV', status: 'Maintenance', pricePerDay: 4800 },
  { id: 5, name: "Maruti Swift", type: 'Sedan', status: 'Available', pricePerDay: 2500 },
];


export const findCarById = (id: number) => cars.find(car => car.id === id);
export const findBusById = (id: number) => buses.find(bus => bus.id === id);
export const findTruckById = (id: number) => trucks.find(truck => truck.id === id);

export const findCarReservations = (): CarReservationWithDetails[] => {
    return carReservations
        .map(r => {
            const car = findCarById(r.carId);
            return car ? { ...r, car } : null;
        })
        .filter((r): r is CarReservationWithDetails => r !== null);
};

export const findBusReservations = (): BusReservationWithDetails[] => {
    return busReservations
        .map(r => {
            const bus = findBusById(r.busId);
            return bus ? { ...r, bus } : null;
        })
        .filter((r): r is BusReservationWithDetails => r !== null);
};


export function getCurrentUser(): User {
    // In a real app, you'd fetch this from your auth provider or database
    return user;
};
