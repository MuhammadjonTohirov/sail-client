import { Category } from '../models/Category';
import { Attribute } from '../models/Attribute';
import { Location, ReverseGeocodeLocation } from '../models/Location';

export interface ITaxonomyRepository {
  getCategories(language?: string): Promise<Category[]>;
  getCategoryAttributes(categoryId: number, language?: string): Promise<Attribute[]>;
  getLocations(parentId?: number, language?: string): Promise<Location[]>;
  reverseGeocode(lat: number, lon: number): Promise<ReverseGeocodeLocation | null>;
}
