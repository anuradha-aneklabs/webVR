import type { NavigationStep, RouteData, TurnType } from '../types';

export interface GraphNode {
  id: string;
  name: string;
  shortName: string;
  x: number; // percentage (0 - 100) on map
  y: number; // percentage (0 - 100) on map
  color: 'red' | 'green' | 'blue';
  qrCodeId: string;
  image: string;
  description: string;
  isJunction?: boolean;
  facilityId?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  distanceMeters: number;
  points: [number, number][]; // coordinates from 'from' to 'to'
  surface: string;
  landmark: string;
}

export const graphNodes: Record<string, GraphNode> = {
  // --- 8 Destination POIs with Physical QR Markers ---
  entrance: {
    id: 'entrance',
    name: 'Main Entrance & Arrival Gate',
    shortName: 'Entrance',
    x: 24,
    y: 89,
    color: 'red',
    qrCodeId: 'PARK-ENTRANCE-01',
    image: '/assets/entrance.jpg',
    description: 'Welcome gate, arrival plaza, EV shuttles, and visitor help desk.'
  },
  reception: {
    id: 'reception',
    name: 'Welcome Reception & Concierge',
    shortName: 'Reception',
    x: 34,
    y: 72,
    color: 'green',
    qrCodeId: 'PARK-RECEPTION-02',
    image: '/assets/reception.jpg',
    description: 'Front desk check-in, concierge lounge, and luggage service.'
  },
  cottages: {
    id: 'cottages',
    name: 'Forest Cottages & Chalets',
    shortName: 'Cottages',
    x: 32,
    y: 25,
    color: 'green',
    qrCodeId: 'PARK-COTTAGES-03',
    facilityId: 'cottages',
    image: '/assets/cottage_exterior.jpg',
    description: 'Luxury forest cottages and private wooden rooms nestled in greenery.'
  },
  restaurant: {
    id: 'restaurant',
    name: 'The Forest Pavilion Restaurant',
    shortName: 'Restaurant',
    x: 49,
    y: 27,
    color: 'green',
    qrCodeId: 'PARK-RESTAURANT-04',
    facilityId: 'restaurant',
    image: '/assets/restaurant_exterior.jpg',
    description: 'Central dining pavilion with fine dining, open kitchen & terrace.'
  },
  pool: {
    id: 'pool',
    name: 'Crystal Swimming Pool',
    shortName: 'Pool',
    x: 67,
    y: 49,
    color: 'blue',
    qrCodeId: 'PARK-POOL-05',
    facilityId: 'pool',
    image: '/assets/pool.jpg',
    description: 'Resort pool deck with loungers, cabanas, and towel station.'
  },
  spa: {
    id: 'spa',
    name: 'The Lotus Spa Sanctuary',
    shortName: 'Lotus Spa',
    x: 55,
    y: 60,
    color: 'green',
    qrCodeId: 'PARK-SPA-06',
    facilityId: 'spa',
    image: '/assets/spa.jpg',
    description: 'Aromatherapy treatment rooms, sauna, and wellness massage suites.'
  },
  garden: {
    id: 'garden',
    name: 'Botanical Garden & Gazebo',
    shortName: 'Garden',
    x: 78,
    y: 65,
    color: 'green',
    qrCodeId: 'PARK-GARDEN-07',
    facilityId: 'garden',
    image: '/assets/garden.jpg',
    description: 'Botanical garden, romantic gazebo, and manicured walking lawns.'
  },
  adventure: {
    id: 'adventure',
    name: 'Canopy Adventure Zone',
    shortName: 'Adventure Zone',
    x: 84,
    y: 86,
    color: 'green',
    qrCodeId: 'PARK-ADVENTURE-08',
    facilityId: 'adventure',
    image: '/assets/adventure.jpg',
    description: 'Tree-top ropes course, climbing towers, and family adventure playground.'
  },

  // --- 8 Walkway Junctions with Checkpoint QR Codes for Mid-Route Positioning ---
  jct_arrival: {
    id: 'jct_arrival',
    name: 'Arrival Plaza Junction',
    shortName: 'Arrival Fork',
    x: 28,
    y: 79,
    color: 'green',
    qrCodeId: 'PARK-JCT-ARR',
    image: '/assets/pathway.jpg',
    isJunction: true,
    description: 'Arrival junction connecting Main Entrance, Reception, and South Nature Trail.'
  },
  jct_central: {
    id: 'jct_central',
    name: 'Central Promenade Fork',
    shortName: 'Central Fork',
    x: 42,
    y: 60,
    color: 'green',
    qrCodeId: 'PARK-JCT-CENTRAL',
    image: '/assets/pathway.jpg',
    isJunction: true,
    description: 'Major intersection connecting Reception, Spa, Cottages, and Restaurant.'
  },
  jct_chalet_cross: {
    id: 'jct_chalet_cross',
    name: 'West Chalet Crossroad',
    shortName: 'Chalet Crossroad',
    x: 33,
    y: 42,
    color: 'green',
    qrCodeId: 'PARK-JCT-CHALET',
    image: '/assets/pathway.jpg',
    isJunction: true,
    description: 'Cobblestone junction leading to Forest Cottages and Restaurant West Deck.'
  },
  jct_dining_terrace: {
    id: 'jct_dining_terrace',
    name: 'Restaurant Pavilion Terrace',
    shortName: 'Dining Terrace',
    x: 48,
    y: 38,
    color: 'green',
    qrCodeId: 'PARK-JCT-DINING',
    image: '/assets/restaurant_exterior.jpg',
    isJunction: true,
    description: 'Junction at the base of the Dining Pavilion steps and Pool promenade.'
  },
  jct_pool_promenade: {
    id: 'jct_pool_promenade',
    name: 'Pool Promenade West',
    shortName: 'Pool West Fork',
    x: 58,
    y: 44,
    color: 'green',
    qrCodeId: 'PARK-JCT-POOLW',
    image: '/assets/pool.jpg',
    isJunction: true,
    description: 'Boardwalk intersection linking Restaurant, Pool Deck, and Lotus Spa.'
  },
  jct_pool_garden: {
    id: 'jct_pool_garden',
    name: 'Pool Garden Junction',
    shortName: 'Garden Fork',
    x: 72,
    y: 57,
    color: 'green',
    qrCodeId: 'PARK-JCT-POOLE',
    image: '/assets/garden.jpg',
    isJunction: true,
    description: 'Trail junction connecting the Pool, Spa, and Botanical Garden.'
  },
  jct_adventure_trail: {
    id: 'jct_adventure_trail',
    name: 'South Forest Trailhead',
    shortName: 'Forest Trailhead',
    x: 52,
    y: 82,
    color: 'green',
    qrCodeId: 'PARK-JCT-SOUTH',
    image: '/assets/adventure.jpg',
    isJunction: true,
    description: 'Scenic southern nature trail junction connecting Entrance and Adventure Zone.'
  },
  jct_garden_adventure: {
    id: 'jct_garden_adventure',
    name: 'Garden Canopy Junction',
    shortName: 'Canopy Fork',
    x: 80,
    y: 75,
    color: 'green',
    qrCodeId: 'PARK-JCT-EAST',
    image: '/assets/adventure.jpg',
    isJunction: true,
    description: 'Eastern path fork leading into the Canopy Adventure Zone.'
  }
};

// Graph Edges along real walkable paths shown on park aerial map
export const rawEdges: Omit<GraphEdge, 'id'>[] = [
  // 1. Entrance -> Arrival Junction
  {
    from: 'entrance',
    to: 'jct_arrival',
    distanceMeters: 65,
    points: [[24, 89], [26, 84], [28, 79]],
    surface: 'paved arrival boulevard',
    landmark: 'grand stone pillars and lantern posts'
  },
  // 2. Arrival Junction -> Reception
  {
    from: 'jct_arrival',
    to: 'reception',
    distanceMeters: 55,
    points: [[28, 79], [31, 75], [34, 72]],
    surface: 'covered arrival walkway',
    landmark: 'tropical palm driveway'
  },
  // 3. Reception -> Central Promenade Fork
  {
    from: 'reception',
    to: 'jct_central',
    distanceMeters: 80,
    points: [[34, 72], [38, 66], [42, 60]],
    surface: 'central stone promenade',
    landmark: 'illuminated inner courtyard'
  },
  // 4. Central Promenade Fork -> West Chalet Crossroad
  {
    from: 'jct_central',
    to: 'jct_chalet_cross',
    distanceMeters: 85,
    points: [[42, 60], [38, 51], [33, 42]],
    surface: 'bamboo-lined cobblestone path',
    landmark: 'tall bamboo hedge'
  },
  // 5. West Chalet Crossroad -> Forest Cottages
  {
    from: 'jct_chalet_cross',
    to: 'cottages',
    distanceMeters: 90,
    points: [[33, 42], [32, 33], [32, 25]],
    surface: 'cedar-bordered chalet path',
    landmark: 'wooden chalet lanterns'
  },
  // 6. West Chalet Crossroad -> Restaurant Pavilion Terrace
  {
    from: 'jct_chalet_cross',
    to: 'jct_dining_terrace',
    distanceMeters: 75,
    points: [[33, 42], [41, 40], [48, 38]],
    surface: 'west garden flagstone trail',
    landmark: 'flowering shrub border'
  },
  // 7. Central Promenade Fork -> Restaurant Pavilion Terrace
  {
    from: 'jct_central',
    to: 'jct_dining_terrace',
    distanceMeters: 110,
    points: [[42, 60], [45, 49], [48, 38]],
    surface: 'central garden avenue',
    landmark: 'central garden lawn'
  },
  // 8. Restaurant Pavilion Terrace -> Restaurant
  {
    from: 'jct_dining_terrace',
    to: 'restaurant',
    distanceMeters: 45,
    points: [[48, 38], [48, 32], [49, 27]],
    surface: 'pavilion arrival steps',
    landmark: 'The Forest Pavilion cedar veranda'
  },
  // 9. Restaurant Pavilion Terrace -> Pool Promenade West
  {
    from: 'jct_dining_terrace',
    to: 'jct_pool_promenade',
    distanceMeters: 60,
    points: [[48, 38], [53, 41], [58, 44]],
    surface: 'illuminated dining-to-pool path',
    landmark: 'terrace fountain'
  },
  // 10. Restaurant -> Pool Promenade West
  {
    from: 'restaurant',
    to: 'jct_pool_promenade',
    distanceMeters: 70,
    points: [[49, 27], [54, 35], [58, 44]],
    surface: 'veranda promenade',
    landmark: 'outdoor dining deck'
  },
  // 11. Pool Promenade West -> Swimming Pool
  {
    from: 'jct_pool_promenade',
    to: 'pool',
    distanceMeters: 65,
    points: [[58, 44], [58, 51], [63, 52], [67, 49]],
    surface: 'teak pool boardwalk',
    landmark: 'poolside cabanas and turquoise lagoon'
  },
  // 12. Central Promenade Fork -> Lotus Spa
  {
    from: 'jct_central',
    to: 'spa',
    distanceMeters: 65,
    points: [[42, 60], [48, 60], [55, 60]],
    surface: 'covered zen walkway',
    landmark: 'zen water feature and teak screens'
  },
  // 13. Lotus Spa -> Pool Promenade West
  {
    from: 'spa',
    to: 'jct_pool_promenade',
    distanceMeters: 75,
    points: [[55, 60], [56, 52], [58, 44]],
    surface: 'palm-lined wellness path',
    landmark: 'lush tropical palms'
  },
  // 14. Lotus Spa -> Pool Garden Junction
  {
    from: 'spa',
    to: 'jct_pool_garden',
    distanceMeters: 75,
    points: [[55, 60], [63, 59], [72, 57]],
    surface: 'orchid garden path',
    landmark: 'stone aromatherapy burner'
  },
  // 15. Swimming Pool -> Pool Garden Junction
  {
    from: 'pool',
    to: 'jct_pool_garden',
    distanceMeters: 60,
    points: [[67, 49], [70, 53], [72, 57]],
    surface: 'east poolside path',
    landmark: 'pool towel kiosk'
  },
  // 16. Pool Garden Junction -> Botanical Garden
  {
    from: 'jct_pool_garden',
    to: 'garden',
    distanceMeters: 55,
    points: [[72, 57], [75, 61], [78, 65]],
    surface: 'cobblestone botanical trail',
    landmark: 'ornate wooden gazebo'
  },
  // 17. Botanical Garden -> Garden Canopy Junction
  {
    from: 'garden',
    to: 'jct_garden_adventure',
    distanceMeters: 65,
    points: [[78, 65], [79, 70], [80, 75]],
    surface: 'canopy trail heading south',
    landmark: 'flowering hibiscus arches'
  },
  // 18. Garden Canopy Junction -> Canopy Adventure Zone
  {
    from: 'jct_garden_adventure',
    to: 'adventure',
    distanceMeters: 60,
    points: [[80, 75], [82, 80], [84, 86]],
    surface: 'pine needle woodland trail',
    landmark: 'rope suspension bridges and obstacle platforms'
  },
  // 19. Arrival Junction -> South Forest Trailhead
  {
    from: 'jct_arrival',
    to: 'jct_adventure_trail',
    distanceMeters: 130,
    points: [[28, 79], [40, 81], [52, 82]],
    surface: 'south scenic nature trail',
    landmark: 'mossy boulder garden'
  },
  // 20. South Forest Trailhead -> Garden Canopy Junction
  {
    from: 'jct_adventure_trail',
    to: 'jct_garden_adventure',
    distanceMeters: 140,
    points: [[52, 82], [66, 78], [80, 75]],
    surface: 'stream-side nature trail',
    landmark: 'wooden creek bridge'
  },
  // 21. South Forest Trailhead -> Canopy Adventure Zone
  {
    from: 'jct_adventure_trail',
    to: 'adventure',
    distanceMeters: 150,
    points: [[52, 82], [68, 84], [84, 86]],
    surface: 'south adventure approach',
    landmark: 'climbing harness check station'
  }
];

// Build bi-directional adjacency map
export interface AdjacencyEdge {
  targetId: string;
  distanceMeters: number;
  points: [number, number][];
  surface: string;
  landmark: string;
}

const adjacency: Record<string, AdjacencyEdge[]> = {};

// Initialize adjacency lists
Object.keys(graphNodes).forEach((nodeId) => {
  adjacency[nodeId] = [];
});

rawEdges.forEach((edge) => {
  // Forward edge
  adjacency[edge.from].push({
    targetId: edge.to,
    distanceMeters: edge.distanceMeters,
    points: edge.points,
    surface: edge.surface,
    landmark: edge.landmark
  });

  // Reverse edge with reversed points
  const revPoints = [...edge.points].reverse() as [number, number][];
  adjacency[edge.to].push({
    targetId: edge.from,
    distanceMeters: edge.distanceMeters,
    points: revPoints,
    surface: edge.surface,
    landmark: edge.landmark
  });
});

interface PrevRecord {
  nodeId: string;
  edge: AdjacencyEdge;
}

/**
 * Dijkstra Shortest Path Algorithm
 */
export function findShortestPath(startId: string, endId: string): {
  nodeIds: string[];
  totalDistance: number;
  points: [number, number][];
  edges: AdjacencyEdge[];
} {
  if (startId === endId) {
    const node = graphNodes[startId];
    return {
      nodeIds: [startId],
      totalDistance: 0,
      points: node ? [[node.x, node.y]] : [],
      edges: []
    };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, PrevRecord | null> = {};
  const unvisited = new Set<string>();

  Object.keys(graphNodes).forEach((id) => {
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((id) => {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        currentId = id;
      }
    });

    if (currentId === null || minDistance === Infinity) break;
    if (currentId === endId) break; // Reached target

    unvisited.delete(currentId);

    const neighbors = adjacency[currentId] || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.targetId)) continue;
      const alt = distances[currentId] + edge.distanceMeters;
      if (alt < distances[edge.targetId]) {
        distances[edge.targetId] = alt;
        previous[edge.targetId] = { nodeId: currentId, edge };
      }
    }
  }

  // Reconstruct path from endId back to startId
  const pathNodes: string[] = [];
  const pathEdges: AdjacencyEdge[] = [];
  let curr: string | null = endId;

  while (curr !== null) {
    pathNodes.unshift(curr);
    const prevInfo: PrevRecord | null = previous[curr];
    if (prevInfo) {
      pathEdges.unshift(prevInfo.edge);
      curr = prevInfo.nodeId;
    } else {
      break;
    }
  }

  // If start node not reached, return fallback
  if (pathNodes[0] !== startId) {
    const s = graphNodes[startId];
    const e = graphNodes[endId];
    return {
      nodeIds: [startId, endId],
      totalDistance: 250,
      points: [[s?.x || 24, s?.y || 89], [e?.x || 67, e?.y || 49]],
      edges: []
    };
  }

  // Stitch together continuous points
  const allPoints: [number, number][] = [];
  pathEdges.forEach((edge, idx) => {
    edge.points.forEach((pt, ptIdx) => {
      if (idx > 0 && ptIdx === 0) return; // avoid duplicate junction vertex
      allPoints.push(pt);
    });
  });

  return {
    nodeIds: pathNodes,
    totalDistance: distances[endId],
    points: allPoints,
    edges: pathEdges
  };
}

/**
 * Calculate turn angle between two consecutive vector segments
 * Screen coordinates: x increases Right (East), y increases Down (South).
 * delta > 0: clockwise (Turn Right)
 * delta < 0: counter-clockwise (Turn Left)
 */
function calculateTurnType(
  prevPt: [number, number],
  midPt: [number, number],
  nextPt: [number, number]
): TurnType {
  const uX = midPt[0] - prevPt[0];
  const uY = midPt[1] - prevPt[1];
  const vX = nextPt[0] - midPt[0];
  const vY = nextPt[1] - midPt[1];

  const angle1 = Math.atan2(uY, uX) * (180 / Math.PI);
  const angle2 = Math.atan2(vY, vX) * (180 / Math.PI);

  let delta = angle2 - angle1;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;

  if (Math.abs(delta) <= 22) return 'straight';
  if (delta > 22 && delta <= 55) return 'slight_right';
  if (delta > 55 && delta <= 125) return 'turn_right';
  if (delta > 125 && delta <= 160) return 'sharp_right';
  if (delta < -22 && delta >= -55) return 'slight_left';
  if (delta < -55 && delta >= -125) return 'turn_left';
  if (delta < -125 && delta >= -160) return 'sharp_left';
  return 'uturn';
}

/**
 * Build Turn-by-Turn Guidance Steps from Path Nodes
 */
export function buildRoute(fromId: string, toId: string): RouteData {
  const fromNode = graphNodes[fromId] || graphNodes.entrance;
  const toNode = graphNodes[toId] || graphNodes.pool;

  if (fromId === toId) {
    return {
      fromId,
      toId,
      fromName: fromNode.name,
      toName: toNode.name,
      totalDistanceMeters: 0,
      distance: '0m',
      duration: 'You are here',
      steps: ['You have arrived at your destination.'],
      navigationSteps: [
        {
          stepIndex: 1,
          instruction: `You are currently at ${toNode.name}.`,
          turnType: 'arrive',
          distanceMeters: 0,
          distanceText: '0m',
          fromNodeId: fromId,
          toNodeId: toId,
          fromNodeName: fromNode.name,
          toNodeName: toNode.name,
          pathPoints: [[fromNode.x, fromNode.y]],
          visualImage: toNode.image,
          landmarkHint: toNode.description
        }
      ],
      points: [[fromNode.x, fromNode.y]],
      nodeIds: [fromId]
    };
  }

  const { nodeIds, totalDistance, points, edges } = findShortestPath(fromId, toId);

  // Generate NavigationStep objects for each leg
  const navigationSteps: NavigationStep[] = [];
  const textSteps: string[] = [];

  for (let i = 0; i < nodeIds.length - 1; i++) {
    const curId = nodeIds[i];
    const nxtId = nodeIds[i + 1];
    const curNode = graphNodes[curId];
    const nxtNode = graphNodes[nxtId];
    const edge = edges[i];

    let turn: TurnType = 'straight';
    if (i === 0) {
      turn = 'depart';
    } else {
      const prvId = nodeIds[i - 1];
      const prvNode = graphNodes[prvId];
      turn = calculateTurnType(
        [prvNode.x, prvNode.y],
        [curNode.x, curNode.y],
        [nxtNode.x, nxtNode.y]
      );
    }

    // Compose rich human-readable instruction
    let instruction = '';
    const surfaceName = edge?.surface || 'walking path';
    const landmarkText = edge?.landmark ? `near the ${edge.landmark}` : '';

    if (turn === 'depart') {
      instruction = `Depart ${curNode.name} and follow the ${surfaceName} toward ${nxtNode.shortName || nxtNode.name}.`;
    } else if (turn === 'straight') {
      instruction = `Continue straight past ${curNode.name} along the ${surfaceName} (${edge.distanceMeters}m).`;
    } else if (turn === 'turn_right') {
      instruction = `Turn right at ${curNode.name} onto the ${surfaceName} toward ${nxtNode.shortName || nxtNode.name}.`;
    } else if (turn === 'slight_right') {
      instruction = `Bear slightly right at ${curNode.name} along the ${surfaceName}.`;
    } else if (turn === 'sharp_right') {
      instruction = `Take a sharp right at ${curNode.name} onto the ${surfaceName}.`;
    } else if (turn === 'turn_left') {
      instruction = `Turn left at ${curNode.name} onto the ${surfaceName} toward ${nxtNode.shortName || nxtNode.name}.`;
    } else if (turn === 'slight_left') {
      instruction = `Bear slightly left at ${curNode.name} along the ${surfaceName}.`;
    } else if (turn === 'sharp_left') {
      instruction = `Take a sharp left at ${curNode.name} onto the ${surfaceName}.`;
    } else {
      instruction = `Make a U-turn at ${curNode.name} toward ${nxtNode.shortName || nxtNode.name}.`;
    }

    const stepObj: NavigationStep = {
      stepIndex: i + 1,
      instruction,
      turnType: turn,
      distanceMeters: edge?.distanceMeters || 50,
      distanceText: `${edge?.distanceMeters || 50}m`,
      fromNodeId: curId,
      toNodeId: nxtId,
      fromNodeName: curNode.name,
      toNodeName: nxtNode.name,
      pathPoints: edge?.points || [[curNode.x, curNode.y], [nxtNode.x, nxtNode.y]],
      visualImage: nxtNode.image || curNode.image,
      landmarkHint: landmarkText || nxtNode.description
    };

    navigationSteps.push(stepObj);
    textSteps.push(instruction);
  }

  // Final Arrival Step
  navigationSteps.push({
    stepIndex: navigationSteps.length + 1,
    instruction: `Destination reached! You have arrived at ${toNode.name}.`,
    turnType: 'arrive',
    distanceMeters: 0,
    distanceText: '0m',
    fromNodeId: nodeIds[nodeIds.length - 1],
    toNodeId: toId,
    fromNodeName: toNode.name,
    toNodeName: toNode.name,
    pathPoints: [[toNode.x, toNode.y]],
    visualImage: toNode.image,
    landmarkHint: `Welcome to ${toNode.name}. Scan any nearby QR to check-in.`
  });
  textSteps.push(`Arrive safely at ${toNode.name}.`);

  // Walking duration estimate (average walking speed 70 meters per minute)
  const durationMins = Math.max(1, Math.round(totalDistance / 70 * 10) / 10);
  const durationStr = durationMins < 1.5 
    ? '1 min walk' 
    : `${durationMins} mins walk`;

  return {
    fromId,
    toId,
    fromName: fromNode.name,
    toName: toNode.name,
    totalDistanceMeters: totalDistance,
    distance: `${totalDistance}m`,
    duration: durationStr,
    steps: textSteps,
    navigationSteps,
    points,
    nodeIds
  };
}

// All available QR codes for physical stations and junctions
export const allQRCodes = Object.values(graphNodes).map((node) => ({
  id: node.id,
  qrCodeId: node.qrCodeId,
  name: node.name,
  shortName: node.shortName,
  color: node.color,
  isJunction: !!node.isJunction,
  description: node.description
}));
