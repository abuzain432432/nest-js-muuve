import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { PropertyService } from './property.service';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @Get()
  @Roles([RolesEnum.ADMIN])
  findAll() {
    return this.propertyService.findAll();
  }
  @Get(':id')
  @Roles([RolesEnum.ADMIN])
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.propertyService.findOneById(id);
  }
}
