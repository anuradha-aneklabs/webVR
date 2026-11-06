export interface WalkWaypoint {
  x: number; // percentage (0 - 100) on the screen/image
  y: number; // percentage (0 - 100) on the screen/image
  scale?: number; // 0.3 - 1.2 perspective scale
  facing?: 'away' | 'left' | 'right' | 'towards';
}

export interface Hotspot {
  id: string;
  targetLocationId: string;
  targetSubId?: string;
  label: string;
  actionText: string;
  x: number; // percentage (0 - 100) on the screen/image
  y: number; // percentage (0 - 100) on the screen/image
  direction?: 'forward' | 'left' | 'right' | 'back';
  walkWaypoints?: WalkWaypoint[];
}

export interface SubLocation {
  id: string;
  name: string;
  tabLabel: string;
  image: string;
  description: string;
  hotspots: Hotspot[];
}

export interface ExploreLocation {
  id: string;
  name: string;
  badge: string;
  category: 'welcome' | 'dining' | 'wellness' | 'stay' | 'nature' | 'adventure';
  defaultImage: string;
  description: string;
  longDescription: string;
  subLocations?: SubLocation[];
  hotspots: Hotspot[];
  mapCoords: { x: number; y: number }; // percentage on park map
}

export const exploreLocations: ExploreLocation[] = [
  {
    id: 'entrance',
    name: 'Main Entrance & Arrival Gate',
    badge: 'Resort Arrival',
    category: 'welcome',
    defaultImage: '/assets/entrance.jpg',
    description: 'The monumental natural stone pillars and cedar timber archway welcoming guests into ParkVerse.',
    longDescription: 'Featuring warm lantern lighting at golden hour dusk, stone foundations, an engraved ParkVerse sign, and a paved driveway framed by lush tropical palm trees and dense forest.',
    mapCoords: { x: 24, y: 89 },
    hotspots: [
      {
        id: 'h-ent-rec',
        targetLocationId: 'reception',
        label: 'Welcome Reception & Lounge',
        actionText: 'Proceed forward through arrival portal to Reception',
        x: 50,
        y: 65,
        direction: 'forward',
        walkWaypoints: [
          { x: 50, y: 92, scale: 1.0, facing: 'away' },
          { x: 50, y: 82, scale: 0.85, facing: 'away' },
          { x: 50, y: 72, scale: 0.70, facing: 'away' },
          { x: 50, y: 64, scale: 0.55, facing: 'away' },
          { x: 50, y: 56, scale: 0.42, facing: 'away' }
        ]
      },
      {
        id: 'h-ent-cot',
        targetLocationId: 'cottages',
        label: 'Forest Chalets Walkway',
        actionText: 'Follow left stone path to Forest Cottages',
        x: 20,
        y: 72,
        direction: 'left',
        walkWaypoints: [
          { x: 48, y: 90, scale: 1.0, facing: 'left' },
          { x: 38, y: 82, scale: 0.82, facing: 'left' },
          { x: 28, y: 76, scale: 0.68, facing: 'left' },
          { x: 20, y: 72, scale: 0.55, facing: 'left' }
        ]
      }
    ]
  },
  {
    id: 'reception',
    name: 'Welcome Reception & Concierge',
    badge: 'Front Desk & Lounge',
    category: 'welcome',
    defaultImage: '/assets/reception.jpg',
    description: 'High vaulted timber ceilings, warm ambient cove lighting, and solid wood & granite check-in counter.',
    longDescription: 'Step into the tranquil arrival sanctuary with plush neutral lounge seating, hand-carved coffee tables, and floor-to-ceiling glass windows framing the lush green forest canopy.',
    mapCoords: { x: 34, y: 72 },
    hotspots: [
      {
        id: 'h-rec-res',
        targetLocationId: 'restaurant_exterior',
        label: 'The Forest Pavilion Restaurant',
        actionText: 'Walk out garden doors to Restaurant Pavilion',
        x: 70,
        y: 60,
        direction: 'right',
        walkWaypoints: [
          { x: 48, y: 88, scale: 1.0, facing: 'right' },
          { x: 56, y: 78, scale: 0.82, facing: 'right' },
          { x: 64, y: 68, scale: 0.68, facing: 'right' },
          { x: 70, y: 60, scale: 0.52, facing: 'away' }
        ]
      },
      {
        id: 'h-rec-pool',
        targetLocationId: 'pool',
        label: 'Crystal Swimming Pool',
        actionText: 'Follow terrace corridor to the Swimming Pool',
        x: 30,
        y: 62,
        direction: 'left',
        walkWaypoints: [
          { x: 48, y: 88, scale: 1.0, facing: 'left' },
          { x: 40, y: 78, scale: 0.82, facing: 'left' },
          { x: 34, y: 70, scale: 0.68, facing: 'left' },
          { x: 30, y: 62, scale: 0.55, facing: 'away' }
        ]
      },
      {
        id: 'h-rec-ent',
        targetLocationId: 'entrance',
        label: 'Main Entrance Gate',
        actionText: 'Return to Main Arrival Gate',
        x: 12,
        y: 75,
        direction: 'back',
        walkWaypoints: [
          { x: 40, y: 86, scale: 0.95, facing: 'left' },
          { x: 26, y: 80, scale: 0.82, facing: 'left' },
          { x: 14, y: 75, scale: 0.70, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'restaurant_exterior',
    name: 'The Forest Pavilion — Exterior Deck',
    badge: 'Dining Pavilion',
    category: 'dining',
    defaultImage: '/assets/restaurant_exterior.jpg',
    description: 'Contemporary cedar timber and steel pavilion architecture surrounded by tropical rainforest canopy.',
    longDescription: 'Features an open-air wooden arrival deck illuminated by ambient warm ground lanterns, floor-to-ceiling glass walls showcasing interior dining tables, and forest breezes.',
    mapCoords: { x: 49, y: 27 },
    hotspots: [
      {
        id: 'h-rext-din',
        targetLocationId: 'restaurant_dining',
        targetSubId: 'foyer',
        label: 'Wine Foyer & Host Entrance',
        actionText: 'Step inside through the glass entrance doors',
        x: 50,
        y: 56,
        direction: 'forward',
        walkWaypoints: [
          { x: 50, y: 90, scale: 1.0, facing: 'away' },
          { x: 50, y: 78, scale: 0.80, facing: 'away' },
          { x: 50, y: 66, scale: 0.64, facing: 'away' },
          { x: 50, y: 56, scale: 0.48, facing: 'away' }
        ]
      },
      {
        id: 'h-rext-pool',
        targetLocationId: 'pool',
        label: 'Swimming Pool Deck',
        actionText: 'Follow wooden walkway to the Pool',
        x: 84,
        y: 68,
        direction: 'right',
        walkWaypoints: [
          { x: 52, y: 88, scale: 1.0, facing: 'right' },
          { x: 66, y: 80, scale: 0.82, facing: 'right' },
          { x: 76, y: 74, scale: 0.68, facing: 'right' },
          { x: 84, y: 68, scale: 0.55, facing: 'away' }
        ]
      },
      {
        id: 'h-rext-rec',
        targetLocationId: 'reception',
        label: 'Welcome Reception',
        actionText: 'Return to Welcome Reception Lounge',
        x: 15,
        y: 72,
        direction: 'back',
        walkWaypoints: [
          { x: 46, y: 88, scale: 1.0, facing: 'left' },
          { x: 30, y: 80, scale: 0.82, facing: 'left' },
          { x: 15, y: 72, scale: 0.65, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'restaurant_dining',
    name: 'The Forest Pavilion — Grand Dining Hall',
    badge: 'Fine Dining & Kitchen',
    category: 'dining',
    defaultImage: '/assets/restaurant_dining.jpg',
    description: 'Vaulted dark cedar timber ceilings, hanging glass globe chandeliers, and white linen tables.',
    longDescription: 'Experience multi-sensory dining with views of illuminated evening gardens through panoramic glass walls. Explore the main dining room, the executive open kitchen, or the candlelit outdoor terrace.',
    mapCoords: { x: 50, y: 28 },
    subLocations: [
      {
        id: 'foyer',
        name: 'Host Reception & Wine Foyer',
        tabLabel: 'Wine Foyer',
        image: '/assets/restaurant_entrance.jpg',
        description: 'Wooden concierge greeting stand, sommelier wine wall display, and polished dark hardwood floors.',
        hotspots: [
          {
            id: 'h-foy-din',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'dining',
            label: 'Enter Grand Dining Hall',
            actionText: 'Step through arched doorway into dining room',
            x: 52,
            y: 56,
            direction: 'forward',
            walkWaypoints: [
              { x: 50, y: 90, scale: 1.0, facing: 'away' },
              { x: 51, y: 75, scale: 0.78, facing: 'away' },
              { x: 52, y: 56, scale: 0.52, facing: 'away' }
            ]
          },
          {
            id: 'h-foy-rext',
            targetLocationId: 'restaurant_exterior',
            label: 'Return to Exterior Deck',
            actionText: 'Walk back out to arrival deck',
            x: 16,
            y: 72,
            direction: 'back',
            walkWaypoints: [
              { x: 45, y: 88, scale: 0.95, facing: 'left' },
              { x: 30, y: 80, scale: 0.82, facing: 'left' },
              { x: 16, y: 72, scale: 0.68, facing: 'towards' }
            ]
          }
        ]
      },
      {
        id: 'dining',
        name: 'Grand Dining Room',
        tabLabel: 'Dining Room',
        image: '/assets/restaurant_dining.jpg',
        description: 'Vaulted cedar timber ceilings, warm chandelier illumination, white linen tablecloths, and garden views.',
        hotspots: [
          {
            id: 'h-din-kit',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'kitchen',
            label: 'Executive Open Kitchen',
            actionText: 'Inspect live cooking pass and hearth',
            x: 78,
            y: 56,
            direction: 'right',
            walkWaypoints: [
              { x: 48, y: 88, scale: 1.0, facing: 'right' },
              { x: 60, y: 76, scale: 0.80, facing: 'right' },
              { x: 72, y: 66, scale: 0.65, facing: 'right' },
              { x: 78, y: 56, scale: 0.50, facing: 'away' }
            ]
          },
          {
            id: 'h-din-out',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'outdoor',
            label: 'Candlelit Garden Terrace',
            actionText: 'Step out onto outdoor dining patio',
            x: 26,
            y: 58,
            direction: 'left',
            walkWaypoints: [
              { x: 48, y: 88, scale: 1.0, facing: 'left' },
              { x: 38, y: 76, scale: 0.80, facing: 'left' },
              { x: 30, y: 66, scale: 0.65, facing: 'left' },
              { x: 26, y: 58, scale: 0.52, facing: 'away' }
            ]
          },
          {
            id: 'h-din-foy',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'foyer',
            label: 'Return to Wine Foyer',
            actionText: 'Walk back to host greeting foyer',
            x: 12,
            y: 74,
            direction: 'back',
            walkWaypoints: [
              { x: 40, y: 88, scale: 0.95, facing: 'left' },
              { x: 24, y: 80, scale: 0.80, facing: 'towards' },
              { x: 12, y: 74, scale: 0.65, facing: 'towards' }
            ]
          },
          {
            id: 'h-din-pool',
            targetLocationId: 'pool',
            label: 'Exit to Swimming Pool',
            actionText: 'Walk out toward swimming pool deck',
            x: 88,
            y: 66,
            direction: 'forward',
            walkWaypoints: [
              { x: 50, y: 88, scale: 1.0, facing: 'right' },
              { x: 68, y: 78, scale: 0.80, facing: 'right' },
              { x: 80, y: 72, scale: 0.66, facing: 'right' },
              { x: 88, y: 66, scale: 0.52, facing: 'away' }
            ]
          }
        ]
      },
      {
        id: 'kitchen',
        name: 'Executive Open Kitchen',
        tabLabel: 'Open Kitchen',
        image: '/assets/restaurant_kitchen.jpg',
        description: 'Artisanal culinary station with professional chefs preparing farm-to-table dishes over wood-fired hearths.',
        hotspots: [
          {
            id: 'h-kit-din',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'dining',
            label: 'Return to Dining Hall',
            actionText: 'Step back into main dining room',
            x: 24,
            y: 65,
            direction: 'left',
            walkWaypoints: [
              { x: 50, y: 88, scale: 0.95, facing: 'left' },
              { x: 36, y: 78, scale: 0.80, facing: 'left' },
              { x: 24, y: 65, scale: 0.65, facing: 'towards' }
            ]
          },
          {
            id: 'h-kit-out',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'outdoor',
            label: 'Outdoor Garden Terrace',
            actionText: 'Walk to al-fresco terrace',
            x: 78,
            y: 62,
            direction: 'right',
            walkWaypoints: [
              { x: 52, y: 88, scale: 1.0, facing: 'right' },
              { x: 66, y: 76, scale: 0.80, facing: 'right' },
              { x: 78, y: 62, scale: 0.55, facing: 'away' }
            ]
          }
        ]
      },
      {
        id: 'outdoor',
        name: 'Candlelit Garden Terrace',
        tabLabel: 'Outdoor Terrace',
        image: '/assets/restaurant_outdoor.jpg',
        description: 'Elevated wooden deck with linen tables, candle glow, and romantic string lights beneath tropical palm branches.',
        hotspots: [
          {
            id: 'h-out-din',
            targetLocationId: 'restaurant_dining',
            targetSubId: 'dining',
            label: 'Return Indoors',
            actionText: 'Step back into main dining room',
            x: 48,
            y: 52,
            direction: 'forward',
            walkWaypoints: [
              { x: 48, y: 88, scale: 1.0, facing: 'away' },
              { x: 48, y: 72, scale: 0.75, facing: 'away' },
              { x: 48, y: 52, scale: 0.52, facing: 'away' }
            ]
          },
          {
            id: 'h-out-pool',
            targetLocationId: 'pool',
            label: 'Swimming Pool Deck',
            actionText: 'Walk down garden path to the Pool',
            x: 82,
            y: 70,
            direction: 'right',
            walkWaypoints: [
              { x: 50, y: 88, scale: 1.0, facing: 'right' },
              { x: 66, y: 80, scale: 0.82, facing: 'right' },
              { x: 82, y: 70, scale: 0.60, facing: 'away' }
            ]
          },
          {
            id: 'h-out-rext',
            targetLocationId: 'restaurant_exterior',
            label: 'Return to Arrival Deck',
            actionText: 'Walk back to main pavilion exterior',
            x: 16,
            y: 72,
            direction: 'back',
            walkWaypoints: [
              { x: 45, y: 88, scale: 0.95, facing: 'left' },
              { x: 30, y: 80, scale: 0.80, facing: 'left' },
              { x: 16, y: 72, scale: 0.65, facing: 'towards' }
            ]
          }
        ]
      }
    ],
    hotspots: [
      {
        id: 'h-din-pool-main',
        targetLocationId: 'pool',
        label: 'Swimming Pool Deck',
        actionText: 'Exit to Swimming Pool deck',
        x: 88,
        y: 66,
        direction: 'forward',
        walkWaypoints: [
          { x: 50, y: 88, scale: 1.0, facing: 'right' },
          { x: 68, y: 78, scale: 0.80, facing: 'right' },
          { x: 80, y: 72, scale: 0.66, facing: 'right' },
          { x: 88, y: 66, scale: 0.52, facing: 'away' }
        ]
      },
      {
        id: 'h-din-rext',
        targetLocationId: 'restaurant_exterior',
        label: 'Restaurant Exterior',
        actionText: 'Return to Exterior Arrival Deck',
        x: 12,
        y: 72,
        direction: 'back',
        walkWaypoints: [
          { x: 42, y: 88, scale: 0.95, facing: 'left' },
          { x: 24, y: 80, scale: 0.80, facing: 'left' },
          { x: 12, y: 72, scale: 0.65, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'pool',
    name: 'Crystal Swimming Pool',
    badge: 'Aquatic Relaxation',
    category: 'wellness',
    defaultImage: '/assets/pool.jpg',
    description: 'Turquoise lagoon pool with ambient submerged lights, wooden sun loungers, and private poolside cabanas.',
    longDescription: 'Crystal clear freshwater pool framed by majestic tropical palm trees reflecting in the calm waters at twilight, with deep blue and warm evening skies above.',
    mapCoords: { x: 67, y: 49 },
    hotspots: [
      {
        id: 'h-pool-cot',
        targetLocationId: 'cottages',
        label: 'Forest Cottages & Chalets',
        actionText: 'Take left stone pathway to Forest Cottages',
        x: 24,
        y: 60,
        direction: 'left',
        walkWaypoints: [
          { x: 28, y: 86, scale: 0.95, facing: 'left' },
          { x: 26, y: 76, scale: 0.80, facing: 'left' },
          { x: 24, y: 66, scale: 0.65, facing: 'left' },
          { x: 24, y: 60, scale: 0.52, facing: 'away' }
        ]
      },
      {
        id: 'h-pool-spa',
        targetLocationId: 'spa',
        label: 'The Lotus Spa & Wellness',
        actionText: 'Follow palm-lined path to the Spa',
        x: 78,
        y: 58,
        direction: 'right',
        walkWaypoints: [
          { x: 66, y: 84, scale: 0.95, facing: 'right' },
          { x: 70, y: 74, scale: 0.80, facing: 'right' },
          { x: 74, y: 66, scale: 0.66, facing: 'right' },
          { x: 78, y: 58, scale: 0.52, facing: 'away' }
        ]
      },
      {
        id: 'h-pool-res',
        targetLocationId: 'restaurant_exterior',
        label: 'Restaurant Pavilion',
        actionText: 'Return to Restaurant Pavilion',
        x: 50,
        y: 45,
        direction: 'back',
        walkWaypoints: [
          { x: 64, y: 80, scale: 0.90, facing: 'away' },
          { x: 58, y: 62, scale: 0.70, facing: 'away' },
          { x: 50, y: 45, scale: 0.45, facing: 'away' }
        ]
      }
    ]
  },
  {
    id: 'cottages',
    name: 'Forest Cottages & Chalets',
    badge: 'Eco-Luxury Living',
    category: 'stay',
    defaultImage: '/assets/cottage_exterior.jpg',
    description: 'Modern cedar timber and stone forest cottage villa with elevated porch and private balcony at twilight.',
    longDescription: 'Designed with sustainable natural materials and nestled amidst towering pine trees and mossy ferns. Explore both the private chalet exterior and the luxurious bedroom suite interior.',
    mapCoords: { x: 32, y: 25 },
    subLocations: [
      {
        id: 'exterior',
        name: 'Chalet Exterior & Forest Walk',
        tabLabel: 'Chalet Exterior',
        image: '/assets/cottage_exterior.jpg',
        description: 'Elevated wooden deck with lounge chairs, warm lantern lights, and a stone walkway winding through ferns.',
        hotspots: [
          {
            id: 'h-cot-step-in',
            targetLocationId: 'cottages',
            targetSubId: 'interior',
            label: 'Bedroom Suite Interior',
            actionText: 'Step inside the bedroom suite',
            x: 52,
            y: 58,
            direction: 'forward',
            walkWaypoints: [
              { x: 50, y: 90, scale: 1.0, facing: 'away' },
              { x: 51, y: 76, scale: 0.80, facing: 'away' },
              { x: 52, y: 68, scale: 0.66, facing: 'away' },
              { x: 52, y: 58, scale: 0.52, facing: 'away' }
            ]
          },
          {
            id: 'h-cot-gar',
            targetLocationId: 'garden',
            label: 'Botanical Garden',
            actionText: 'Stroll along stone path to Botanical Garden',
            x: 84,
            y: 68,
            direction: 'right',
            walkWaypoints: [
              { x: 50, y: 88, scale: 1.0, facing: 'right' },
              { x: 64, y: 80, scale: 0.82, facing: 'right' },
              { x: 76, y: 74, scale: 0.68, facing: 'right' },
              { x: 84, y: 68, scale: 0.55, facing: 'away' }
            ]
          }
        ]
      },
      {
        id: 'interior',
        name: 'Cottage Bedroom Suite',
        tabLabel: 'Bedroom Suite',
        image: '/assets/cottage_interior.jpg',
        description: 'Vaulted cedar wood ceiling, plush king-size platform bed with white linens, and private balcony doors.',
        hotspots: [
          {
            id: 'h-cot-step-out',
            targetLocationId: 'cottages',
            targetSubId: 'exterior',
            label: 'Step Outside to Veranda',
            actionText: 'Walk out to private forest porch',
            x: 35,
            y: 68,
            direction: 'left',
            walkWaypoints: [
              { x: 50, y: 86, scale: 0.95, facing: 'left' },
              { x: 42, y: 78, scale: 0.80, facing: 'left' },
              { x: 35, y: 68, scale: 0.60, facing: 'away' }
            ]
          }
        ]
      }
    ],
    hotspots: [
      {
        id: 'h-cot-gar-main',
        targetLocationId: 'garden',
        label: 'Botanical Garden',
        actionText: 'Stroll along stone path to Botanical Garden',
        x: 84,
        y: 68,
        direction: 'right',
        walkWaypoints: [
          { x: 50, y: 88, scale: 1.0, facing: 'right' },
          { x: 64, y: 80, scale: 0.82, facing: 'right' },
          { x: 76, y: 74, scale: 0.68, facing: 'right' },
          { x: 84, y: 68, scale: 0.55, facing: 'away' }
        ]
      },
      {
        id: 'h-cot-pool',
        targetLocationId: 'pool',
        label: 'Swimming Pool',
        actionText: 'Head back to the Swimming Pool',
        x: 18,
        y: 72,
        direction: 'back',
        walkWaypoints: [
          { x: 44, y: 88, scale: 0.95, facing: 'left' },
          { x: 30, y: 80, scale: 0.80, facing: 'left' },
          { x: 18, y: 72, scale: 0.65, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'garden',
    name: 'Botanical Garden & Gazebo',
    badge: 'Floral Sanctuary',
    category: 'nature',
    defaultImage: '/assets/garden.jpg',
    description: 'Ornate carved wooden gazebo pavilion, manicured green lawns, and winding cobblestone path.',
    longDescription: 'Immerse yourself in vibrant tropical flowerbeds, blooming orchids, and bird of paradise flowers framed by majestic palm trees and lush bamboo at golden hour.',
    mapCoords: { x: 78, y: 65 },
    hotspots: [
      {
        id: 'h-gar-adv',
        targetLocationId: 'adventure',
        label: 'Canopy Adventure Zone',
        actionText: 'Hike cobblestone path to Adventure Zone',
        x: 76,
        y: 56,
        direction: 'forward',
        walkWaypoints: [
          { x: 48, y: 90, scale: 1.0, facing: 'right' },
          { x: 58, y: 78, scale: 0.80, facing: 'right' },
          { x: 68, y: 66, scale: 0.65, facing: 'away' },
          { x: 76, y: 56, scale: 0.50, facing: 'away' }
        ]
      },
      {
        id: 'h-gar-pool',
        targetLocationId: 'pool',
        label: 'Swimming Pool',
        actionText: 'Follow side path toward the Pool',
        x: 22,
        y: 62,
        direction: 'left',
        walkWaypoints: [
          { x: 46, y: 88, scale: 1.0, facing: 'left' },
          { x: 34, y: 76, scale: 0.80, facing: 'left' },
          { x: 22, y: 62, scale: 0.55, facing: 'away' }
        ]
      },
      {
        id: 'h-gar-cot',
        targetLocationId: 'cottages',
        label: 'Forest Cottages & Chalets',
        actionText: 'Stroll back along stone path to Cottages',
        x: 15,
        y: 72,
        direction: 'back',
        walkWaypoints: [
          { x: 44, y: 88, scale: 0.95, facing: 'left' },
          { x: 28, y: 80, scale: 0.80, facing: 'left' },
          { x: 15, y: 72, scale: 0.65, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'adventure',
    name: 'Canopy Adventure Zone',
    badge: 'Forest Obstacles',
    category: 'adventure',
    defaultImage: '/assets/adventure.jpg',
    description: 'High-altitude wooden obstacle platforms, rope suspension bridges, and climbing nets in tall trees.',
    longDescription: 'Experience thrilling aerial crossings safely engineered within towering pine and oak canopies with golden sunlight filtering through dense green leaves.',
    mapCoords: { x: 84, y: 86 },
    hotspots: [
      {
        id: 'h-adv-spa',
        targetLocationId: 'spa',
        label: 'The Lotus Spa & Wellness',
        actionText: 'Follow descending trail to the Spa',
        x: 62,
        y: 68,
        direction: 'right',
        walkWaypoints: [
          { x: 50, y: 90, scale: 1.0, facing: 'right' },
          { x: 56, y: 80, scale: 0.80, facing: 'right' },
          { x: 62, y: 68, scale: 0.60, facing: 'away' }
        ]
      },
      {
        id: 'h-adv-gar',
        targetLocationId: 'garden',
        label: 'Botanical Garden',
        actionText: 'Return to Botanical Garden Gazebo',
        x: 20,
        y: 68,
        direction: 'back',
        walkWaypoints: [
          { x: 46, y: 88, scale: 0.95, facing: 'left' },
          { x: 32, y: 78, scale: 0.80, facing: 'left' },
          { x: 20, y: 68, scale: 0.65, facing: 'towards' }
        ]
      }
    ]
  },
  {
    id: 'spa',
    name: 'The Lotus Spa Sanctuary',
    badge: 'Wellness & Rejuvenation',
    category: 'wellness',
    defaultImage: '/assets/spa.jpg',
    description: 'Natural teak massage table with pristine white linens, warm candlelight, and exotic orchid accents.',
    longDescription: 'A serene wellness haven featuring stone aromatherapy oil burners, warm amber wall sconces, teak wood paneling, and a large floor-to-ceiling window overlooking misty green ferns.',
    mapCoords: { x: 55, y: 60 },
    hotspots: [
      {
        id: 'h-spa-pool',
        targetLocationId: 'pool',
        label: 'Swimming Pool Deck',
        actionText: 'Stroll garden door to Swimming Pool',
        x: 76,
        y: 60,
        direction: 'right',
        walkWaypoints: [
          { x: 50, y: 88, scale: 1.0, facing: 'right' },
          { x: 64, y: 76, scale: 0.80, facing: 'right' },
          { x: 76, y: 60, scale: 0.55, facing: 'away' }
        ]
      },
      {
        id: 'h-spa-rec',
        targetLocationId: 'reception',
        label: 'Welcome Reception Lounge',
        actionText: 'Follow covered walkway to Reception',
        x: 24,
        y: 66,
        direction: 'left',
        walkWaypoints: [
          { x: 48, y: 88, scale: 1.0, facing: 'left' },
          { x: 36, y: 78, scale: 0.80, facing: 'left' },
          { x: 24, y: 66, scale: 0.60, facing: 'away' }
        ]
      },
      {
        id: 'h-spa-adv',
        targetLocationId: 'adventure',
        label: 'Canopy Adventure Zone',
        actionText: 'Ascend forest trail to Adventure Zone',
        x: 84,
        y: 54,
        direction: 'forward',
        walkWaypoints: [
          { x: 50, y: 88, scale: 1.0, facing: 'right' },
          { x: 68, y: 72, scale: 0.75, facing: 'right' },
          { x: 84, y: 54, scale: 0.50, facing: 'away' }
        ]
      }
    ]
  }
];
