import { LocationV2Schema, Scope } from '../schema';

export interface Location extends LocationV2Schema {}

export interface FindResponse {
  regions: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'REGION'> })[];
  districts: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'DISTRICT'> })[];
  wards: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'WARD'> })[];
}
