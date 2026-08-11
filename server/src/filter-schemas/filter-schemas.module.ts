import { Module } from '@nestjs/common';
import { FilterSchemasController } from './filter-schemas.controller';
import { FilterSchemasService } from './filter-schemas.service';

@Module({
  controllers: [FilterSchemasController],
  providers: [FilterSchemasService],
  exports: [FilterSchemasService],
})
export class FilterSchemasModule {}
