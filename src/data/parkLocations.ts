import type { ParkLocation } from '../types';
import { graphNodes } from './navigationGraph';

// Primary Destinations (POIs shown in dropdowns and facility cards)
export const parkLocations: ParkLocation[] = [
  {
    id: 'entrance',
    name: 'Main Entrance',
    shortName: 'Entrance',
    x: 24,
    y: 89,
    color: 'red',
    qrCodeId: 'PARK-ENTRANCE-01',
    image: '/assets/entrance.jpg',
    description: 'Welcome gate, arrival plaza, EV shuttles, and visitor help desk.'
  },
  {
    id: 'reception',
    name: 'Welcome Reception',
    shortName: 'Reception',
    x: 34,
    y: 72,
    color: 'green',
    qrCodeId: 'PARK-RECEPTION-02',
    image: '/assets/reception.jpg',
    description: 'Front desk check-in, concierge lounge, and luggage service.'
  },
  {
    id: 'restaurant',
    name: 'Restaurant Pavilion',
    shortName: 'Restaurant',
    x: 49,
    y: 27,
    color: 'green',
    qrCodeId: 'PARK-RESTAURANT-04',
    facilityId: 'restaurant',
    image: '/assets/restaurant_exterior.jpg',
    description: 'Central dining pavilion with fine dining, open kitchen & terrace.'
  },
  {
    id: 'pool',
    name: 'Swimming Pool',
    shortName: 'Pool',
    x: 67,
    y: 49,
    color: 'blue',
    qrCodeId: 'PARK-POOL-05',
    facilityId: 'pool',
    image: '/assets/pool.jpg',
    description: 'Resort pool deck with loungers, cabanas, and towel station.'
  },
  {
    id: 'cottages',
    name: 'Forest Cottages',
    shortName: 'Cottages',
    x: 32,
    y: 25,
    color: 'green',
    qrCodeId: 'PARK-COTTAGES-03',
    facilityId: 'cottages',
    image: '/assets/cottage_exterior.jpg',
    description: 'Luxury forest cottages and private wooden rooms nestled in greenery.'
  },
  {
    id: 'spa',
    name: 'Lotus Spa Sanctuary',
    shortName: 'Lotus Spa',
    x: 55,
    y: 60,
    color: 'green',
    qrCodeId: 'PARK-SPA-06',
    facilityId: 'spa',
    image: '/assets/spa.jpg',
    description: 'Aromatherapy treatment rooms, sauna, and wellness massage suites.'
  },
  {
    id: 'garden',
    name: 'Botanical Garden',
    shortName: 'Garden',
    x: 78,
    y: 65,
    color: 'green',
    qrCodeId: 'PARK-GARDEN-07',
    facilityId: 'garden',
    image: '/assets/garden.jpg',
    description: 'Botanical garden, romantic gazebo, and manicured walking lawns.'
  },
  {
    id: 'adventure',
    name: 'Canopy Adventure Zone',
    shortName: 'Adventure',
    x: 84,
    y: 86,
    color: 'green',
    qrCodeId: 'PARK-ADVENTURE-08',
    facilityId: 'adventure',
    image: '/assets/adventure.jpg',
    description: 'Tree-top ropes course, climbing towers, and family adventure playground.'
  }
];

// All nodes (POIs + Junctions with QR checkpoints)
export const allParkNodes: ParkLocation[] = Object.values(graphNodes).map((gn) => ({
  id: gn.id,
  name: gn.name,
  shortName: gn.shortName,
  x: gn.x,
  y: gn.y,
  color: gn.color,
  qrCodeId: gn.qrCodeId,
  image: gn.image,
  description: gn.description,
  isJunction: gn.isJunction,
  facilityId: gn.facilityId
}));
