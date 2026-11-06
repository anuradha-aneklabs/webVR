import type { Facility } from '../types';

export const facilities: Facility[] = [
  {
    id: 'restaurant',
    title: 'Restaurant',
    subtitle: 'Fine Dining Experience',
    image: '/assets/restaurant_dining.jpg',
    iconName: 'utensils',
    description: 'Immerse yourself in authentic gourmet cuisine with panoramic forest views, ambient wooden architecture, and seasonal farm-to-table delicacies.',
    hours: '07:00 AM – 11:00 PM',
    features: ['Multi-cuisine Dining', 'Outdoor Garden Seating', 'Live Evening Music', 'Cocktail Lounge']
  },
  {
    id: 'pool',
    title: 'Swimming Pool',
    subtitle: 'Relax & Refresh',
    image: '/assets/pool.jpg',
    iconName: 'waves',
    description: 'A sparkling crystal-blue outdoor swimming pool framed by tranquil tropical foliage and sunset poolside cabanas.',
    hours: '06:00 AM – 09:00 PM',
    features: ['Heated Pool Section', 'Poolside Cabanas', 'Kid Pool Area', 'Sun Loungers']
  },
  {
    id: 'cottages',
    title: 'Cottages & Rooms',
    subtitle: 'Stay in Nature',
    image: '/assets/cottage_exterior.jpg',
    iconName: 'bed',
    description: 'Private eco-luxury wooden chalets and suites nestled directly into the lush forest canopy for deep serenity and privacy.',
    hours: '24/7 Concierge',
    features: ['Private Balconies', 'Forest View Suites', 'King Size Comfort', 'Complimentary High-speed Wi-Fi']
  },
  {
    id: 'garden',
    title: 'Garden',
    subtitle: "Nature's Beauty",
    image: '/assets/garden.jpg',
    iconName: 'trees',
    description: 'Manicured botanical landscape with exotic flora, tranquil walking pavilions, and an ornate wooden gazebo for serene contemplation.',
    hours: 'Open all day (Illuminated 6 PM – 10 PM)',
    features: ['Botanical Pathways', 'Ornate Gazebo', 'Butterfly Zone', 'Morning Yoga Lawn']
  },
  {
    id: 'adventure',
    title: 'Adventure Zone',
    subtitle: 'Fun for Everyone',
    image: '/assets/adventure.jpg',
    iconName: 'activity',
    description: 'An exhilarating open-air rope obstacle challenge course, zip line bridges, and interactive nature climbing playground for all ages.',
    hours: '08:30 AM – 06:30 PM',
    features: ['Canopy Rope Course', 'Climbing Playground', 'Safety Trained Instructors', 'Family Adventure Challenges']
  },
  {
    id: 'spa',
    title: 'Spa & Wellness',
    subtitle: 'Rejuvenate Yourself',
    image: '/assets/spa.jpg',
    iconName: 'flower2',
    description: 'Holistic restorative sanctuary offering organic herbal therapies, Ayurvedic rejuvenation, aromatherapy massages, and sound healing.',
    hours: '09:00 AM – 08:00 PM',
    features: ['Ayurvedic Therapies', 'Aromatherapy Treatments', 'Private Steam Suites', 'Organic Herbal Oils']
  }
];
