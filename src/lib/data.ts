import type { Car, Reservation, Bus, User, PartnerStats, PartnerVehicle, Truck } from './types';

export const cars: Car[] = [
  {
    id: 1,
    name: 'Compact Cruiser',
    type: 'Sedan',
    pricePerDay: 45,
    seats: 5,
    luggage: 2,
    transmission: 'Automatic',
    mpg: 32,
    location: 'Los Angeles, CA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A reliable and fuel-efficient sedan, perfect for city driving and small families.',
    features: ['Bluetooth', 'Backup Camera', 'Cruise Control'],
  },
  {
    id: 2,
    name: 'Urban Explorer',
    type: 'SUV',
    pricePerDay: 65,
    seats: 5,
    luggage: 4,
    transmission: 'Automatic',
    mpg: 25,
    location: 'Denver, CO',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'Spacious and versatile, this SUV is ready for any adventure, from mountain roads to city streets.',
    features: ['All-Wheel Drive', 'Sunroof', 'Apple CarPlay'],
  },
  {
    id: 3,
    name: 'Family Voyager',
    type: 'Minivan',
    pricePerDay: 80,
    seats: 7,
    luggage: 6,
    transmission: 'Automatic',
    mpg: 22,
    location: 'Orlando, FL',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'The ultimate family vehicle with ample space for passengers and luggage. Perfect for theme park trips.',
    features: ['Rear Entertainment System', 'Stow-n-Go Seating', 'Power Sliding Doors'],
  },
  {
    id: 4,
    name: 'Coastal Breezer',
    type: 'Convertible',
    pricePerDay: 95,
    seats: 4,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 28,
    location: 'Miami, FL',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'Feel the wind in your hair with this stylish convertible. Ideal for scenic drives along the coast.',
    features: ['Heated Seats', 'Premium Sound System', 'Power Convertible Top'],
  },
  {
    id: 5,
    name: 'City Slicker',
    type: 'Coupe',
    pricePerDay: 75,
    seats: 2,
    luggage: 1,
    transmission: 'Automatic',
    mpg: 29,
    location: 'New York, NY',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A sporty and agile coupe that makes navigating city traffic a breeze. Perfect for couples or solo travelers.',
    features: ['Sport Mode', 'Leather Seats', 'Navigation System'],
  },
  {
    id: 6,
    name: 'Economy Runner',
    type: 'Sedan',
    pricePerDay: 35,
    seats: 5,
    luggage: 2,
    transmission: 'Manual',
    mpg: 35,
    location: 'Chicago, IL',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'An affordable and efficient choice for budget-conscious travelers. Great fuel economy.',
    features: ['Aux Input', 'Air Conditioning'],
  },
  {
    id: 7,
    name: 'Trail Blazer',
    type: 'SUV',
    pricePerDay: 70,
    seats: 5,
    luggage: 5,
    transmission: 'Automatic',
    mpg: 24,
    location: 'Seattle, WA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'A rugged SUV equipped for the great outdoors. Perfect for exploring national parks.',
    features: ['4x4', 'Roof Rack', 'Android Auto'],
  },
  {
    id: 8,
    name: 'Luxury Liner',
    type: 'Sedan',
    pricePerDay: 110,
    seats: 5,
    luggage: 3,
    transmission: 'Automatic',
    mpg: 26,
    location: 'Los Angeles, CA',
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    description: 'Travel in style and comfort with this premium luxury sedan. Top-of-the-line features and a smooth ride.',
    features: ['Panoramic Sunroof', 'Massaging Seats', 'Advanced Safety Suite'],
  },
];

export const buses: Bus[] = [
  {
    id: 1,
    name: 'Intercity Express',
    type: 'Seater',
    seats: 45,
    pricePerDay: 350,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Reading Lights'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'John Doe', rating: 4.8 },
  },
  {
    id: 2,
    name: 'Luxury Sleeper Coach',
    type: 'Sleeper',
    seats: 30,
    pricePerDay: 500,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Personal TV', 'Blankets'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Jane Smith', rating: 4.9 },
  },
  {
    id: 3,
    name: 'Corporate Commuter',
    type: 'MiniBus',
    seats: 20,
    pricePerDay: 250,
    amenities: ['Air Conditioning', 'Wi-Fi'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Peter Jones', rating: 4.7 },
  },
  {
    id: 4,
    name: 'Cross-Country Voyager',
    type: 'Seater',
    seats: 50,
    pricePerDay: 400,
    amenities: ['Air Conditioning', 'Wi-Fi', 'Restroom', 'Snack Bar'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    driver: { name: 'Emily Williams', rating: 4.8 },
  },
];

export const trucks: Truck[] = [
    {
        id: 1,
        name: 'City Mover',
        size: 'Mini',
        pricePerDay: 120,
        payload: '1 Ton',
        description: 'Perfect for small apartment moves and single-item delivery.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'Mike Johnson', rating: 4.7 },
    },
    {
        id: 2,
        name: 'Workhorse Hauler',
        size: 'Medium',
        pricePerDay: 180,
        payload: '3 Ton',
        description: 'Ideal for 2-3 bedroom house shifting and commercial equipment.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'David Chen', rating: 4.9 },
    },
    {
        id: 3,
        name: 'Heavy-Duty Freighter',
        size: 'Large',
        pricePerDay: 250,
        payload: '5 Ton+',
        description: 'The best choice for large house moves and heavy industrial equipment.',
        images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
        driver: { name: 'Carlos Rodriguez', rating: 4.8 },
    },
];

export const reservations: Reservation[] = [
    {
      id: 1,
      carId: 2,
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-15'),
      totalCost: 325,
    },
    {
      id: 2,
      carId: 4,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-04'),
      totalCost: 285,
    },
];

const user: User = {
  name: "Alex Johnson",
  email: "alex.j@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  memberSince: new Date("2022-03-15"),
};

export const partnerStats: PartnerStats = {
  totalRevenue: 12530,
  activeBookings: 5,
  totalVehicles: 8,
  avgRating: 4.9,
};

export const partnerVehicles: PartnerVehicle[] = [
  { id: 1, name: "City Slicker", type: 'Coupe', status: 'Available', pricePerDay: 75 },
  { id: 2, name: "Urban Explorer", type: 'SUV', status: 'Rented', pricePerDay: 65 },
  { id: 3, name: "Luxury Liner", type: 'Sedan', status: 'Available', pricePerDay: 110 },
  { id: 4, name: "Trail Blazer", type: 'SUV', status: 'Maintenance', pricePerDay: 70 },
  { id: 5, name: "Compact Cruiser", type: 'Sedan', status: 'Available', pricePerDay: 45 },
];


export const findCarById = (id: number) => cars.find(car => car.id === id);
export const findBusById = (id: number) => buses.find(bus => bus.id === id);

export const findReservations = () => {
    return reservations.map(r => ({
        ...r,
        car: findCarById(r.carId)!,
    }));
};

export function getCurrentUser(): User {
    // In a real app, you'd fetch this from your auth provider or database
    return user;
};
