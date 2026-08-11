import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilterSchemasService } from './filter-schemas.service';

@ApiTags('filter-schemas')
@Controller('filter-schemas')
export class FilterSchemasController {
  constructor(private readonly service: FilterSchemasService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }
}
