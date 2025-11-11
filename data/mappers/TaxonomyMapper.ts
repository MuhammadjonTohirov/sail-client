import { CategoryDTO, AttributeDTO, LocationDTO } from '../models/TaxonomyDTO';
import { Category } from '../../domain/models/Category';
import { Attribute, AttributeType } from '../../domain/models/Attribute';
import { Location } from '../../domain/models/Location';

export class TaxonomyMapper {
  static categoryToDomain(dto: CategoryDTO): Category {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      icon: dto.icon,
      isLeaf: dto.is_leaf,
      parentId: dto.parent_id,
      children: dto.children?.map(child => this.categoryToDomain(child)),
    };
  }

  static categoriesToDomain(dtos: CategoryDTO[]): Category[] {
    return dtos.map(dto => this.categoryToDomain(dto));
  }

  static attributeToDomain(dto: AttributeDTO): Attribute {
    return {
      id: dto.id,
      key: dto.key,
      label: dto.label,
      type: dto.type as AttributeType,
      options: dto.options,
      required: dto.required,
      order: dto.order,
    };
  }

  static attributesToDomain(dtos: AttributeDTO[]): Attribute[] {
    return dtos.map(dto => this.attributeToDomain(dto));
  }

  static locationToDomain(dto: LocationDTO): Location {
    return {
      id: dto.id,
      name: dto.name,
      slug: dto.slug,
      parentId: dto.parent_id,
      level: dto.level,
      children: dto.children?.map(child => this.locationToDomain(child)),
    };
  }

  static locationsToDomain(dtos: LocationDTO[]): Location[] {
    return dtos.map(dto => this.locationToDomain(dto));
  }
}
