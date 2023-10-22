import { Country } from '../common';
import { LocationSchema, Scope } from '../schema';

export interface Location extends LocationSchema {}

export interface FindQuery {
  country?: Country;
}

export interface FindResponse {
  regions: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'REGION'> })[];
  districts: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'DISTRICT'> })[];
  wards: (Omit<Location, 'scope'> & { scope: Extract<Scope, 'WARD'> })[];
}
