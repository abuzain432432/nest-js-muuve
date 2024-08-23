import { Controller, Get, Param, UsePipes, UseGuards } from '@nestjs/common';
import { PropertyService } from './property.service';
import { IsMongoIdPipe } from 'src/common/pipes/monogo-id.pipe';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesEnum } from 'src/common/enums/roles.enum';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  @Get()
  @Roles([RolesEnum.ADMIN])
  @UseGuards(RolesGuard)
  findAll() {
    return this.propertyService.findAll();
  }
  @Get(':id')
  @Roles([RolesEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UsePipes(IsMongoIdPipe)
  findOne(@Param('id', IsMongoIdPipe) id: string) {
    console.log(id);
    return this.propertyService.findOneById(id);
  }
}
