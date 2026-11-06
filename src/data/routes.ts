import type { RouteData } from '../types';
import { buildRoute } from './navigationGraph';

/**
 * Dynamic Dijkstra-based route calculation between ANY two nodes
 * in the park network (POIs, Cottages, Pools, Junctions, etc.)
 */
export function getRoute(fromId: string, toId: string): RouteData {
  return buildRoute(fromId, toId);
}
